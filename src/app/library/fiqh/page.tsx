"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import BackToLibrary from "@/components/BackToLibrary";
import Header from "@/components/Header";
import ReviewBadge from "@/components/ReviewBadge";
import SourceNotice from "@/components/SourceNotice";
import Footer from "@/components/Footer";
import { FIQH_TOPICS, FIQH_CATEGORIES } from "@/lib/data/fiqh";
import { IconScale } from "@/components/icons";
import PageHeader from "@/components/PageHeader";

export default function FiqhPage() {
  const [cat, setCat] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const list = useMemo(() => {
    if (cat === "all") return FIQH_TOPICS;
    return FIQH_TOPICS.filter((t) => t.category === cat);
  }, [cat]);

  return (
    <>
      <Header />
      <BackToLibrary />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <PageHeader
          icon={<IconScale size={22} />}
          kicker="الفقه"
          title="الفقه والعبادات"
        />
        <p className="text-muted-foreground text-sm mb-6">
          ملخصات تعليمية منظمة. ليست بديلاً عن سؤال أهل العلم في النوازل والفتوى الشخصية.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => setCat("all")}
            className={`px-3 py-1.5 rounded-full text-sm ${
              cat === "all" ? "bg-primary text-primary-foreground" : "bg-secondary"
            }`}
          >
            الكل ({FIQH_TOPICS.length})
          </button>
          {FIQH_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCat(c.id)}
              className={`px-3 py-1.5 rounded-full text-sm ${
                cat === c.id ? "bg-primary text-primary-foreground" : "bg-secondary"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {list.map((t) => (
            <div key={t.id} className="card overflow-hidden">
              <button
                type="button"
                className="w-full text-right p-4 flex items-center justify-between gap-3 hover:bg-secondary/30 transition-soft"
                onClick={() => setOpenId(openId === t.id ? null : t.id)}
              >
                <div>
                  <span className="font-semibold block">{t.title}</span>
                  <span className="text-xs text-muted-foreground">{t.summary}</span>
                </div>
                <span className="text-xs shrink-0 px-2 py-0.5 rounded-full bg-secondary">
                  {t.level === "beginner" ? "مبتدئ" : t.level === "advanced" ? "متقدم" : "متوسط"}
                </span>
              </button>
              {openId === t.id && (
                <div className="px-4 pb-4 border-t border-border pt-3">
                  <div className="whitespace-pre-line text-sm leading-relaxed mb-3">{t.content}</div>
                  {t.notes.length > 0 && (
                    <ul className="text-xs text-muted-foreground space-y-1 mb-2">
                      {t.notes.map((n, i) => (
                        <li key={i}>⚠ {n}</li>
                      ))}
                    </ul>
                  )}
                  <p className="text-xs text-muted-foreground">
                    المصادر: {t.sources.join(" · ")} <ReviewBadge status={t.reviewStatus} />
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/library" className="text-sm text-primary hover:underline">
            ← العودة للمكتبة
          </Link>
        </div>
      </main>
      <SourceNotice kind="fiqh" />
      <Footer />
    </>
  );
}