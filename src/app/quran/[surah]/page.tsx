import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SurahReader from "@/components/quran/SurahReader";
import { getSurah, SURAH_NAMES_AR } from "@/lib/quran";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ surah: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { surah } = await params;
  const num = parseInt(surah, 10);
  const name = SURAH_NAMES_AR[num] || `سورة ${num}`;
  return {
    title: name,
    description: `قراءة سورة ${name} مع التلاوة الصوتية`,
  };
}

export default async function SurahPage({ params }: PageProps) {
  const { surah } = await params;
  const surahNumber = parseInt(surah, 10);

  if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    return (
      <>
        <Header />
        <main className="flex-1 mx-auto max-w-4xl px-4 py-16 text-center">
          <p className="text-muted-foreground mb-4">رقم السورة غير صالح.</p>
          <Link href="/quran" className="btn-primary inline-block">
            العودة إلى المصحف
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const data = await getSurah(surahNumber);
  const nameAr = SURAH_NAMES_AR[surahNumber] || data?.name || `سورة ${surahNumber}`;
  const revelationType = data?.revelationType || "Meccan";
  const ayahs = data?.ayahs ?? [];
  const prev = surahNumber > 1 ? surahNumber - 1 : null;
  const next = surahNumber < 114 ? surahNumber + 1 : null;

  return (
    <>
      <Header />
      <main className="flex-1">
        <SurahReader
          surahNumber={surahNumber}
          surahName={nameAr}
          revelationType={revelationType}
          ayahs={ayahs}
          prevSurah={prev}
          nextSurah={next}
        />
      </main>
      <Footer />
    </>
  );
}
