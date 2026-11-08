"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { RECITERS } from "@/lib/quran";

interface AudioPlayerProps {
  surahNumber: number;
  totalAyahs: number;
  currentAyah: number;
  onAyahChange: (ayah: number) => void;
  reciter?: string;
  onReciterChange?: (reciter: string) => void;
}

export default function AudioPlayer({
  surahNumber,
  totalAyahs,
  currentAyah,
  onAyahChange,
  reciter = "ar.alafasy",
  onReciterChange,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repeatMode, setRepeatMode] = useState<"off" | "ayah" | "surah">("off");
  const [speed, setSpeed] = useState(1);

  // بناء رابط الصوت من everyayah (أكثر استقراراً للآية الواحدة)
  const getAudioUrl = useCallback(
    (ayah: number) => {
      const folderMap: Record<string, string> = {
        "ar.alafasy": "Alafasy_128kbps",
        "ar.abdulbasitmurattal": "Abdul_Basit_Murattal_192kbps",
        "ar.husary": "Husary_128kbps",
        "ar.minshawi": "Minshawy_Murattal_128kbps",
        "ar.shaatree": "Abu_Bakr_Ash-Shaatree_128kbps",
        "ar.hudhaify": "Hudhaify_128kbps",
      };
      const folder = folderMap[reciter] || "Alafasy_128kbps";
      const s = String(surahNumber).padStart(3, "0");
      const a = String(ayah).padStart(3, "0");
      return `https://everyayah.com/data/${folder}/${s}${a}.mp3`;
    },
    [surahNumber, reciter]
  );

  const playAyah = useCallback(
    async (ayah: number) => {
      if (!audioRef.current) return;
      setIsLoading(true);
      setError(null);
      try {
        const url = getAudioUrl(ayah);
        audioRef.current.src = url;
        audioRef.current.playbackRate = speed;
        await audioRef.current.play();
        setIsPlaying(true);
        onAyahChange(ayah);
      } catch (e) {
        setError("تعذر تشغيل التلاوة. تحقق من الاتصال.");
        setIsPlaying(false);
      } finally {
        setIsLoading(false);
      }
    },
    [getAudioUrl, onAyahChange, speed]
  );

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      playAyah(currentAyah);
    }
  };

  const handleEnded = () => {
    if (repeatMode === "ayah") {
      playAyah(currentAyah);
      return;
    }
    if (currentAyah < totalAyahs) {
      playAyah(currentAyah + 1);
    } else if (repeatMode === "surah") {
      playAyah(1);
    } else {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  });

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  return (
    <div className="sticky bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur shadow-lg">
      <audio ref={audioRef} preload="none" />
      <div className="mx-auto max-w-4xl px-4 py-3">
        {/* شريط التحكم */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* أزرار التشغيل */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => currentAyah > 1 && playAyah(currentAyah - 1)}
              disabled={currentAyah <= 1 || isLoading}
              className="h-9 w-9 flex items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground disabled:opacity-40 transition-soft"
              aria-label="الآية السابقة"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
            </button>

            <button
              type="button"
              onClick={togglePlay}
              disabled={isLoading}
              className="h-11 w-11 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60 transition-soft"
              aria-label={isPlaying ? "إيقاف" : "تشغيل"}
            >
              {isLoading ? (
                <span className="animate-pulse text-xs">...</span>
              ) : isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>

            <button
              type="button"
              onClick={() => currentAyah < totalAyahs && playAyah(currentAyah + 1)}
              disabled={currentAyah >= totalAyahs || isLoading}
              className="h-9 w-9 flex items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground disabled:opacity-40 transition-soft"
              aria-label="الآية التالية"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 18h2V6h-2zm-11-6 8.5-6v12z"/></svg>
            </button>
          </div>

          {/* معلومات */}
          <div className="text-sm text-muted-foreground">
            الآية <span className="font-medium text-foreground">{currentAyah}</span> / {totalAyahs}
          </div>

          {/* خيارات */}
          <div className="flex items-center gap-2">
            {/* التكرار */}
            <select
              value={repeatMode}
              onChange={(e) => setRepeatMode(e.target.value as "off" | "ayah" | "surah")}
              className="text-xs rounded-md border border-input bg-background px-2 py-1.5"
              aria-label="وضع التكرار"
            >
              <option value="off">بدون تكرار</option>
              <option value="ayah">تكرار الآية</option>
              <option value="surah">تكرار السورة</option>
            </select>

            {/* السرعة */}
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="text-xs rounded-md border border-input bg-background px-2 py-1.5"
              aria-label="سرعة التشغيل"
            >
              <option value={0.75}>0.75×</option>
              <option value={1}>1×</option>
              <option value={1.25}>1.25×</option>
              <option value={1.5}>1.5×</option>
            </select>

            {/* القارئ */}
            <select
              value={reciter}
              onChange={(e) => onReciterChange?.(e.target.value)}
              className="text-xs rounded-md border border-input bg-background px-2 py-1.5 max-w-[140px]"
              aria-label="اختر القارئ"
            >
              {(RECITERS || []).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p className="mt-2 text-xs text-destructive text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
