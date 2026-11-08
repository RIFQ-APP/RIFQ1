import { test } from "node:test";
import assert from "node:assert/strict";
import { stripBismillah, normalizeArabic, toArabicDigits } from "../src/lib/quran-text.ts";

const BISM = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

test("normalizeArabic يزيل التشكيل ويوحّد الألف", () => {
  assert.equal(normalizeArabic("ٱللَّهِ"), "الله");
  assert.equal(normalizeArabic("ٱلرَّحْمَٰنِ"), "الرحمن");
});

test("stripBismillah يحذف البسملة من أول آية في السور العادية", () => {
  assert.equal(stripBismillah(`${BISM} الٓمٓ`, 2, 1), "الٓمٓ");
});

test("stripBismillah لا يمس الفاتحة والتوبة وغير الآية الأولى", () => {
  assert.equal(stripBismillah(`${BISM} ثم`, 1, 1), `${BISM} ثم`);
  assert.equal(stripBismillah(`${BISM} ثم`, 9, 1), `${BISM} ثم`);
  assert.equal(stripBismillah(`${BISM} ثم`, 2, 2), `${BISM} ثم`);
});

test("stripBismillah لا يحذف شيئاً إذا لم تبدأ الآية بالبسملة", () => {
  const t = "ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ";
  assert.equal(stripBismillah(t, 2, 1), t);
});

test("toArabicDigits", () => {
  assert.equal(toArabicDigits(286), "٢٨٦");
});
