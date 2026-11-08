import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  _resetRateLimits,
  clientIp,
  isSameOrigin,
  normalizeEmail,
  passwordIssues,
  rateLimit,
  readJsonLimited,
} from "../src/lib/security.ts";

const req = (headers: Record<string, string>) => ({ headers: new Headers(headers) });

beforeEach(() => _resetRateLimits());

test("normalizeEmail يوحّد الحالة ويزيل الفراغات", () => {
  assert.equal(normalizeEmail("  User@Example.COM "), "user@example.com");
});

test("passwordIssues يرفض القصيرة والضعيفة ويقبل القوية", () => {
  assert.ok(passwordIssues("abc12"));
  assert.ok(passwordIssues("abcdefgh"));
  assert.ok(passwordIssues("12345678"));
  assert.ok(passwordIssues("a1".repeat(70)));
  assert.equal(passwordIssues("كلمة1234"), null);
  assert.equal(passwordIssues("Passw0rdOk"), null);
});

test("rateLimit يحجب بعد الحد ثم يعيد النافذة", async () => {
  assert.ok(rateLimit("k", 2, 50).ok);
  assert.ok(rateLimit("k", 2, 50).ok);
  const blocked = rateLimit("k", 2, 50);
  assert.equal(blocked.ok, false);
  assert.ok(blocked.retryAfterSec >= 1);
  await new Promise((r) => setTimeout(r, 60));
  assert.ok(rateLimit("k", 2, 50).ok);
});

test("rateLimit مفاتيح مستقلة", () => {
  assert.ok(rateLimit("a", 1, 1000).ok);
  assert.ok(rateLimit("b", 1, 1000).ok);
  assert.equal(rateLimit("a", 1, 1000).ok, false);
});

test("clientIp يفضّل x-real-ip ثم أول x-forwarded-for", () => {
  assert.equal(clientIp(req({ "x-real-ip": "1.1.1.1", "x-forwarded-for": "2.2.2.2" })), "1.1.1.1");
  assert.equal(clientIp(req({ "x-forwarded-for": "2.2.2.2, 3.3.3.3" })), "2.2.2.2");
  assert.equal(clientIp(req({})), "unknown");
});

test("isSameOrigin يقبل نفس المضيف ويرفض الغريب", () => {
  const p = { production: true };
  assert.equal(isSameOrigin(req({ host: "rifq.app", origin: "https://rifq.app" }), p), true);
  assert.equal(isSameOrigin(req({ host: "rifq.app", origin: "https://evil.com" }), p), false);
  assert.equal(isSameOrigin(req({ host: "rifq.app", referer: "https://rifq.app/quran" }), p), true);
  assert.equal(isSameOrigin(req({ host: "rifq.app" }), p), false);
  assert.equal(isSameOrigin(req({ host: "localhost:3000" }), { production: false }), true);
  assert.equal(isSameOrigin(req({ host: "rifq.app", origin: "not a url" }), p), false);
});

test("readJsonLimited يرفض الحجم الزائد وJSON التالف", async () => {
  const mk = (t: string) => ({ text: async () => t });
  assert.deepEqual(await readJsonLimited(mk('{"a":1}')), { a: 1 });
  assert.equal(await readJsonLimited(mk("{bad")), null);
  assert.equal(await readJsonLimited(mk(JSON.stringify({ a: "x".repeat(200) })), 50), null);
});
