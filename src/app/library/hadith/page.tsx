"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import BackToLibrary from "@/components/BackToLibrary";
import Header from "@/components/Header";
import ReviewBadge from "@/components/ReviewBadge";
import SourceNotice from "@/components/SourceNotice";
import Footer from "@/components/Footer";
import {
  HADITHS,
  HADITH_COLLECTIONS,
  HADITH_TOPICS,
  searchHadiths,
} from "@/lib/data/hadith";
import { sectionNameAr } from "@/lib/data/hadithSectionsAr";
import { IconScroll } from "@/components/icons";
import PageHeader from "@/components/PageHeader";

/** كتب كاملة من مصدر مفتوح (fawazahmed0/hadith-api) — آلاف الأحاديث */
const FULL_BOOKS = [
  {
    id: "bukhari",
    name: "صحيح البخاري",
    edition: "ara-bukhari",
    approx: "+7500",
  },
  {
    id: "muslim",
    name: "صحيح مسلم",
    edition: "ara-muslim",
    approx: "+7500",
  },
  {
    id: "abudawud",
    name: "سنن أبي داود",
    edition: "ara-abudawud",
    approx: "+5000",
  },
  {
    id: "tirmidhi",
    name: "سنن الترمذي",
    edition: "ara-tirmidhi",
    approx: "+3900",
  },
  {
    id: "nasai",
    name: "سنن النسائي",
    edition: "ara-nasai",
    approx: "+5700",
  },
  {
    id: "ibnmajah",
    name: "سنن ابن ماجه",
    edition: "ara-ibnmajah",
    approx: "+4300",
  },
] as const;

const CDN = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions";
const CDN_FALLBACKS = [
  "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions",
  "https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions",
];

async function fetchEdition(edition: string): Promise<BookData> {
  let lastErr: unknown;
  for (const base of CDN_FALLBACKS) {
    for (const file of [`${edition}.min.json`, `${edition}.json`]) {
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 45000);
        const res = await fetch(`${base}/${file}`, { signal: ctrl.signal });
        clearTimeout(timer);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as BookData;
      } catch (e) {
        lastErr = e;
      }
    }
  }
  throw lastErr ?? new Error("fetch failed");
}

interface ApiHadith {
  hadithnumber: number;
  arabicnumber?: number | string;
  text: string;
  grades?: { name: string; grade: string }[];
  reference?: { book: number; hadith: number };
}

interface BookData {
  metadata: {
    name: string;
    sections: Record<string, string>;
    section_details?: Record<string, { hadithnumber_first: number; hadithnumber_last: number }>;
  };
  hadiths: ApiHadith[];
}

type Mode = "featured" | "full";

const PAGE_SIZE = 20;

export default function HadithPage() {
  const [mode, setMode] = useState<Mode>("full");

  // —— مختارات رِفْق ——
  const [qFeat, setQFeat] = useState("");
  const [colFeat, setColFeat] = useState("all");
  const [topicFeat, setTopicFeat] = useState("all");

  const featured = useMemo(() => {
    let list = qFeat.trim() ? searchHadiths(qFeat) : [...HADITHS];
    if (colFeat !== "all") list = list.filter((h) => h.collection === colFeat);
    if (topicFeat !== "all") list = list.filter((h) => h.topics.includes(topicFeat));
    return list;
  }, [qFeat, colFeat, topicFeat]);

  // —— الكتب الكاملة ——
  const [bookId, setBookId] = useState<string>("bukhari");
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [section, setSection] = useState<string>("all");
  const [qFull, setQFull] = useState("");
  const [page, setPage] = useState(1);
  const [cache, setCache] = useState<Record<string, BookData>>({});

  const loadBook = useCallback(
    async (id: string) => {
      const meta = FULL_BOOKS.find((b) => b.id === id);
      if (!meta) return;
      if (cache[id]) {
        setBookData(cache[id]);
        setSection("all");
        setPage(1);
        setQFull("");
        return;
      }
      setLoading(true);
      setError(null);
      setBookData(null);
      try {
        const data: BookData = await fetchEdition(meta.edition);
        setCache((c) => ({ ...c, [id]: data }));
        setBookData(data);
        setSection("all");
        setPage(1);
        setQFull("");
      } catch {
        setError("تعذر تحميل الكتاب. الملف كبير وقد يستغرق دقيقة على الاتصال البطيء؛ تحقق من الاتصال وحاول مجدداً.");
      } finally {
        setLoading(false);
      }
    },
    [cache]
  );

  useEffect(() => {
    if (mode === "full") loadBook(bookId);
  }, [mode, bookId]); // eslint-disable-line react-hooks/exhaustive-deps

  const sections = useMemo(() => {
    if (!bookData?.metadata?.sections) return [];
    return Object.entries(bookData.metadata.sections)
      .filter(([k, v]) => k !== "0" && v)
      .map(([k, v]) => ({ id: k, name: v }));
  }, [bookData]);

  const filteredFull = useMemo(() => {
    if (!bookData?.hadiths) return [];
    let list = bookData.hadiths.filter((h) => h.text && h.text.trim());

    if (section !== "all" && bookData.metadata.section_details?.[section]) {
      const det = bookData.metadata.section_details[section];
      list = list.filter(
        (h) =>
          h.hadithnumber >= det.hadithnumber_first &&
          h.hadithnumber <= det.hadithnumber_last
      );
    }

    const q = qFull.trim();
    if (q) {
      list = list.filter((h) => h.text.includes(q));
    }
    return list;
  }, [bookData, section, qFull]);

  const totalPages = Math.max(1, Math.ceil(filteredFull.length / PAGE_SIZE));
  const pageItems = filteredFull.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const currentBook = FULL_BOOKS.find((b) => b.id === bookId);

  return (
    <>
      <Header />
      <BackToLibrary />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <PageHeader
          icon={<IconScroll size={22} />}
          kicker="الحديث"
          title="مكتبة الحديث"
        />
        <p className="text-muted-foreground text-sm mb-6">
          آلاف الأحاديث من كتب السنة، مع تقسيم بالأبواب وبحث. المختارات المحلية للتعلّم السريع.
        </p>

        {/* وضع العرض */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode("full")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              mode === "full"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary"
            }`}
          >
            الكتب الكاملة (+30 ألف)
          </button>
          <button
            type="button"
            onClick={() => setMode("featured")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              mode === "featured"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary"
            }`}
          >
            مختارات رِفْق ({HADITHS.length})
          </button>
        </div>

        {/* ========== الكتب الكاملة ========== */}
        {mode === "full" && (
          <>
            <div className="flex flex-wrap gap-2 mb-4">
              {FULL_BOOKS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBookId(b.id)}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    bookId === b.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  {b.name}
                  <span className="opacity-70 text-xs mr-1"> {b.approx}</span>
                </button>
              ))}
            </div>

            {loading && (
              <p className="text-center text-muted-foreground py-16">
                جاري تحميل {currentBook?.name}... قد يستغرق ثوانٍ
              </p>
            )}
            {error && (
              <p className="text-center text-red-600 dark:text-red-400 py-12">
                {error}
                <button
                  type="button"
                  className="block mx-auto mt-3 btn-secondary text-sm"
                  onClick={() => loadBook(bookId)}
                >
                  إعادة المحاولة
                </button>
              </p>
            )}

            {bookData && !loading && (
              <>
                <div className="card p-4 mb-4 text-sm">
                  <p className="font-bold text-primary mb-1">
                    {currentBook?.name || bookData.metadata.name}
                  </p>
                  <p className="text-muted-foreground">
                    إجمالي الأحاديث في الملف:{" "}
                    <strong className="text-foreground">
                      {bookData.hadiths.length.toLocaleString("ar")}
                    </strong>
                    {" · "}
                    بعد التصفية:{" "}
                    <strong className="text-foreground">
                      {filteredFull.length.toLocaleString("ar")}
                    </strong>
                  </p>
                </div>

                <input
                  type="search"
                  value={qFull}
                  onChange={(e) => {
                    setQFull(e.target.value);
                    setPage(1);
                  }}
                  placeholder="ابحث داخل نص الأحاديث..."
                  className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-ring"
                />

                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">الباب / القسم</p>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setSection("all");
                        setPage(1);
                      }}
                      className={`px-2.5 py-1 rounded-full text-xs ${
                        section === "all"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary"
                      }`}
                    >
                      كل الأبواب
                    </button>
                    {sections.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSection(s.id);
                          setPage(1);
                        }}
                        className={`px-2.5 py-1 rounded-full text-xs ${
                          section === s.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                        }`}
                      >
                        {sectionNameAr(s.name)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {pageItems.map((h) => (
                    <article
                      key={`${bookId}-${h.hadithnumber}`}
                      className="card p-5"
                    >
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                        <span className="font-medium text-primary">
                          {currentBook?.name}
                        </span>
                        <span>
                          · رقم {h.hadithnumber}
                          {h.arabicnumber && h.arabicnumber !== h.hadithnumber
                            ? ` (${h.arabicnumber})`
                            : ""}
                        </span>
                        {h.grades?.[0] && (
                          <span className="px-2 py-0.5 rounded-full bg-secondary">
                            {h.grades[0].grade}
                          </span>
                        )}
                      </div>
                      <p className="font-quran text-base leading-loose text-quran-text whitespace-pre-line">
                        {h.text}
                      </p>
                    </article>
                  ))}
                </div>

                {filteredFull.length === 0 && (
                  <p className="text-center text-muted-foreground py-12">
                    لا نتائج لهذا البحث أو الباب.
                  </p>
                )}

                {/* ترقيم */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="btn-secondary text-sm disabled:opacity-40"
                    >
                      السابق
                    </button>
                    <span className="text-sm text-muted-foreground px-2">
                      صفحة {page} من {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      className="btn-secondary text-sm disabled:opacity-40"
                    >
                      التالي
                    </button>
                  </div>
                )}
              </>
            )}

            <div className="mt-8 p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">المصدر:</strong> نصوص الكتب
              محملة من قاعدة بيانات مفتوحة (hadith-api). البخاري ومسلم أكثر من
              7000 حديث لكلٍ منهما. للأسانيد والتخريج التفصيلي يُرجع للكتب
              المطبوعة والموسوعات المعتمدة.
            </div>
          </>
        )}

        {/* ========== مختارات ========== */}
        {mode === "featured" && (
          <>
            <input
              type="search"
              value={qFeat}
              onChange={(e) => setQFeat(e.target.value)}
              placeholder="ابحث في المختارات..."
              className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-ring"
            />

            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-2">المصدر</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setColFeat("all")}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    colFeat === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  الكل
                </button>
                {HADITH_COLLECTIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColFeat(c.id)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      colFeat === c.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs text-muted-foreground mb-2">الموضوع</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setTopicFeat("all")}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    topicFeat === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  كل الموضوعات
                </button>
                {HADITH_TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopicFeat(t)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      topicFeat === t
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              النتائج: <strong className="text-foreground">{featured.length}</strong>
            </p>

            <div className="space-y-4">
              {featured.map((h) => (
                <article key={h.id} className="card p-5">
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                    <span className="font-medium text-primary">{h.book}</span>
                    {h.number !== "—" && <span>· {h.number}</span>}
                    <span className="px-2 py-0.5 rounded-full bg-secondary">
                      {h.grade}
                    </span>
                    <ReviewBadge status={h.reviewStatus} />
                  </div>
                  <p className="font-quran text-lg leading-loose text-quran-text mb-3">
                    {h.text}
                  </p>
                  <div className="flex flex-wrap gap-1 text-xs">
                    {h.topics.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTopicFeat(t)}
                        className="px-2 py-0.5 rounded bg-muted hover:bg-secondary"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
      <SourceNotice kind="hadith" />
      <Footer />
    </>
  );
}