import { test } from "node:test";
import assert from "node:assert/strict";
import { QUIZ_QUESTIONS, QUIZ_PACKS } from "../src/lib/data/quizzes.ts";

test("بنك الأسئلة لا يقل عن 1000 سؤال", () => {
  assert.ok(QUIZ_QUESTIONS.length >= 1000, `العدد الحالي ${QUIZ_QUESTIONS.length}`);
});

test("معرّفات الأسئلة فريدة وكل سؤال مرتبط بباقة موجودة", () => {
  const ids = QUIZ_QUESTIONS.map((q) => q.id);
  assert.equal(new Set(ids).size, ids.length);
  const packs = new Set(QUIZ_PACKS.map((p) => p.id));
  assert.equal(new Set(QUIZ_PACKS.map((p) => p.id)).size, QUIZ_PACKS.length);
  for (const q of QUIZ_QUESTIONS) assert.ok(packs.has(q.quizId), `باقة مفقودة: ${q.id} → ${q.quizId}`);
});

test("كل سؤال سليم: خيارات فريدة، إجابة صحيحة داخل المدى، شرح ومصدر", () => {
  for (const q of QUIZ_QUESTIONS) {
    assert.ok(q.question.trim().length > 0, q.id);
    assert.ok(q.options.length >= 2 && q.options.length <= 4, `${q.id}: عدد الخيارات`);
    assert.equal(new Set(q.options).size, q.options.length, `${q.id}: خيارات مكررة`);
    assert.ok(Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex < q.options.length, q.id);
    assert.ok(q.options.every((o) => o.trim().length > 0), `${q.id}: خيار فارغ`);
    assert.ok(q.explanation.trim().length > 0, `${q.id}: بلا شرح`);
    assert.ok((q.source ?? "").trim().length > 0, `${q.id}: بلا مصدر`);
  }
});

test("لا سؤال مكرر (النص + الخيارات) داخل الباقة نفسها", () => {
  const seen = new Set<string>();
  for (const q of QUIZ_QUESTIONS) {
    const k = `${q.quizId}|${q.question}|${[...q.options].sort().join("/")}`;
    assert.ok(!seen.has(k), `مكرر: ${k}`);
    seen.add(k);
  }
});

test("توزيع الإجابة الصحيحة لا ينحاز لموضع واحد في الأسئلة المولّدة", () => {
  const gen = QUIZ_QUESTIONS.filter((q) => q.id.startsWith("g") && q.options.length === 4);
  const pos = [0, 0, 0, 0];
  gen.forEach((q) => pos[q.correctIndex]++);
  for (const n of pos) assert.ok(n > gen.length * 0.15, `توزيع مائل: ${pos.join(",")}`);
});
