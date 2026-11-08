"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import BackToLibrary from "@/components/BackToLibrary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SURAH_NAMES_AR } from "@/lib/quran";
import { IconBrain } from "@/components/icons";
import PageHeader from "@/components/PageHeader";

const STATUSES = [
  { id: "not_started", label: "لم أبدأ", color: "bg-muted text-muted-foreground", emoji: "○" },
  { id: "learning", label: "أتعلمه", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200", emoji: "◐" },
  { id: "memorized", label: "حفظته", color: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200", emoji: "●" },
  { id: "needs_review", label: "يحتاج مراجعة", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200", emoji: "◎" },
  { id: "reviewed", label: "راجعته", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200", emoji: "✓" },
] as const;

type StatusId = (typeof STATUSES)[number]["id"];

interface HifzItem {
  surahNumber: number;
  ayahNumber: number;
  status: StatusId;
}

const AYAH_COUNTS: Record<number, number> = {
  1: 7, 2: 286, 3: 200, 4: 176, 5: 120, 6: 165, 7: 206, 8: 75, 9: 129,
  10: 109, 11: 123, 12: 111, 13: 43, 14: 52, 15: 99, 16: 128, 17: 111,
  18: 110, 19: 98, 20: 135, 21: 112, 22: 78, 23: 118, 24: 64, 25: 77,
  26: 227, 27: 93, 28: 88, 29: 69, 30: 60, 31: 34, 32: 30, 33: 73,
  34: 54, 35: 45, 36: 83, 37: 182, 38: 88, 39: 75, 40: 85, 41: 54,
  42: 53, 43: 89, 44: 59, 45: 37, 46: 35, 47: 38, 48: 29, 49: 18,
  50: 45, 51: 60, 52: 49, 53: 62, 54: 55, 55: 78, 56: 96, 57: 29,
  58: 22, 59: 24, 60: 13, 61: 14, 62: 11, 63: 11, 64: 18, 65: 12,
  66: 12, 67: 30, 68: 52, 69: 52, 70: 44, 71: 28, 72: 28, 73: 20,
  74: 56, 75: 40, 76: 31, 77: 50, 78: 40, 79: 46, 80: 42, 81: 29,
  82: 19, 83: 36, 84: 25, 85: 22, 86: 17, 87: 19, 88: 26, 89: 30,
  90: 20, 91: 15, 92: 21, 93: 11, 94: 8, 95: 8, 96: 19, 97: 5,
  98: 8, 99: 8, 100: 11, 101: 11, 102: 8, 103: 3, 104: 9, 105: 5,
  106: 4, 107: 7, 108: 3, 109: 6, 110: 3, 111: 5, 112: 4, 113: 5, 114: 6,
};

function localKey(surah: number) {
  return `rifq_hifz_${surah}`;
}

export default function HifzPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [progress, setProgress] = useState<Record<number, StatusId>>({});
  const [mode, setMode] = useState<"track" | "session" | "review">("track");
  const [sessionIndex, setSessionIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionAyahs, setSessionAyahs] = useState<number[]>([]);
  const [ayahTexts, setAyahTexts] = useState<Record<number, string>>({});
  const [loadingText, setLoadingText] = useState(false);
  const [streak, setStreak] = useState(0);

  const ayahCount = AYAH_COUNTS[selectedSurah] || 50;

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setIsLoggedIn(!!d.user))
      .catch(() => {});
    try {
      setStreak(Number(localStorage.getItem("rifq_hifz_streak") || "0"));
    } catch {}
  }, []);

  useEffect(() => {
    // تحميل محلي أولاً
    try {
      const raw = localStorage.getItem(localKey(selectedSurah));
      if (raw) setProgress(JSON.parse(raw));
      else setProgress({});
    } catch {
      setProgress({});
    }
    if (isLoggedIn) {
      fetch(`/api/hifz?surah=${selectedSurah}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (!d?.progress) return;
          const map: Record<number, StatusId> = {};
          for (const p of d.progress) map[p.ayahNumber] = p.status;
          setProgress((prev) => ({ ...prev, ...map }));
        })
        .catch(() => {});
    }
  }, [selectedSurah, isLoggedIn]);

  const saveLocal = (next: Record<number, StatusId>) => {
    setProgress(next);
    try {
      localStorage.setItem(localKey(selectedSurah), JSON.stringify(next));
    } catch {}
  };

  const setStatus = async (ayah: number, status: StatusId) => {
    const next = { ...progress, [ayah]: status };
    saveLocal(next);
    if (isLoggedIn) {
      fetch("/api/hifz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surahNumber: selectedSurah, ayahNumber: ayah, status }),
      }).catch(() => {});
    }
  };

  const stats = useMemo(() => {
    let memorized = 0, learning = 0, needsReview = 0, reviewed = 0;
    for (let i = 1; i <= ayahCount; i++) {
      const s = progress[i] || "not_started";
      if (s === "memorized") memorized++;
      else if (s === "learning") learning++;
      else if (s === "needs_review") needsReview++;
      else if (s === "reviewed") reviewed++;
    }
    return { memorized, learning, needsReview, reviewed, total: ayahCount };
  }, [progress, ayahCount]);

  const percent = Math.round(
    ((stats.memorized + stats.reviewed) / stats.total) * 100
  );

  const startSession = (type: "session" | "review") => {
    let list: number[] = [];
    if (type === "review") {
      list = Array.from({ length: ayahCount }, (_, i) => i + 1).filter(
        (a) => progress[a] === "needs_review" || progress[a] === "memorized" || progress[a] === "reviewed"
      );
      if (list.length === 0) {
        list = Array.from({ length: Math.min(5, ayahCount) }, (_, i) => i + 1);
      }
    } else {
      // جلسة حفظ: آيات لم تُحفظ بعد أو قيد التعلم
      list = Array.from({ length: ayahCount }, (_, i) => i + 1).filter(
        (a) => !progress[a] || progress[a] === "not_started" || progress[a] === "learning"
      );
      if (list.length === 0) list = [1];
      list = list.slice(0, 10);
    }
    setSessionAyahs(list);
    setSessionIndex(0);
    setRevealed(false);
    setMode(type);
    loadAyahText(list[0]);
  };

  const loadAyahText = async (ayahNum: number) => {
    if (ayahTexts[ayahNum]) return;
    setLoadingText(true);
    try {
      const res = await fetch(
        `https://api.alquran.cloud/v1/ayah/${selectedSurah}:${ayahNum}/ar.alafasy`
      );
      if (res.ok) {
        const data = await res.json();
        setAyahTexts((prev) => ({
          ...prev,
          [ayahNum]: data.data?.text || "",
        }));
      }
    } catch {}
    setLoadingText(false);
  };

  const currentSessionAyah = sessionAyahs[sessionIndex];

  const nextCard = (status?: StatusId) => {
    if (status && currentSessionAyah) setStatus(currentSessionAyah, status);
    if (sessionIndex + 1 >= sessionAyahs.length) {
      // نهاية الجلسة
      const s = Number(localStorage.getItem("rifq_hifz_streak") || "0") + 1;
      localStorage.setItem("rifq_hifz_streak", String(s));
      setStreak(s);
      setMode("track");
      return;
    }
    const next = sessionAyahs[sessionIndex + 1];
    setSessionIndex((i) => i + 1);
    setRevealed(false);
    loadAyahText(next);
  };

  // وضع التتبع أو الجلسة
  if (mode === "session" || mode === "review") {
    return (
      <>
        <Header />
      <BackToLibrary />
        <main className="flex-1 mx-auto max-w-lg px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <button type="button" onClick={() => setMode("track")} className="text-sm text-muted-foreground hover:text-primary">
              ← رجوع
            </button>
            <span className="text-sm text-muted-foreground">
              {sessionIndex + 1} / {sessionAyahs.length}
            </span>
          </div>

          <div className="card p-6 min-h-[280px] flex flex-col">
            <p className="text-xs text-muted-foreground mb-4">
              سورة {SURAH_NAMES_AR[selectedSurah]} — الآية {currentSessionAyah}
            </p>

            {!revealed ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <p className="text-4xl font-bold text-primary">{currentSessionAyah}</p>
                <p className="text-muted-foreground text-sm text-center">
                  اقرأ من حفظك ثم اكشف الآية
                </p>
                <button type="button" onClick={() => setRevealed(true)} className="btn-primary mt-4">
                  إظهار الآية
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                {loadingText && !ayahTexts[currentSessionAyah] ? (
                  <p className="text-muted-foreground text-sm">جاري التحميل...</p>
                ) : (
                  <p className="font-quran text-2xl leading-loose text-center text-quran-text mb-6">
                    {ayahTexts[currentSessionAyah] || "—"}
                  </p>
                )}
                <p className="text-xs text-muted-foreground text-center mb-4">كيف كان أداؤك؟</p>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => nextCard("memorized")} className="btn-primary text-sm py-3">
                    ✓ أتقنتها
                  </button>
                  <button type="button" onClick={() => nextCard("needs_review")} className="btn-secondary text-sm py-3">
                    تحتاج مراجعة
                  </button>
                  <button type="button" onClick={() => nextCard("learning")} className="btn-secondary text-sm py-3">
                    ما زلت أتعلم
                  </button>
                  <button type="button" onClick={() => nextCard()} className="btn-secondary text-sm py-3">
                    تخطي
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${((sessionIndex + (revealed ? 1 : 0)) / sessionAyahs.length) * 100}%` }}
            />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <PageHeader
          icon={<IconBrain size={22} />}
          kicker="الحفظ"
          title="أكاديمية الحفظ"
        />
        <p className="text-muted-foreground text-sm mb-6">
          تتبع وتدريب تفاعلي. التقدم يُحفظ على جهازك{isLoggedIn ? " وفي حسابك" : ""}.
        </p>

        {/* إحصائيات */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-primary">{percent}%</p>
            <p className="text-xs text-muted-foreground">مكتمل</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.memorized}</p>
            <p className="text-xs text-muted-foreground">محفوظ</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.needsReview}</p>
            <p className="text-xs text-muted-foreground">مراجعة</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-primary">{streak}</p>
            <p className="text-xs text-muted-foreground">سلسلة جلسات</p>
          </div>
        </div>

        {/* شريط التقدم */}
        <div className="h-3 rounded-full bg-muted overflow-hidden mb-6">
          <div className="h-full bg-primary transition-all" style={{ width: `${percent}%` }} />
        </div>

        {/* اختيار السورة + جلسات */}
        <div className="card p-4 mb-6 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs text-muted-foreground mb-1">السورة</label>
            <select
              value={selectedSurah}
              onChange={(e) => setSelectedSurah(Number(e.target.value))}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              {Object.entries(SURAH_NAMES_AR).map(([n, name]) => (
                <option key={n} value={n}>
                  {n}. {name} ({AYAH_COUNTS[Number(n)] || "?"} آية)
                </option>
              ))}
            </select>
          </div>
          <button type="button" onClick={() => startSession("session")} className="btn-primary text-sm">
            جلسة حفظ
          </button>
          <button type="button" onClick={() => startSession("review")} className="btn-secondary text-sm">
            جلسة مراجعة
          </button>
          <Link href={`/quran/${selectedSurah}`} className="btn-secondary text-sm">
            فتح المصحف
          </Link>
        </div>

        {/* شبكة الآيات */}
        <div className="card p-4">
          <div className="flex flex-wrap gap-2 mb-4 text-xs">
            {STATUSES.map((s) => (
              <span key={s.id} className={`px-2 py-1 rounded-full ${s.color}`}>
                {s.emoji} {s.label}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
            {Array.from({ length: ayahCount }, (_, i) => i + 1).map((ayah) => {
              const st = progress[ayah] || "not_started";
              const meta = STATUSES.find((s) => s.id === st)!;
              return (
                <button
                  key={ayah}
                  type="button"
                  title={`آية ${ayah}: ${meta.label}`}
                  onClick={() => {
                    const order: StatusId[] = ["not_started", "learning", "memorized", "needs_review", "reviewed"];
                    const idx = order.indexOf(st);
                    setStatus(ayah, order[(idx + 1) % order.length]);
                  }}
                  className={`h-10 rounded-lg text-xs font-medium transition-soft ${meta.color} hover:ring-2 hover:ring-primary/40`}
                >
                  {ayah}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            اضغط على رقم الآية لتغيير حالتها بالترتيب. أو ابدأ جلسة حفظ تفاعلية.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}