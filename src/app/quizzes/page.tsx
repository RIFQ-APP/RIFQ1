"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BackToLibrary from "@/components/BackToLibrary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  QUIZ_CATEGORIES,
  QUIZ_PACKS,
  QUIZ_QUESTIONS,
  getPacksByCategory,
  getQuestionsByQuiz,
  type QuizQuestion,
} from "@/lib/data/quizzes";
import {
  IconMic,
  IconStar,
  IconHands,
  IconBook,
  IconScale,
  IconScroll,
  IconSparkles,
  IconAward,
} from "@/components/icons";

type Phase = "home" | "packs" | "quiz" | "result";
type Source = { kind: "pack"; id: string } | { kind: "category"; id: string } | { kind: "mix" } | { kind: "wrong" };

interface Stats {
  best: Record<string, number>;
  taken: number;
  answered: number;
  correct: number;
  wrong: string[];
}

const STATS_KEY = "rifq_quiz_stats_v2";
const EMPTY: Stats = { best: {}, taken: 0, answered: 0, correct: 0, wrong: [] };
const LETTERS = ["أ", "ب", "ج", "د"];
const SECONDS = 30;

const LEVEL_STYLE: Record<string, string> = {
  سهل: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
  متوسط: "bg-amber-500/15 text-amber-900 dark:text-amber-300",
  صعب: "bg-rose-500/15 text-rose-800 dark:text-rose-300",
};

const CAT_ICONS: Record<string, typeof IconBook> = {
  tajweed: IconMic,
  seerah: IconStar,
  adhkar: IconHands,
  quran: IconBook,
  fiqh: IconScale,
  hadith: IconScroll,
  aqidah: IconSparkles,
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ScoreRing({ pct }: { pct: number }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="text-primary" aria-hidden>
      <circle cx="70" cy="70" r={r} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="10" />
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct / 100)}
        transform="rotate(-90 70 70)"
      />
      <text x="70" y="78" textAnchor="middle" fontSize="30" fontWeight="700" fill="currentColor">
        {pct}%
      </text>
    </svg>
  );
}

export default function QuizzesPage() {
  const [phase, setPhase] = useState<Phase>("home");
  const [category, setCategory] = useState<string>("quran");
  const [source, setSource] = useState<Source>({ kind: "mix" });
  const [length, setLength] = useState<number>(10);
  const [timed, setTimed] = useState(false);
  const [stats, setStats] = useState<Stats>(EMPTY);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [missed, setMissed] = useState<{ q: QuizQuestion; chosen: number | null }[]>([]);
  const [left, setLeft] = useState(SECONDS);
  const startedAt = useRef<number>(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STATS_KEY);
      if (raw) setStats({ ...EMPTY, ...JSON.parse(raw) });
    } catch {}
  }, []);

  const saveStats = useCallback((next: Stats) => {
    setStats(next);
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const catCounts = useMemo(() => {
    const m: Record<string, number> = {};
    QUIZ_QUESTIONS.forEach((q) => (m[q.category] = (m[q.category] ?? 0) + 1));
    return m;
  }, []);

  const pool = useCallback((s: Source): QuizQuestion[] => {
    if (s.kind === "pack") return getQuestionsByQuiz(s.id);
    if (s.kind === "category") return QUIZ_QUESTIONS.filter((q) => q.category === s.id);
    if (s.kind === "wrong") {
      const ids = new Set(stats.wrong);
      return QUIZ_QUESTIONS.filter((q) => ids.has(q.id));
    }
    return QUIZ_QUESTIONS;
  }, [stats.wrong]);

  const start = useCallback(
    (s: Source, n: number, list?: QuizQuestion[]) => {
      const base = list ?? pool(s);
      const chosen = shuffle(base).slice(0, n >= 9999 ? base.length : n);
      if (chosen.length === 0) return;
      setSource(s);
      setQuestions(chosen);
      setIndex(0);
      setSelected(null);
      setScore(0);
      setStreak(0);
      setBestStreak(0);
      setMissed([]);
      setLeft(SECONDS);
      startedAt.current = Date.now();
      setPhase("quiz");
      window.scrollTo({ top: 0 });
    },
    [pool]
  );

  const q = questions[index];
  const answered = selected !== null;

  const choose = useCallback(
    (i: number | null) => {
      if (!q || answered) return;
      setSelected(i ?? -1);
      const ok = i === q.correctIndex;
      if (ok) {
        setScore((s) => s + 1);
        setStreak((s) => {
          const n = s + 1;
          setBestStreak((b) => Math.max(b, n));
          return n;
        });
      } else {
        setStreak(0);
        setMissed((m) => [...m, { q, chosen: i }]);
      }
    },
    [q, answered]
  );

  // مؤقت السؤال
  useEffect(() => {
    if (phase !== "quiz" || !timed || answered) return;
    if (left <= 0) {
      choose(null);
      return;
    }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timed, answered, left, choose]);

  const finish = useCallback(() => {
    const total = questions.length;
    const pct = Math.round((score / total) * 100);
    const key = source.kind === "pack" || source.kind === "category" ? `${source.kind}:${source.id}` : source.kind;
    const wrongSet = new Set(stats.wrong);
    missed.forEach((m) => wrongSet.add(m.q.id));
    // ما أُجيب عنه صحيحاً هذه المرة يُحذف من قائمة الأخطاء
    const missedIds = new Set(missed.map((m) => m.q.id));
    questions.forEach((x) => {
      if (!missedIds.has(x.id)) wrongSet.delete(x.id);
    });
    saveStats({
      best: { ...stats.best, [key]: Math.max(stats.best[key] ?? 0, pct) },
      taken: stats.taken + 1,
      answered: stats.answered + total,
      correct: stats.correct + score,
      wrong: Array.from(wrongSet).slice(-300),
    });
    setElapsed(Math.round((Date.now() - startedAt.current) / 1000));
    setPhase("result");
    window.scrollTo({ top: 0 });
  }, [questions, score, source, stats, missed, saveStats]);

  const next = useCallback(() => {
    if (index + 1 >= questions.length) {
      finish();
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setLeft(SECONDS);
  }, [index, questions.length, finish]);

  // اختصارات لوحة المفاتيح
  useEffect(() => {
    if (phase !== "quiz") return;
    const onKey = (e: KeyboardEvent) => {
      if (!answered && ["1", "2", "3", "4"].includes(e.key)) {
        const i = Number(e.key) - 1;
        if (q && i < q.options.length) choose(i);
      } else if (answered && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, answered, q, choose, next]);

  const accuracy = stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0;
  const lengths = [10, 20, 30, 50];

  /* ───────── الشاشة الرئيسية ───────── */
  const Settings = (
    <div className="card p-4 mb-6 flex flex-wrap items-center gap-x-6 gap-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">عدد الأسئلة</span>
        <div className="flex gap-1">
          {[...lengths, 9999].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setLength(n)}
              className={`rounded-lg px-3 py-1.5 text-sm tabular-nums ${
                length === n ? "bg-primary text-primary-foreground" : "bg-secondary"
              }`}
            >
              {n === 9999 ? "الكل" : n}
            </button>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" checked={timed} onChange={(e) => setTimed(e.target.checked)} className="h-4 w-4 accent-[var(--primary)]" />
        وضع التحدي ({SECONDS} ثانية لكل سؤال)
      </label>
    </div>
  );

  let body: React.ReactNode = null;

  if (phase === "home") {
    body = (
      <>
        <div className="mb-8">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary mb-3">
            <IconAward size={24} />
          </span>
          <h1 className="text-3xl font-bold mb-2">الاختبارات</h1>
          <p className="text-muted-foreground max-w-2xl">
            بنك من {QUIZ_QUESTIONS.length.toLocaleString("ar-EG")} سؤالاً في {QUIZ_CATEGORIES.length} أقسام، لكل سؤال شرحه ومصدره. اختر قسماً أو ابدأ اختباراً شاملاً.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            ["اختبارات مكتملة", stats.taken],
            ["أسئلة أجبتها", stats.answered],
            ["دقة الإجابات", `${accuracy}%`],
            ["أخطاء للمراجعة", stats.wrong.length],
          ].map(([l, v]) => (
            <div key={l as string} className="card p-4 text-center">
              <div className="text-2xl font-bold text-primary tabular-nums">{v}</div>
              <div className="text-xs text-muted-foreground mt-1">{l}</div>
            </div>
          ))}
        </div>

        {Settings}

        <div className="grid gap-3 sm:grid-cols-2 mb-8">
          <button type="button" onClick={() => start({ kind: "mix" }, length)} className="btn-primary py-4 text-base">
            اختبار شامل عشوائي
          </button>
          <button
            type="button"
            disabled={stats.wrong.length === 0}
            onClick={() => start({ kind: "wrong" }, length)}
            className="btn-secondary py-4 text-base disabled:opacity-50"
          >
            راجع أخطائي ({stats.wrong.length})
          </button>
        </div>

        <h2 className="font-semibold text-lg mb-3">الأقسام</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUIZ_CATEGORIES.map((c) => {
            const Icon = CAT_ICONS[c.id] ?? IconBook;
            const best = stats.best[`category:${c.id}`];
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setCategory(c.id);
                  setPhase("packs");
                }}
                className="card p-5 text-right transition-soft hover:border-primary/40"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Icon size={22} />
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums">{catCounts[c.id] ?? 0} سؤال</span>
                </div>
                <h3 className="font-semibold mb-1">{c.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{c.desc}</p>
                {best !== undefined && <span className="text-xs text-primary">أفضل نتيجة: {best}%</span>}
              </button>
            );
          })}
        </div>
      </>
    );
  }

  if (phase === "packs") {
    const cat = QUIZ_CATEGORIES.find((c) => c.id === category);
    const packs = getPacksByCategory(category);
    body = (
      <>
        <button type="button" onClick={() => setPhase("home")} className="mb-4 text-sm text-muted-foreground hover:text-primary">
          → كل الأقسام
        </button>
        <h1 className="text-2xl font-bold mb-1">{cat?.name}</h1>
        <p className="text-sm text-muted-foreground mb-6">{cat?.desc}</p>
        {Settings}
        <button
          type="button"
          onClick={() => start({ kind: "category", id: category }, length)}
          className="btn-primary w-full py-3 mb-6"
        >
          اختبار شامل في {cat?.name} ({catCounts[category] ?? 0} سؤال)
        </button>
        <div className="space-y-3">
          {packs.map((p) => {
            const n = getQuestionsByQuiz(p.id).length;
            const best = stats.best[`pack:${p.id}`];
            return (
              <div key={p.id} className="card p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold">{p.title}</h3>
                    <span className={`text-[11px] rounded-full px-2 py-0.5 ${LEVEL_STYLE[p.level]}`}>{p.level}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {n} سؤال · المصدر: {p.source}
                    {best !== undefined && <span className="text-primary"> · أفضل نتيجة {best}%</span>}
                  </p>
                </div>
                <button type="button" onClick={() => start({ kind: "pack", id: p.id }, length)} className="btn-primary text-sm shrink-0">
                  ابدأ
                </button>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  if (phase === "quiz" && q) {
    const pct = (index / questions.length) * 100;
    const lowTime = timed && left <= 5 && !answered;
    body = (
      <>
        <div className="sticky top-16 z-30 -mx-4 mb-6 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border">
          <div className="flex items-center justify-between text-sm mb-2">
            <button
              type="button"
              onClick={() => {
                if (confirm("إنهاء الاختبار والعودة؟")) setPhase("home");
              }}
              className="text-muted-foreground hover:text-primary"
            >
              ✕ إنهاء
            </button>
            <span className="tabular-nums font-medium">
              {index + 1} / {questions.length}
            </span>
            <span className="flex items-center gap-3">
              {streak >= 2 && <span className="text-amber-600 text-xs">🔥 {streak}</span>}
              <span className="tabular-nums text-primary font-semibold">{score} ✓</span>
              {timed && (
                <span className={`tabular-nums font-bold ${lowTime ? "text-rose-600" : ""}`}>⏱ {left}</span>
              )}
            </span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="card p-6 sm:p-8">
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-secondary px-2 py-0.5">
              {QUIZ_CATEGORIES.find((c) => c.id === q.category)?.name}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold leading-relaxed mb-6 whitespace-pre-line">{q.question}</h2>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correctIndex;
              const isChosen = selected === i;
              let cls = "border-border bg-card hover:border-primary/50 hover:bg-secondary/40";
              if (answered) {
                if (isCorrect) cls = "border-emerald-500 bg-emerald-500/10";
                else if (isChosen) cls = "border-rose-500 bg-rose-500/10";
                else cls = "border-border bg-card opacity-60";
              }
              return (
                <button
                  key={i}
                  type="button"
                  disabled={answered}
                  onClick={() => choose(i)}
                  className={`w-full rounded-xl border-2 p-4 text-right flex items-center gap-3 transition-soft ${cls}`}
                >
                  <span
                    className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${
                      answered && isCorrect
                        ? "bg-emerald-500 text-white"
                        : answered && isChosen
                        ? "bg-rose-500 text-white"
                        : "bg-secondary text-primary"
                    }`}
                  >
                    {answered && isCorrect ? "✓" : answered && isChosen ? "✕" : LETTERS[i]}
                  </span>
                  <span className="flex-1 leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="mt-6 rounded-xl bg-secondary/60 p-4 text-sm leading-relaxed">
              <p className="font-semibold mb-1">
                {selected === q.correctIndex ? "إجابة صحيحة" : selected === -1 ? "انتهى الوقت" : "إجابة غير صحيحة"}
              </p>
              <p className="text-muted-foreground">{q.explanation}</p>
              {q.source && <p className="mt-2 text-xs text-muted-foreground">المصدر: {q.source}</p>}
            </div>
          )}

          {answered && (
            <button type="button" onClick={next} className="btn-primary w-full mt-6 py-3">
              {index + 1 >= questions.length ? "عرض النتيجة" : "السؤال التالي ←"}
            </button>
          )}
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground hidden sm:block">
          اختصارات: 1–4 للاختيار، Enter للتالي
        </p>
      </>
    );
  }

  if (phase === "result") {
    const total = questions.length;
    const pct = Math.round((score / total) * 100);
    const msg =
      pct >= 90 ? "ممتاز، بارك الله في علمك" : pct >= 70 ? "جيد جداً، واصل" : pct >= 50 ? "مستوى جيد، راجع الأخطاء" : "بداية طيبة، المراجعة طريق الإتقان";
    const mm = Math.floor(elapsed / 60);
    const ss = String(elapsed % 60).padStart(2, "0");
    body = (
      <>
        <div className="card p-8 text-center mb-6">
          <div className="flex justify-center mb-4">
            <ScoreRing pct={pct} />
          </div>
          <h1 className="text-2xl font-bold mb-1">{msg}</h1>
          <p className="text-muted-foreground mb-6 tabular-nums">
            أجبت صحيحاً عن {score} من {total}
          </p>
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-sm mb-6">
            <div className="rounded-xl bg-secondary p-3">
              <div className="font-bold text-primary tabular-nums">{score}</div>
              <div className="text-xs text-muted-foreground">صحيحة</div>
            </div>
            <div className="rounded-xl bg-secondary p-3">
              <div className="font-bold text-rose-600 tabular-nums">{total - score}</div>
              <div className="text-xs text-muted-foreground">خاطئة</div>
            </div>
            <div className="rounded-xl bg-secondary p-3">
              <div className="font-bold tabular-nums">{mm}:{ss}</div>
              <div className="text-xs text-muted-foreground">الزمن</div>
            </div>
          </div>
          {bestStreak >= 3 && <p className="text-xs text-amber-600 mb-4">🔥 أطول سلسلة صحيحة: {bestStreak}</p>}
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => start(source, length)} className="btn-primary">
              اختبار جديد
            </button>
            {missed.length > 0 && (
              <button
                type="button"
                onClick={() => start({ kind: "wrong" }, 9999, missed.map((m) => m.q))}
                className="btn-secondary"
              >
                أعد الأسئلة الخاطئة ({missed.length})
              </button>
            )}
            <button type="button" onClick={() => setPhase("home")} className="btn-secondary">
              القائمة الرئيسية
            </button>
          </div>
        </div>

        {missed.length > 0 && (
          <>
            <h2 className="font-semibold text-lg mb-3">مراجعة الأخطاء</h2>
            <div className="space-y-3">
              {missed.map(({ q: mq, chosen }) => (
                <div key={mq.id} className="card p-4 text-sm">
                  <p className="font-semibold mb-2 whitespace-pre-line">{mq.question}</p>
                  {chosen !== null && chosen >= 0 && (
                    <p className="text-rose-700 dark:text-rose-300 mb-1">إجابتك: {mq.options[chosen]}</p>
                  )}
                  <p className="text-emerald-700 dark:text-emerald-300 mb-1">الصحيح: {mq.options[mq.correctIndex]}</p>
                  <p className="text-muted-foreground text-xs">{mq.explanation}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <Header />
      <BackToLibrary />
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        {body}
        {phase !== "quiz" && (
          <p className="mt-10 text-center text-[11px] text-muted-foreground">
            الأسئلة مبنية على بيانات المصحف والمراجع المذكورة، وحالتها «قيد المراجعة» حتى يدقّقها مختص. وفي {QUIZ_PACKS.length} باقة.
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
