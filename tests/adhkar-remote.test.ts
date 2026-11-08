import { test } from "node:test";
import assert from "node:assert/strict";
import { parseHisnData } from "../src/lib/adhkar-remote.ts";

test("parseHisnData يقرأ البنية المتوقعة ويتجاهل التالف", () => {
  const r = parseHisnData([
    { id: 1, category: "باب", array: [{ id: 1, text: "نص", count: 3 }, { text: "" }, null] },
    { id: 2, category: "فارغ", array: [] },
    { nope: true },
  ]);
  assert.equal(r.length, 1);
  assert.equal(r[0].items.length, 1);
  assert.equal(r[0].items[0].count, 3);
});

test("parseHisnData يعيد مصفوفة فارغة لمدخل غير صالح ويصحّح العدد", () => {
  assert.deepEqual(parseHisnData({}), []);
  const r = parseHisnData([{ category: "ب", array: [{ text: "ن", count: "x" }, { text: "م", count: 99999 }] }]);
  assert.equal(r[0].items[0].count, 1);
  assert.equal(r[0].items[1].count, 1);
});
