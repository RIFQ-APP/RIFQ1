"use client";

import { useState, useEffect } from "react";
import BackToLibrary from "@/components/BackToLibrary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { IconCalendar } from "@/components/icons";
import PageHeader from "@/components/PageHeader";

interface DayPlan {
  date: string;
  reading: boolean;
  hifz: boolean;
  adhkar: boolean;
  tajweed: boolean;
  note: string;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadPlans(): Record<string, DayPlan> {
  try {
    return JSON.parse(localStorage.getItem("rifq_plan") || "{}");
  } catch {
    return {};
  }
}

export default function PlanPage() {
  const [plans, setPlans] = useState<Record<string, DayPlan>>({});
  const [selected, setSelected] = useState(todayKey());

  useEffect(() => {
    setPlans(loadPlans());
  }, []);

  const save = (next: Record<string, DayPlan>) => {
    setPlans(next);
    localStorage.setItem("rifq_plan", JSON.stringify(next));
  };

  const day: DayPlan = plans[selected] || {
    date: selected,
    reading: false,
    hifz: false,
    adhkar: false,
    tajweed: false,
    note: "",
  };

  const update = (patch: Partial<DayPlan>) => {
    const updated = { ...day, ...patch, date: selected };
    save({ ...plans, [selected]: updated });
  };

  // آخر 14 يوماً
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().slice(0, 10);
  });

  const weekDone = days.slice(-7).filter((d) => {
    const p = plans[d];
    return p && (p.reading || p.hifz || p.adhkar || p.tajweed);
  }).length;

  return (
    <>
      <Header />
      <BackToLibrary />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <PageHeader
          icon={<IconCalendar size={22} />}
          kicker="التنظيم"
          title="خطة التعلم"
        />
        <p className="text-muted-foreground text-sm mb-6">
          خطط مرنة ليومك. لا تفرض كمية محددة — فقط تتبع ما أنجزت برفق.
        </p>

        <div className="card p-4 mb-6 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">أيام نشطة هذا الأسبوع</span>
          <span className="text-2xl font-bold text-primary">{weekDone}/7</span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-3 mb-6">
          {days.map((d) => {
            const p = plans[d];
            const active = p && (p.reading || p.hifz || p.adhkar || p.tajweed);
            const isSel = d === selected;
            const label = d.slice(8);
            return (
              <button
                key={d}
                type="button"
                onClick={() => setSelected(d)}
                className={`shrink-0 h-12 w-12 rounded-xl text-sm font-medium transition-soft ${
                  isSel
                    ? "bg-primary text-primary-foreground"
                    : active
                    ? "bg-secondary text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-semibold">مهام {selected}</h2>
          {(
            [
              ["reading", "قراءة قرآن", "/quran"],
              ["hifz", "حفظ / مراجعة", "/hifz"],
              ["adhkar", "أذكار", "/adhkar"],
              ["tajweed", "درس تجويد", "/tajweed"],
            ] as const
          ).map(([key, label, href]) => (
            <div key={key} className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-3 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={day[key]}
                  onChange={(e) => update({ [key]: e.target.checked })}
                  className="h-5 w-5 rounded border-input"
                />
                <span className={day[key] ? "line-through text-muted-foreground" : ""}>{label}</span>
              </label>
              <Link href={href} className="text-xs text-primary hover:underline">
                فتح
              </Link>
            </div>
          ))}

          <div>
            <label className="block text-sm text-muted-foreground mb-1">ملاحظة اليوم</label>
            <textarea
              value={day.note}
              onChange={(e) => update({ note: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="ما الذي تريد تذكره؟"
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}