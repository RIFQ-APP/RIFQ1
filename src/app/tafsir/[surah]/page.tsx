import { Suspense } from "react";
import Link from "next/link";
import BackToLibrary from "@/components/BackToLibrary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSurah, SURAH_NAMES_AR } from "@/lib/quran";
import TafsirSurahClient from "@/components/tafsir/TafsirSurahClient";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ surah: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { surah } = await params;
  const num = parseInt(surah, 10);
  const name = SURAH_NAMES_AR[num] || `سورة ${num}`;
  return { title: `تفسير ${name}`, description: `تفسير آيات سورة ${name}` };
}

export default async function TafsirSurahPage({ params }: PageProps) {
  const { surah } = await params;
  const surahNumber = parseInt(surah, 10);
  if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    return (
      <>
        <Header />
      <BackToLibrary />
        <main className="flex-1 mx-auto max-w-4xl px-4 py-16 text-center">
          <p className="text-muted-foreground mb-4">سورة غير صالحة.</p>
          <Link href="/tafsir" className="btn-primary inline-block">
            العودة للتفسير
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const data = await getSurah(surahNumber);
  const nameAr = SURAH_NAMES_AR[surahNumber] || data?.name || `سورة ${surahNumber}`;
  const ayahs = (data?.ayahs ?? []).map((a) => ({
    numberInSurah: a.numberInSurah,
    text: a.text,
  }));

  return (
    <>
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <p className="text-center py-12 text-muted-foreground">جاري التحميل...</p>
          }
        >
          <TafsirSurahClient
            surahNumber={surahNumber}
            surahName={nameAr}
            ayahs={ayahs}
          />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
