import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { IconHome, IconBook, IconSearch } from "@/components/icons";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <p className="text-6xl font-bold text-primary/20 mb-4">404</p>
          <h1 className="text-2xl font-bold text-foreground mb-2">الصفحة غير موجودة</h1>
          <p className="text-muted-foreground mb-8">
            عذراً، لم نعثر على الصفحة التي تبحث عنها. قد يكون الرابط قديماً أو خاطئاً.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-soft"
            >
              <IconHome size={16} />
              الرئيسية
            </Link>
            <Link
              href="/quran"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:opacity-90 transition-soft"
            >
              <IconBook size={16} />
              المصحف
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-soft"
            >
              <IconSearch size={16} />
              البحث
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
