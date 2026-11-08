import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { normalizeEmail, passwordIssues } from "./security";

const COOKIE_NAME = "rifq_session";
const MAX_AGE = 60 * 60 * 24 * 14;

function getSecretKey(): Uint8Array {
  const s =
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.JWT_SECRET ||
    "";
  if (s.length >= 32) {
    return new TextEncoder().encode(s);
  }
  // أثناء next build فقط — لا يُستخدم لجلسات إنتاج حقيقية
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return new TextEncoder().encode("rifq-build-time-only-placeholder-secret!!");
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXTAUTH_SECRET missing or too short (min 32 chars)");
  }
  return new TextEncoder().encode("rifq-dev-only-secret-not-for-prod-32");
}

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: SessionUser): Promise<string> {
  return new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .setSubject(user.id)
    .sign(getSecretKey());
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    if (!payload.id || !payload.email) return null;
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: (payload.name as string) || null,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export async function registerUser(email: string, password: string, name?: string) {
  const e = normalizeEmail(email);
  const pwIssue = passwordIssues(password);
  if (pwIssue) throw new Error(pwIssue);

  const existing = await prisma.user.findUnique({ where: { email: e } });
  if (existing) {
    throw new Error("تعذر إنشاء الحساب. جرّب بريداً آخر أو سجّل الدخول.");
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email: e,
      passwordHash,
      name: name?.trim().slice(0, 80) || null,
      preferences: { create: {} },
    },
  });
  return { id: user.id, email: user.email, name: user.name };
}

export async function loginUser(email: string, password: string) {
  const e = normalizeEmail(email);
  const user = await prisma.user.findUnique({ where: { email: e } });
  if (!user) {
    await hashPassword(password);
    throw new Error("البريد أو كلمة المرور غير صحيحة");
  }
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) throw new Error("البريد أو كلمة المرور غير صحيحة");
  return { id: user.id, email: user.email, name: user.name };
}
