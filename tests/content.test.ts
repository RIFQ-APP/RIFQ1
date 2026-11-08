import { test } from "node:test";
import assert from "node:assert/strict";
import { HADITHS } from "../src/lib/data/hadith.ts";
import { ADHKAR } from "../src/lib/data/adhkar.ts";
import { FIQH_TOPICS } from "../src/lib/data/fiqh.ts";
import { SEERAH_TIMELINE } from "../src/lib/data/seerah.ts";
import { getReviewStatus } from "../src/lib/content.ts";

const nonEmpty = (v: unknown) => typeof v === "string" && v.trim().length > 0;
const dupes = (ids: string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);

test("الأحاديث: معرّفات فريدة ونص ومصدر ودرجة لكل حديث", () => {
  assert.deepEqual(dupes(HADITHS.map((h) => h.id)), []);
  for (const h of HADITHS) {
    assert.ok(nonEmpty(h.text), `نص فارغ: ${h.id}`);
    assert.ok(nonEmpty(h.book), `كتاب فارغ: ${h.id}`);
    assert.ok(nonEmpty(h.grade), `درجة فارغة: ${h.id}`);
    assert.ok(nonEmpty(h.gradeSource), `مصدر الدرجة فارغ: ${h.id}`);
  }
});

test("الأذكار: معرّفات فريدة ومصدر وعدد صالح لكل ذكر", () => {
  assert.deepEqual(dupes(ADHKAR.map((a) => a.id)), []);
  for (const a of ADHKAR) {
    assert.ok(nonEmpty(a.text), `نص فارغ: ${a.id}`);
    assert.ok(nonEmpty(a.source), `مصدر فارغ: ${a.id}`);
    assert.ok(Number.isInteger(a.count) && a.count >= 1, `عدد غير صالح: ${a.id}`);
  }
});

test("الفقه والسيرة: كل عنصر له مصدر واحد على الأقل", () => {
  assert.deepEqual(dupes(FIQH_TOPICS.map((t) => t.id)), []);
  assert.deepEqual(dupes(SEERAH_TIMELINE.map((e) => e.id)), []);
  for (const t of FIQH_TOPICS) {
    assert.ok(t.sources.length > 0 && t.sources.every(nonEmpty), `بلا مصدر: ${t.id}`);
  }
  for (const e of SEERAH_TIMELINE) {
    assert.ok(e.sources.length > 0 && e.sources.every(nonEmpty), `بلا مصدر: ${e.id}`);
  }
});

test("حالة المراجعة: الافتراضي قيد المراجعة ولا شيء يُعلَّم مراجَعاً تلقائياً", () => {
  assert.equal(getReviewStatus({}), "needs_review");
  assert.equal(getReviewStatus({ reviewStatus: "reviewed" }), "reviewed");
  const all = [...HADITHS, ...ADHKAR, ...FIQH_TOPICS, ...SEERAH_TIMELINE];
  assert.equal(all.filter((i) => i.reviewStatus === "reviewed").length, 0);
});
