import { test } from "node:test";
import assert from "node:assert/strict";
import { checkPassword, safeNext } from "../src/lib/password-strength.ts";

test("قوة كلمة المرور", () => {
  assert.equal(checkPassword("").score, 0);
  assert.equal(checkPassword("abc").score, 0);
  assert.equal(checkPassword("abcd").score, 1);
  assert.equal(checkPassword("abcdef12").score, 2);
  assert.ok(checkPassword("Abcdef1234xyz").score >= 3);
  assert.equal(checkPassword("Abcdef1234xyz!").score, 4);
});

test("safeNext يمنع التحويل الخارجي", () => {
  assert.equal(safeNext("/quran/2"), "/quran/2");
  assert.equal(safeNext("//evil.com"), "/dashboard");
  assert.equal(safeNext("https://evil.com"), "/dashboard");
  assert.equal(safeNext("/\\evil"), "/dashboard");
  assert.equal(safeNext(null), "/dashboard");
});
