import { NextRequest, NextResponse } from "next/server";
import { loginUser, createSession, setSessionCookie } from "@/lib/auth";
import {
  clientIp,
  forbiddenOrigin,
  isSameOrigin,
  normalizeEmail,
  rateLimit,
  readJsonLimited,
} from "@/lib/security";
import { z } from "zod";

const schema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(128),
});

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return forbiddenOrigin();
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "محاولات كثيرة. انتظر قليلاً." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }
    const body = await readJsonLimited(req);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
    }
    const email = normalizeEmail(parsed.data.email);
    // حد لكل بريد لإبطاء تخمين كلمة المرور من عناوين IP متعددة
    const rlEmail = rateLimit(`login-email:${email}`, 8, 15 * 60 * 1000);
    if (!rlEmail.ok) {
      return NextResponse.json(
        { error: "محاولات كثيرة. انتظر قليلاً." },
        { status: 429, headers: { "Retry-After": String(rlEmail.retryAfterSec) } }
      );
    }
    const user = await loginUser(email, parsed.data.password);
    const token = await createSession(user);
    await setSessionCookie(token);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { error: "البريد أو كلمة المرور غير صحيحة" },
      { status: 401 }
    );
  }
}
