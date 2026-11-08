"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TAFSIR_EDITIONS } from "@/lib/data/tafsir";

interface Ayah {
  numberInSurah: number;
  text: string;
}

interface Props {
  surahNumber: number;
  surahName: string;
  ayahs: Ayah[];
}

interface TafsirResult {
  editionId: string;
  name: string;
  author: string;
  level: string;
  text: string;
  source: string;
}

export default function TafsirSurahClient({ surahNumber, surahName, ayahs }: Props) {
  const searchParams = useSearchParams();
  const initialEdition = searchParams.get("edition") || "muyassar";

  const [selectedAyah, setSelectedAyah] = useState(1);
  const [editionId, setEditionId] = useState(initialEdition);
  const [mode, setMode] = useState<"single" | "compare">(
    searchParams.get("edition") ? "single" : "single"
  );
  const [loading, setLoading] = useState(false);
  const [single, setSingle] = useState<TafsirResult | null>(null);
  const [multi, setMulti] = useState<TafsirResult[] | null>(null);
  const [ayahList, setAyahList] = useState<Ayah[]>(ayahs);

  useEffect(() => {
    setAyahList(ayahs);
    if (ayahList.length > 0) return;
    let cancelled = false;
    fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const list = (d?.data?.ayahs || []).map((a: { numberInSurah: number; text: string }) => ({
          numberInSurah: a.numberInSurah,
          text: a.text,
        }));
        setAyahList(list);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [surahNumber, ayahs]);

  useEffect(() => {
    const ed = searchParams.get("edition");
    if (ed) {
      setEditionId(ed);
      setMode("single");
    }
  }, [searchParams]);

  const loadSingle = useCallback(
    async (ayah: number, ed: string) => {
      setLoading(true);
      setMulti(null);
      try {
        const res = await fetch(
          `/api/tafsir?surah=${surahNumber}&ayah=${ayah}&edition=${ed}`
        );
        if (res.ok) {
          const data = await res.json();
          setSingle(data.tafsir || data);
        } else {
          setSingle(null);
        }
      } catch {
        setSingle(null);
      } finally {
        setLoading(false);
      }
    },
    [surahNumber]
  );

  const loadMulti = useCallback(
    async (ayah: number) => {
      setLoading(true);
      setSingle(null);
      try {
        const res = await fetch(
          `/api/tafsir?surah=${surahNumber}&ayah=${ayah}&multi=1`
        );
        if (res.ok) {
          const data = await res.json();
          setMulti(data.tafsirs || []);
        } else {
          setMulti([]);
        }
      } catch {
        setMulti([]);
      } finally {
        setLoading(false);
      }
    },
    [surahNumber]
  );

  useEffect(() => {
    if (mode === "single") loadSingle(selectedAyah, editionId);
    else loadMulti(selectedAyah);
  }, [selectedAyah, editionId, mode, loadSingle, loadMulti]);

  const currentAyah = ayahs.find((a) => a.numberInSurah === selectedAyah);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <Link href="/tafsir" className="text-sm text-muted-foreground hover:text-primary">
            ← موسوعة التفسير
          </Link>
          <h1 className="text-2xl font-bold mt-1">تفسير سورة {surahName}</h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("single")}
            className={`px-3 py-1.5 rounded-full text-sm ${
              mode === "single" ? "bg-primary text-primary-foreground" : "bg-secondary"
            }`}
          >
            مصدر واحد
          </button>
          <button
            type="button"
            onClick={() => setMode("compare")}
            className={`px-3 py-1.5 rounded-full text-sm ${
              mode === "compare" ? "bg-primary text-primary-foreground" : "bg-secondary"
            }`}
          >
            مقارنة
          </button>
        </div>
      </div>

      {mode === "single" && (
        <div className="flex flex-wrap gap-2 mb-4">
          {TAFSIR_EDITIONS.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setEditionId(e.id)}
              className={`px-3 py-1 rounded-full text-xs ${
                editionId === e.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary"
              }`}
            >
              {e.name}
            </button>
          ))}
        </div>
      )}

      <div className="card p-4 mb-4">
        <label className="text-xs text-muted-foreground block mb-2">
          رقم الآية ({ayahList.length})
        </label>
        <input
          type="range"
          min={1}
          max={ayahList.length}
          value={selectedAyah}
          onChange={(e) => setSelectedAyah(Number(e.target.value))}
          className="w-full"
        />
        <p className="text-center text-sm mt-2 font-medium">الآية {selectedAyah}</p>
        {currentAyah && (
          <p className="font-quran text-xl leading-loose text-center mt-3 text-quran-text">
            {currentAyah.text}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {loading && (
          <p className="text-center text-muted-foreground py-8 text-sm">جاري التحميل...</p>
        )}

        {!loading && mode === "single" && single && (
          <article className="card p-5">
            <h3 className="font-bold text-primary mb-1">
              {single.name || TAFSIR_EDITIONS.find((e) => e.id === editionId)?.name}
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              {single.author || TAFSIR_EDITIONS.find((e) => e.id === editionId)?.author}
            </p>
            <p className="text-sm leading-8 whitespace-pre-line">
              {single.text || "لا يتوفر نص لهذه الآية في هذا المصدر."}
            </p>
          </article>
        )}

        {!loading && mode === "compare" && multi && (
          multi.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">لا نتائج</p>
          ) : (
            multi.map((t, i) => (
              <article key={i} className="card p-5">
                <h3 className="font-bold text-primary text-sm mb-1">{t.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{t.author}</p>
                <p className="text-sm leading-8 whitespace-pre-line">{t.text}</p>
              </article>
            ))
          )
        )}
      </div>

      <div className="mt-6 flex gap-2">
        <Link href={`/quran/${surahNumber}`} className="btn-secondary text-sm">
          فتح المصحف
        </Link>
      </div>
    </div>
  );
}
