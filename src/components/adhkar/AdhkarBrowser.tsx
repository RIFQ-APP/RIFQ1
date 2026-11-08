"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ReviewBadge from "@/components/ReviewBadge";
import { ADHKAR, ADHKAR_CATEGORIES, type AdhkarItem } from "@/lib/data/adhkar";
import { normalizeArabic } from "@/lib/quran-text";
import {
  parseHisnData,
  HISN_SOURCES,
  type HisnCategory,
} from "@/lib/adhkar-remote";

type Source = "curated" | "hisn";

interface DhikrView {
  id: string;
  text: string;
  count: number;
  source: string;
  benefit?: string;
  reviewStatus?: AdhkarItem["reviewStatus"];
}

const PROGRESS_KEY = "rifq_adhkar_progress";
const today = () => new Date().toISOString().slice(0, 10);

let hisnCache: HisnCategory[] | null = null;

async function loadHisn(): Promise<HisnCategory[]> {
  if (hisnCache) return hisnCache;
  let lastErr: unknown;
  for (const url of HISN_SOURCES) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 30000);
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const parsed = parseHisnData(await res.json());
      if (parsed.length === 0) throw new Error("empty");
      hisnCache = parsed;
      return parsed;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr ?? new Error("failed");
}

function Ring({ value, total, done }: { value: number; total: number; done: boolean }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const pct = total > 0 ? Math.min(1, value / total) : 0;
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden>
      <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="5" />
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        transform="rotate(-90 32 32)"
        style={{ transition: "stroke-dashoffset .25s" }}
      />
      <text
        x="32"
        y="37"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fill="currentColor"
      >
        {done ? "✓" : total > 1 ? `${value}` : "·"}
      </text>
    </svg>
  );
}

function Card({
  item,
  count,
  fontSize,
  onTap,
  onReset,
}: {
  item: DhikrView;
  count: number;
  fontSize: number;
  onTap: () => void;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const done = count >= item.count;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${item.text}\n\n— ${item.source}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <article
      className={`card p-5 transition-soft ${done ? "border-primary/50 bg-secondary/40" : ""}`}
    >
      <p
        className="font-quran leading-[2.1] text-quran-text mb-4 whitespace-pre-line"
        style={{ fontSize }}
      >
        {item.text}
      </p>
      {item.benefit && (
        <p className="text-xs text-primary mb-3 bg-secondary/60 rounded-lg px-3 py-2 leading-relaxed">
          {item.benefit}
        </p>
      )}
      <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
        <div className="min-w-0 text-xs text-muted-foreground leading-relaxed">
          <div>
            <strong className="text-foreground">المصدر:</strong> {item.source}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <ReviewBadge status={item.reviewStatus} />
            <button type="button" onClick={copy} className="hover:text-primary">
              {copied ? "تم النسخ ✓" : "نسخ"}
            </button>
            {count > 0 && (
              <button type="button" onClick={onReset} className="hover:text-primary">
                إعادة
              </button>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onTap}
          disabled={done}
          aria-label={`عدّاد: ${count} من ${item.count}`}
          className={`shrink-0 rounded-full transition-soft active:scale-95 ${
            done ? "text-primary" : "text-primary hover:bg-secondary"
          }`}
        >
          <Ring value={count} total={item.count} done={done} />
          {item.count > 1 && (
            <span className="block text-center text-[10px] text-muted-foreground -mt-1 tabular-nums">
              {count}/{item.count}
            </span>
          )}
        </button>
      </div>
    </article>
  );
}

export default function AdhkarBrowser() {
  const [source, setSource] = useState<Source>("curated");
  const [category, setCategory] = useState<string>("morning");
  const [q, setQ] = useState("");
  const [fontSize, setFontSize] = useState(22);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [hisn, setHisn] = useState<HisnCategory[] | null>(hisnCache);
  const [hisnLoading, setHisnLoading] = useState(false);
  const [hisnError, setHisnError] = useState(false);
  const [hisnCat, setHisnCat] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.date === today() && d.counts) setCounts(d.counts);
      }
      const fs = Number(localStorage.getItem("rifq_adhkar_font"));
      if (fs >= 16 && fs <= 36) setFontSize(fs);
    } catch {}
  }, []);

  const persist = useCallback((next: Record<string, number>) => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify({ date: today(), counts: next }));
    } catch {}
  }, []);

  const bump = (id: string, max: number) =>
    setCounts((c) => {
      const next = { ...c, [id]: Math.min((c[id] ?? 0) + 1, max) };
      persist(next);
      try {
        navigator.vibrate?.(10);
      } catch {}
      return next;
    });

  const reset = (id: string) =>
    setCounts((c) => {
      const next = { ...c };
      delete next[id];
      persist(next);
      return next;
    });

  const changeFont = (d: number) =>
    setFontSize((s) => {
      const n = Math.min(36, Math.max(16, s + d));
      try {
        localStorage.setItem("rifq_adhkar_font", String(n));
      } catch {}
      return n;
    });

  const fetchHisn = useCallback(async () => {
    setHisnLoading(true);
    setHisnError(false);
    try {
      const data = await loadHisn();
      setHisn(data);
      setHisnCat((c) => c ?? data[0]?.id ?? null);
    } catch {
      setHisnError(true);
    } finally {
      setHisnLoading(false);
    }
  }, []);

  useEffect(() => {
    if (source === "hisn" && !hisn && !hisnLoading && !hisnError) fetchHisn();
  }, [source, hisn, hisnLoading, hisnError, fetchHisn]);

  const curatedItems: DhikrView[] = useMemo(
    () =>
      ADHKAR.filter((a) => a.category === category).map((a) => ({
        id: `c:${a.id}`,
        text: a.text,
        count: a.count,
        source: a.source,
        benefit: a.benefit,
        reviewStatus: a.reviewStatus,
      })),
    [category]
  );

  const hisnItems: DhikrView[] = useMemo(() => {
    if (!hisn) return [];
    const cat = hisn.find((c) => c.id === hisnCat);
    return (cat?.items ?? []).map((it) => ({
      id: `h:${cat!.id}:${it.id}`,
      text: it.text,
      count: it.count,
      source: `حصن المسلم — ${cat!.title}`,
      reviewStatus: "needs_review" as const,
    }));
  }, [hisn, hisnCat]);

  const searchHits: DhikrView[] = useMemo(() => {
    const nq = normalizeArabic(q);
    if (nq.length < 2) return [];
    const all: DhikrView[] = [
      ...ADHKAR.map((a) => ({
        id: `c:${a.id}`,
        text: a.text,
        count: a.count,
        source: a.source,
        benefit: a.benefit,
        reviewStatus: a.reviewStatus,
      })),
      ...(hisn ?? []).flatMap((c) =>
        c.items.map((it) => ({
          id: `h:${c.id}:${it.id}`,
          text: it.text,
          count: it.count,
          source: `حصن المسلم — ${c.title}`,
          reviewStatus: "needs_review" as const,
        }))
      ),
    ];
    return all.filter((x) => normalizeArabic(x.text).includes(nq)).slice(0, 50);
  }, [q, hisn]);

  const list = q.trim().length >= 2 ? searchHits : source === "curated" ? curatedItems : hisnItems;
  const doneCount = list.filter((i) => (counts[i.id] ?? 0) >= i.count).length;
  const resetAll = () => {
    setCounts((c) => {
      const next = { ...c };
      list.forEach((i) => delete next[i.id]);
      persist(next);
      return next;
    });
  };

  return (
    <div>
      <div className="mb-4 flex rounded-xl bg-secondary p-1 text-sm">
        {([
          ["curated", `المختارة (${ADHKAR.length})`],
          ["hisn", "حصن المسلم الكامل"],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setSource(id)}
            className={`flex-1 rounded-lg px-3 py-2 font-medium transition-soft ${
              source === id ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث في الأذكار…"
          className="flex-1 rounded-xl border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button type="button" onClick={() => changeFont(-2)} className="h-10 w-10 rounded-lg bg-secondary font-bold" aria-label="تصغير الخط">
          −
        </button>
        <button type="button" onClick={() => changeFont(2)} className="h-10 w-10 rounded-lg bg-secondary font-bold" aria-label="تكبير الخط">
          +
        </button>
      </div>

      {q.trim().length < 2 && source === "curated" && (
        <div className="mb-5 flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {ADHKAR_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition-soft ${
                category === c.id ? "bg-primary text-primary-foreground" : "bg-secondary"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {q.trim().length < 2 && source === "hisn" && hisn && (
        <div className="mb-5">
          <label className="block text-xs text-muted-foreground mb-1">
            الباب ({hisn.length} باباً)
          </label>
          <select
            value={hisnCat ?? ""}
            onChange={(e) => setHisnCat(e.target.value)}
            className="w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm"
          >
            {hisn.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.items.length})
              </option>
            ))}
          </select>
        </div>
      )}

      {source === "hisn" && hisnLoading && (
        <p className="py-12 text-center text-sm text-muted-foreground">جاري تحميل حصن المسلم…</p>
      )}
      {source === "hisn" && hisnError && (
        <div className="py-10 text-center text-sm">
          <p className="mb-3 text-muted-foreground">تعذر تحميل المجموعة الكاملة. تحقق من الاتصال.</p>
          <button type="button" className="btn-primary text-sm" onClick={fetchHisn}>
            إعادة المحاولة
          </button>
        </div>
      )}

      {list.length > 0 && (
        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            أنجزت {doneCount} من {list.length} اليوم
          </span>
          <button type="button" onClick={resetAll} className="hover:text-primary">
            إعادة العدّاد
          </button>
        </div>
      )}
      {list.length > 0 && (
        <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${(doneCount / list.length) * 100}%` }}
          />
        </div>
      )}

      <div className="space-y-4">
        {list.map((item) => (
          <Card
            key={item.id}
            item={item}
            count={counts[item.id] ?? 0}
            fontSize={fontSize}
            onTap={() => bump(item.id, item.count)}
            onReset={() => reset(item.id)}
          />
        ))}
      </div>

      {list.length === 0 && !hisnLoading && !hisnError && (
        <p className="py-12 text-center text-muted-foreground">
          {q.trim().length >= 2 ? "لا نتائج مطابقة." : "لا أذكار في هذا القسم."}
        </p>
      )}
    </div>
  );
}
