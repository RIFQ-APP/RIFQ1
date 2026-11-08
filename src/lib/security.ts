import type { NextRequest } from "next/server";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5000;

function sweep(now: number) {
  if (buckets.size < MAX_BUCKETS) return;
  for (const [k, b] of buckets) {
    if (now > b.resetAt) buckets.delete(k);
  }
  // لو بقيت ممتلئة نحذف الأقدم لمنع تضخم الذاكرة
  while (buckets.size >= MAX_BUCKETS) {
    const first = buckets.keys().next().value;
    if (first === undefined) break;
    buckets.delete(first);
  }
}

/** Simple in-memory rate limit (per isolate). Best-effort on serverless. */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now > b.resetAt) {
    sweep(now);
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  if (b.count >= limit) {
    return { ok: false, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

/** للاختبارات فقط */
export function _resetRateLimits() {
  buckets.clear();
}

export function clientIp(req: Pick<NextRequest, "headers">): string {
  // على Vercel يُضبط x-real-ip من المنصة ولا يمكن للعميل تزويره
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  return "unknown";
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Basic password strength for registration */
export function passwordIssues(password: string): string | null {
  if (password.length < 8) return "كلمة المرور يجب ألا تقل عن 8 أحرف";
  if (password.length > 128) return "كلمة المرور طويلة جداً";
  if (!/[A-Za-z\u0600-\u06FF]/.test(password) || !/[0-9]/.test(password)) {
    return "استخدم حروفاً وأرقاماً في كلمة المرور";
  }
  return null;
}

export function jsonError(message: string, status: number, extra?: Record<string, string | number>) {
  return Response.json({ error: message, ...extra }, { status });
}

/**
 * حماية CSRF للطلبات المغيِّرة: يجب أن يطابق Origin (أو Referer) مضيف الطلب.
 * الطلبات بلا Origin ولا Referer (أدوات سطر الأوامر) تُرفض في الإنتاج.
 */
export function isSameOrigin(
  req: Pick<Request, "headers">,
  opts: { production?: boolean } = {}
): boolean {
  const production = opts.production ?? process.env.NODE_ENV === "production";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const origin = req.headers.get("origin") || req.headers.get("referer");
  if (!origin) return !production;
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function forbiddenOrigin() {
  return jsonError("طلب غير مسموح", 403);
}

/** قراءة JSON بحد أقصى للحجم لمنع الطلبات الضخمة */
export async function readJsonLimited<T = unknown>(
  req: Pick<Request, "text">,
  maxBytes = 16 * 1024
): Promise<T | null> {
  try {
    const raw = await req.text();
    if (raw.length > maxBytes) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
