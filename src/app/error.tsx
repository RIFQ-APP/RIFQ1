"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-xl font-bold mb-2">تعذر عرض الصفحة مؤقتاً</h1>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">
        قد يكون السبب انقطاعاً قصيراً في الشبكة. أعد المحاولة أو افتح المصحف من القائمة.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm"
        >
          إعادة المحاولة
        </button>
        <Link href="/quran" className="px-4 py-2 rounded-xl border border-border text-sm">
          المصحف
        </Link>
        <Link href="/tafsir" className="px-4 py-2 rounded-xl border border-border text-sm">
          التفسير
        </Link>
        <Link href="/" className="px-4 py-2 rounded-xl border border-border text-sm">
          الرئيسية
        </Link>
      </div>
    </div>
  );
}
