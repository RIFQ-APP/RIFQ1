import BackToLibrary from "@/components/BackToLibrary";
import Header from "@/components/Header";
import SourceNotice from "@/components/SourceNotice";
import Footer from "@/components/Footer";
import AdhkarBrowser from "@/components/adhkar/AdhkarBrowser";

export const metadata = {
  title: "الأذكار والأدعية",
  description: "أذكار الصباح والمساء وحصن المسلم الكامل مع العداد والبحث",
};

export default function AdhkarPage() {
  return (
    <>
      <Header />
      <BackToLibrary />
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-bold mb-2">الأذكار والأدعية</h1>
        <p className="text-muted-foreground text-sm mb-6">
          مختارات موثّقة، ومجموعة «حصن المسلم» الكاملة تُحمَّل عند الطلب. اضغط الدائرة عند كل مرة، ويُحفظ إنجازك لليوم على جهازك.
        </p>
        <AdhkarBrowser />
      </main>
      <SourceNotice kind="adhkar" />
      <Footer />
    </>
  );
}
