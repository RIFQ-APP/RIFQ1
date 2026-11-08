"use client";

import { useState } from "react";
import Link from "next/link";
import BackToLibrary from "@/components/BackToLibrary";
import Header from "@/components/Header";
import SourceNotice from "@/components/SourceNotice";
import Footer from "@/components/Footer";
import { TAFSIR_EDITIONS } from "@/lib/data/tafsir";
import { SURAH_NAMES_AR } from "@/lib/quran";
import { IconSparkles } from "@/components/icons";
import PageHeader from "@/components/PageHeader";

export default function TafsirHomePage() {
  const [step, setStep] = useState<"surah" | "source">("surah");
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [filter, setFilter] = useState("");

  const surahs = Object.entries(SURAH_NAMES_AR).filter(
    ([n, name]) => !filter || name.includes(filter) || n === filter
  );

  return (
    <>
      <Header />
      <BackToLibrary />
      <main className="flex-1 mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <PageHeader
          icon={<IconSparkles size={22} />}
          kicker="التفسير"
          title="موسوعة التفسير"
        />
        <p className="text-muted-foreground text-sm mb-6">
          اختر السورة أولاً، ثم المصدر — أو قارن عدة تفاسير لآية واحدة.
        </p>

        {/* خطوات */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <button
            type="button"
            onClick={() => setStep("surah")}
            className={`px-4 py-2 rounded-full font-medium ${
              step === "surah" ? "bg-primary text-primary-foreground" : "bg-secondary"
            }`}
          >
            1. اختر السورة
          </button>
          <span className="text-muted-foreground">←</span>
          <button
            type="button"
            disabled={!selectedSurah}
            onClick={() => selectedSurah && setStep("source")}
            className={`px-4 py-2 rounded-full font-medium ${
              step === "source" ? "bg-primary text-primary-foreground" : "bg-secondary"
            } disabled:opacity-40`}
          >
            2. اختر المصدر
          </button>
        </div>

        {step === "surah" && (
          <>
            <input
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="ابحث عن سورة..."
              className="w-full max-w-md rounded-xl border border-input bg-card px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {surahs.map(([num, name]) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setSelectedSurah(Number(num));
                    setStep("source");
                  }}
                  className={`card p-3 text-sm text-right hover:border-primary/40 transition-soft flex items-center gap-2 ${
                    selectedSurah === Number(num) ? "border-primary ring-1 ring-primary" : ""
                  }`}
                >
                  <span className="h-7 w-7 flex items-center justify-center rounded-full bg-secondary text-primary text-xs font-bold shrink-0">
                    {num}
                  </span>
                  <span className="truncate font-medium">{name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === "source" && selectedSurah && (
          <>
            <div className="card p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">السورة المختارة</p>
                <p className="font-bold text-lg">
                  {selectedSurah}. {SURAH_NAMES_AR[selectedSurah]}
                </p>
              </div>
              <button type="button" onClick={() => setStep("surah")} className="btn-secondary text-sm">
                تغيير السورة
              </button>
            </div>

            <h2 className="font-semibold mb-3">اختر مصدر التفسير</h2>
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {TAFSIR_EDITIONS.map((e) => (
                <Link
                  key={e.id}
                  href={`/tafsir/${selectedSurah}?edition=${e.id}`}
                  className="card p-5 hover:border-primary/40 transition-soft block"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{e.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary">
                      {e.level === "easy" ? "سهل" : e.level === "advanced" ? "متقدم" : "متوسط"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{e.author}</p>
                  <p className="text-sm text-muted-foreground">{e.description}</p>
                </Link>
              ))}
            </div>

            <Link
              href={`/tafsir/${selectedSurah}`}
              className="btn-primary inline-flex"
            >
              فتح السورة مع مقارنة المصادر
            </Link>
          </>
        )}
      </main>
      <SourceNotice kind="tafsir" />
      <Footer />
    </>
  );
}