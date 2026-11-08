import { NextRequest, NextResponse } from "next/server";
import { registerUser, createSession, setSessionCookie } from "@/lib/auth";
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
  password: z.string().min(8).max(128),
  name: z.string().min(2).max(80).optional(),
});

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return forbiddenOrigin();
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`register:${ip}`, 5, 15 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "محاولات كثيرة. حاول لاحقاً." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }
    const body = await readJsonLimited(req);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
    }
    const user = await registerUser(
      normalizeEmail(parsed.data.email),
      parsed.data.password,
      parsed.data.name
    );
    const token = await createSession(user);
    await setSessionCookie(token);
    return NextResponse.json({ user });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    const safe =
      msg.includes("تعذر") || msg.includes("كلمة المرور") || msg.includes("حرف")
        ? msg
        : "تعذر إنشاء الحساب. حاول مرة أخرى.";
    return NextResponse.json({ error: safe }, { status: 400 });
  }
}
