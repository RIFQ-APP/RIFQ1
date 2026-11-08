"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SURAH_NAMES_AR } from "@/lib/quran";
import { IconBookmark } from "@/components/icons";
import PageHeader from "@/components/PageHeader";

type Item = {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  note?: string;
  createdAt: string;
};

const KEY = "rifq_bookmarks";

export default function BookmarksPage() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch {
      setItems([]);
    }
  }, []);

  const remove = (id: string) => {
    const next = items.filter((x) => x.id !== id);
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-2xl px-4 py-10">
        <PageHeader
          icon={<IconBookmark size={22} />}
          kicker="محفوظاتك"
          title="المرجعيات"
        />
        <p className="text-sm text-muted-foreground mb-8">
          آيات حفظتها محلياً على هذا الجهاز (حتى بدون حساب).
        </p>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="text-muted-foreground text-sm mb-4">لا توجد مرجعيات بعد.</p>
            <Link href="/quran" className="text-primary text-sm font-medium hover:underline">
              اذهب للمصحف وأضف آية
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((it) => (
              <li
                key={it.id}
                className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/quran/${it.surahNumber}?ayah=${it.ayahNumber}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {SURAH_NAMES_AR[it.surahNumber] || `سورة ${it.surahNumber}`} — آية{" "}
                    {it.ayahNumber}
                  </Link>
                  {it.note && (
                    <p className="text-sm text-muted-foreground mt-1">{it.note}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(it.id)}
                  className="text-xs text-destructive hover:underline shrink-0"
                >
                  حذف
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  );
}