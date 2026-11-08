"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import BackToLibrary from "@/components/BackToLibrary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SURAH_NAMES_AR } from "@/lib/quran";
import { stripBismillah } from "@/lib/quran-text";
import { ADHKAR } from "@/lib/data/adhkar";
import { TAJWEED_LESSONS } from "@/lib/data/tajweed";
import { HADITHS } from "@/lib/data/hadith";
import { FIQH_TOPICS } from "@/lib/data/fiqh";
import {
  IconSearch,
  IconBook,
  IconScroll,
  IconHands,
  IconMic,
  IconSparkles,
  IconX,
  IconCheck,
} from "@/components/icons";
import PageHeader from "@/components/PageHeader";

type Tab = "all" | "ayahs" | "surahs" | "hadith" | "adhkar" | "tajweed" | "fiqh";

interface AyahHit {
  surah: number;
  ayah: number;
  text: string;
  surahName: string;
}

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "الكل", icon: <IconSearch size={14} /> },
  { id: "ayahs", label: "آيات", icon: <IconBook size={14} /> },
  { id: "surahs", label: "سور", icon: <IconBook size={14} /> },
  { id: "hadith", label: "حديث", icon: <IconScroll size={14} /> },
  { id: "adhkar", label: "أذكار", icon: <IconHands size={14} /> },
  { id: "tajweed", label: "تجويد", icon: <IconMic size={14} /> },
  { id: "fiqh", label: "فقه", icon: <IconSparkles size={14} /> },
];

const RECENT_KEY = "rifq_search_recent";
const MAX_RECENT = 8;

function highlightText(text: string, query: string) {
  if (!query || query.length < 2) return text;
  try {
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-accent/30 text-foreground rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  } catch {
    return text;
  }
}

function ResultCount({ n }: { n: number }) {
  if (n === 0) return null;
  return (
    <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
      {n}
    </span>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [ayahResults, setAyahResults] = useState<AyahHit[]>([]);
  const [ayahLoading, setAyahLoading] = useState(false);
  const [ayahError, setAyahError] = useState<string | null>(null);
  const [ayahSearched, setAyahSearched] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const q = query.trim();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);

  const saveRecent = useCallback((term: string) => {
    if (!term || term.length < 2) return;
    setRecent((prev) => {
      const next = [term, ...prev.filter((x) => x !== term)].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const clearRecent = () => {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {}
  };

  const searchAyahs = useCallback(async (term?: string) => {
    const searchTerm = (term ?? q).trim();
    if (!searchTerm || searchTerm.length < 2) {
      setAyahError("اكتب كلمتين على الأقل للبحث في الآيات");
      return;
    }
    setAyahLoading(true);
    setAyahError(null);
    setAyahResults([]);
    setAyahSearched(true);
    saveRecent(searchTerm);
    try {
      const res = await fetch(
        `https://api.alquran.cloud/v1/search/${encodeURIComponent(searchTerm)}/all/quran-uthmani`
      );
      if (!res.ok) throw new Error("fail");
      const data = await res.json();
      const matches = data.data?.matches || [];
      const hits: AyahHit[] = matches.slice(0, 50).map(
        (m: {
          numberInSurah: number;
          text: string;
          surah: { number: number; name?: string; englishName?: string };
        }) => ({
          surah: m.surah.number,
          ayah: m.numberInSurah,
          text: stripBismillah(m.text, m.surah.number, m.numberInSurah),
          surahName: SURAH_NAMES_AR[m.surah.number] || m.surah.name || "",
        })
      );
      setAyahResults(hits);
      if (hits.length === 0) setAyahError("لا نتائج في نص المصحف لهذه الكلمة");
    } catch {
      setAyahError("تعذر البحث. تحقق من الاتصال وحاول مجدداً.");
    } finally {
      setAyahLoading(false);
    }
  }, [q, saveRecent]);

  const surahResults = useMemo(() => {
    if (!q) return [];
    return Object.entries(SURAH_NAMES_AR)
      .filter(([num, name]) => name.includes(q) || num === q)
      .map(([num, name]) => ({ number: Number(num), name }))
      .slice(0, 20);
  }, [q]);

  const adhkarResults = useMemo(() => {
    if (!q) return [];
    return ADHKAR.filter((d) => d.text.includes(q) || d.source.includes(q)).slice(0, 12);
  }, [q]);

  const tajweedResults = useMemo(() => {
    if (!q) return [];
    return TAJWEED_LESSONS.filter(
      (l) => l.title.includes(q) || l.summary.includes(q) || l.content.includes(q)
    ).slice(0, 10);
  }, [q]);

  const hadithResults = useMemo(() => {
    if (!q) return [];
    return HADITHS.filter(
      (h) => h.text.includes(q) || h.topics.some((t) => t.includes(q))
    ).slice(0, 12);
  }, [q]);

  const fiqhResults = useMemo(() => {
    if (!q) return [];
    return FIQH_TOPICS.filter(
      (t) => t.title.includes(q) || t.summary.includes(q) || t.content.includes(q)
    ).slice(0, 8);
  }, [q]);

  const totalLocal =
    surahResults.length +
    hadithResults.length +
    adhkarResults.length +
    tajweedResults.length +
    fiqhResults.length;

  const tabCounts: Record<Tab, number> = {
    all: totalLocal + (ayahSearched ? ayahResults.length : 0),
    ayahs: ayahResults.length,
    surahs: surahResults.length,
    hadith: hadithResults.length,
    adhkar: adhkarResults.length,
    tajweed: tajweedResults.length,
    fiqh: fiqhResults.length,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "ayahs" || tab === "all") {
      searchAyahs();
    } else if (q.length >= 2) {
      saveRecent(q);
    }
  };

  const applyRecent = (term: string) => {
    setQuery(term);
    setTab("all");
    setTimeout(() => searchAyahs(term), 50);
  };

  const showEmpty =
    q.length >= 2 &&
    !ayahLoading &&
    ((tab === "ayahs" && ayahSearched && ayahResults.length === 0) ||
      (tab !== "ayahs" && tab !== "all" && tabCounts[tab] === 0) ||
      (tab === "all" && totalLocal === 0 && ayahSearched && ayahResults.length === 0));

  return (
    <>
      <Header />
      <BackToLibrary />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <PageHeader
          icon={<IconSearch size={22} />}
          kicker="البحث"
          title="البحث الشامل"
          lead="ابحث في القرآن الكريم والحديث والأذكار والتجويد والفقه — من مكان واحد."
        />

        {/* Search bar */}
        <form onSubmit={handleSubmit} className="relative mb-5">
          <div className="relative group">
            <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <IconSearch size={20} />
            </div>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.trim().length < 2) {
                  setAyahResults([]);
                  setAyahError(null);
                  setAyahSearched(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setQuery("");
                  setAyahResults([]);
                  setAyahError(null);
                  setAyahSearched(false);
                }
              }}
              placeholder="ابحث عن آية، سورة، حديث، ذكر، حكم تجويد..."
              className="w-full rounded-2xl border border-input bg-card ps-12 pe-24 py-3.5 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground/70"
              autoFocus
              autoComplete="off"
            />
            <div className="absolute inset-y-0 end-0 flex items-center gap-1 pe-2">
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setAyahResults([]);
                    setAyahError(null);
                    setAyahSearched(false);
                    inputRef.current?.focus();
                  }}
                  className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  aria-label="مسح"
                >
                  <IconX size={16} />
                </button>
              )}
              <button
                type="submit"
                disabled={ayahLoading || q.length < 2}
                className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
              >
                {ayahLoading ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-3.5 w-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    جاري
                  </span>
                ) : (
                  "بحث"
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Recent searches */}
        {!q && recent.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">عمليات بحث سابقة</span>
              <button
                type="button"
                onClick={clearRecent}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                مسح الكل
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recent.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => applyRecent(term)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/80 text-sm text-secondary-foreground hover:bg-secondary transition-colors"
                >
                  <IconSearch size={12} className="opacity-60" />
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
          {TABS.map((t) => {
            const active = tab === t.id;
            const count = q.length >= 2 ? tabCounts[t.id] : 0;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary/70 text-secondary-foreground hover:bg-secondary"
                }`}
              >
                {t.icon}
                {t.label}
                {count > 0 && (
                  <span
                    className={`inline-flex items-center justify-center min-w-[1.15rem] h-[1.15rem] px-1 rounded-full text-[10px] font-bold ${
                      active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/15 text-primary"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Ayah loading skeleton */}
        {ayahLoading && (tab === "ayahs" || tab === "all") && (
          <div className="space-y-3 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="h-3 w-28 bg-muted rounded mb-3" />
                <div className="h-5 bg-muted rounded mb-2 w-full" />
                <div className="h-5 bg-muted rounded w-4/5" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {showEmpty && (
          <div className="text-center py-16">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-muted-foreground mb-4">
              <IconSearch size={28} />
            </div>
            <p className="text-muted-foreground font-medium mb-1">لا توجد نتائج</p>
            <p className="text-sm text-muted-foreground/80">جرّب كلمات مختلفة أو تأكد من الإملاء</p>
          </div>
        )}

        {!q && !ayahLoading && (
          <div className="text-center py-12">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-primary mb-4">
              <IconSearch size={28} />
            </div>
            <p className="text-muted-foreground">اكتب كلمة أو جملة للبحث في المحتوى الإسلامي</p>
            <p className="text-xs text-muted-foreground/70 mt-2">البحث في الآيات يحتاج اتصالًا بالإنترنت</p>
          </div>
        )}

        {/* Ayah results */}
        {(tab === "ayahs" || tab === "all") && ayahResults.length > 0 && !ayahLoading && (
          <section className="mb-8">
            {tab === "all" && (
              <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
                <IconBook size={15} className="text-primary" />
                آيات القرآن
                <ResultCount n={ayahResults.length} />
              </h2>
            )}
            <div className="space-y-3">
              {ayahResults.map((a, i) => (
                <Link
                  key={`${a.surah}-${a.ayah}-${i}`}
                  href={`/quran/${a.surah}`}
                  className="card p-4 block hover:border-primary/40 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-primary group-hover:underline">
                      {a.surahName} — آية {a.ayah}
                    </span>
                    <span className="text-[11px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
                      {a.surah}:{a.ayah}
                    </span>
                  </div>
                  <p className="font-quran text-lg leading-loose text-quran-text">
                    {highlightText(a.text, q)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {ayahError && (tab === "ayahs" || tab === "all") && !ayahLoading && (
          <p className="text-center text-muted-foreground py-6 text-sm">{ayahError}</p>
        )}

        {/* Surahs */}
        {(tab === "all" || tab === "surahs") && surahResults.length > 0 && (
          <section className="mb-8">
            {tab === "all" && (
              <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
                <IconBook size={15} className="text-primary" />
                السور
                <ResultCount n={surahResults.length} />
              </h2>
            )}
            <div className="grid gap-2 sm:grid-cols-2">
              {surahResults.map((s) => (
                <Link
                  key={s.number}
                  href={`/quran/${s.number}`}
                  className="card p-3.5 flex items-center gap-3 hover:border-primary/40 hover:shadow-md transition-all group"
                >
                  <span className="h-9 w-9 flex items-center justify-center rounded-xl bg-primary/10 text-primary text-sm font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {s.number}
                  </span>
                  <span className="font-medium">{highlightText(s.name, q)}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Hadith */}
        {(tab === "all" || tab === "hadith") && hadithResults.length > 0 && (
          <section className="mb-8">
            {tab === "all" && (
              <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
                <IconScroll size={15} className="text-primary" />
                الحديث
                <ResultCount n={hadithResults.length} />
              </h2>
            )}
            <div className="space-y-2.5">
              {hadithResults.map((h) => (
                <Link
                  key={h.id}
                  href="/library/hadith"
                  className="card p-4 block hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <p className="font-quran text-[15px] leading-relaxed line-clamp-3 mb-2">
                    {highlightText(h.text, q)}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 bg-secondary px-2 py-0.5 rounded-md">
                      <IconCheck size={11} className="text-success" />
                      {h.grade}
                    </span>
                    <span>{h.book}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Adhkar */}
        {(tab === "all" || tab === "adhkar") && adhkarResults.length > 0 && (
          <section className="mb-8">
            {tab === "all" && (
              <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
                <IconHands size={15} className="text-primary" />
                الأذكار
                <ResultCount n={adhkarResults.length} />
              </h2>
            )}
            <div className="space-y-2.5">
              {adhkarResults.map((d) => (
                <Link
                  key={d.id}
                  href="/adhkar"
                  className="card p-4 block hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <p className="font-quran text-[15px] leading-relaxed line-clamp-2 mb-1.5">
                    {highlightText(d.text, q)}
                  </p>
                  <p className="text-xs text-muted-foreground">{d.source}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Tajweed */}
        {(tab === "all" || tab === "tajweed") && tajweedResults.length > 0 && (
          <section className="mb-8">
            {tab === "all" && (
              <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
                <IconMic size={15} className="text-primary" />
                التجويد
                <ResultCount n={tajweedResults.length} />
              </h2>
            )}
            <div className="space-y-2.5">
              {tajweedResults.map((l) => (
                <Link
                  key={l.id}
                  href={`/tajweed/${l.id}`}
                  className="card p-4 block hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <p className="font-medium text-sm mb-1">{highlightText(l.title, q)}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{l.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Fiqh */}
        {(tab === "all" || tab === "fiqh") && fiqhResults.length > 0 && (
          <section className="mb-8">
            {tab === "all" && (
              <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
                <IconSparkles size={15} className="text-primary" />
                الفقه
                <ResultCount n={fiqhResults.length} />
              </h2>
            )}
            <div className="space-y-2.5">
              {fiqhResults.map((t) => (
                <Link
                  key={t.id}
                  href="/library/fiqh"
                  className="card p-4 block hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <p className="font-medium text-sm mb-1">{highlightText(t.title, q)}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{t.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
