import Link from "next/link";
import BackToLibrary from "@/components/BackToLibrary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllSurahs, SURAH_NAMES_AR, LOCAL_SURAHS } from "@/lib/quran";
import { IconBook } from "@/components/icons";
import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "المصحف الإلكتروني",
  description: "تصفح القرآن الكريم كاملاً من مصدر موثوق",
};

export default async function QuranPage() {
  let surahs = await getAllSurahs();
  if (!surahs?.length) surahs = LOCAL_SURAHS;

  return (
    <>
      <Header />
      <BackToLibrary />
      <main className="flex-1 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          icon={<IconBook size={22} />}
          kicker="المصحف"
          title="المصحف الإلكتروني"
          lead="114 سورة — اضغط على أي سورة للقراءة والاستماع. النص من مصدر عثماني معتمد."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {surahs.map((surah) => {
            const nameAr = SURAH_NAMES_AR[surah.number] || surah.name;
            const isMakki = surah.revelationType === "Meccan";
            return (
              <Link
                key={surah.number}
                href={`/quran/${surah.number}`}
                className="card p-4 flex items-center gap-4 transition-soft hover:border-primary/40 group"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary font-bold text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-soft">
                  {surah.number}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-foreground truncate group-hover:text-primary transition-soft">
                    {nameAr}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {surah.numberOfAyahs} آية · {isMakki ? "مكية" : "مدنية"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
          <strong className="text-foreground">مصدر النص:</strong>{" "}
          API الخاص بـ alquran.cloud — نص عثماني معتمد. لا يتم توليد أو تعديل أي آية بواسطة الذكاء الاصطناعي.
        </div>
      </main>
      <Footer />
    </>
  );
}
