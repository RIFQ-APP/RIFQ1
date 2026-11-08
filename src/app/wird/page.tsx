"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { IconCheck } from "@/components/icons";
import PageHeader from "@/components/PageHeader";

type Wird = {
  quranMinutes: number;
  hifzDone: boolean;
  adhkarMorning: boolean;
  adhkarEvening: boolean;
  note: string;
};

const empty = (): Wird => ({
  quranMinutes: 0,
  hifzDone: false,
  adhkarMorning: false,
  adhkarEvening: false,
  note: "",
});

function key() {
  return `rifq_wird_${new Date().toISOString().slice(0, 10)}`;
}

export default function WirdPage() {
  const [w, setW] = useState<Wird>(empty());
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key());
      if (raw) setW(JSON.parse(raw));
      const s = localStorage.getItem("rifq_wird_streak");
      if (s) setStreak(parseInt(s, 10) || 0);
    } catch {}
  }, []);

  const save = (next: Wird) => {
    setW(next);
    localStorage.setItem(key(), JSON.stringify(next));
    const done =
      next.quranMinutes >= 10 ||
      next.hifzDone ||
      next.adhkarMorning ||
      next.adhkarEvening;
    if (done) {
      const today = new Date().toISOString().slice(0, 10);
      const last = localStorage.getItem("rifq_wird_last");
      if (last !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const ns = last === yesterday ? streak + 1 : 1;
        setStreak(ns);
        localStorage.setItem("rifq_wird_streak", String(ns));
        localStorage.setItem("rifq_wird_last", today);
      }
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-lg px-4 py-10">
        <div className="text-center mb-8">
          <PageHeader
          icon={<IconCheck size={22} />}
          kicker="اليوم"
          title="ورد اليوم"
        />
          <p className="text-sm text-muted-foreground">
            خطوات صغيرة ثابتة — سلسلة أيامك:{" "}
            <span className="text-primary font-semibold">{streak}</span>
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium">قراءة قرآن (دقائق)</span>
              <span className="text-primary font-bold">{w.quranMinutes}</span>
            </div>
            <input
              type="range"
              min={0}
              max={60}
              step={5}
              value={w.quranMinutes}
              onChange={(e) => save({ ...w, quranMinutes: parseInt(e.target.value, 10) })}
              className="w-full accent-[var(--primary)]"
            />
            <Link href="/quran" className="text-xs text-primary mt-2 inline-block">
              فتح المصحف ←
            </Link>
          </div>

          {[
            { k: "hifzDone" as const, label: "راجع / حفظ اليوم", href: "/hifz" },
            { k: "adhkarMorning" as const, label: "أذكار الصباح", href: "/adhkar" },
            { k: "adhkarEvening" as const, label: "أذكار المساء", href: "/adhkar" },
          ].map((item) => (
            <label
              key={item.k}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 cursor-pointer hover:border-primary/30 transition-soft"
            >
              <input
                type="checkbox"
                checked={w[item.k]}
                onChange={(e) => save({ ...w, [item.k]: e.target.checked })}
                className="h-5 w-5 rounded border-border accent-[var(--primary)]"
              />
              <span className="flex-1 font-medium text-sm">{item.label}</span>
              <Link
                href={item.href}
                className="text-xs text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                فتح
              </Link>
            </label>
          ))}

          <div className="rounded-2xl border border-border bg-card p-4">
            <label className="text-sm font-medium mb-2 block">ملاحظة اليوم</label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              placeholder="شيء تريد تذكّره غداً..."
              value={w.note}
              onChange={(e) => save({ ...w, note: e.target.value })}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}