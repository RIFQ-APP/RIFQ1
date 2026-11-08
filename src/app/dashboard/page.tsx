"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SURAH_NAMES_AR } from "@/lib/quran";
import { IconUser } from "@/components/icons";
import PageHeader from "@/components/PageHeader";

interface User {
  id: string;
  email: string;
  name: string | null;
}

interface Progress {
  surahNumber: number;
  ayahNumber: number;
  updatedAt: string;
}

interface Favorite {
  id: string;
  type: string;
  surahNumber: number | null;
  ayahNumber: number | null;
  title: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [localProgress, setLocalProgress] = useState<{ surahNumber: number; ayahNumber: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch("/api/auth/me");
        if (!meRes.ok) {
          router.push("/auth/login");
          return;
        }
        const meData = await meRes.json();
        setUser(meData.user);

        const [progRes, favRes] = await Promise.all([
          fetch("/api/progress"),
          fetch("/api/favorites"),
        ]);
        if (progRes.ok) {
          const d = await progRes.json();
          setProgress(d.progress);
        }
        if (favRes.ok) {
          const d = await favRes.json();
          setFavorites(d.favorites || []);
        }
      } catch {
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    }
    load();

    // localStorage fallback
    try {
      const raw = localStorage.getItem("rifq_last_reading");
      if (raw) setLocalProgress(JSON.parse(raw));
    } catch {}
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <p className="text-muted-foreground">جاري التحميل...</p>
        </main>
        <Footer />
      </>
    );
  }

  const last = progress || localProgress;

  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="mb-2">
              <PageHeader
                icon={<IconUser size={22} />}
                kicker="حسابك"
                title={user?.name ? `مرحباً، ${user.name}` : "مرحباً"}
              />
              <p className="text-sm text-muted-foreground -mt-4">{user?.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="btn-secondary text-sm"
          >
            تسجيل الخروج
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* آخر موضع قراءة */}
          <div className="card p-6">
            <h2 className="font-semibold text-foreground mb-3">آخر موضع قراءة</h2>
            {last ? (
              <div>
                <p className="text-lg">
                  سورة {SURAH_NAMES_AR[last.surahNumber] || last.surahNumber}
                  {" — "}الآية {last.ayahNumber}
                </p>
                <Link
                  href={`/quran/${last.surahNumber}#ayah-${last.ayahNumber}`}
                  className="btn-primary text-sm mt-4 inline-block"
                >
                  متابعة القراءة
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-muted-foreground text-sm mb-3">لم تبدأ القراءة بعد</p>
                <Link href="/quran" className="btn-primary text-sm inline-block">
                  ابدأ قراءة القرآن
                </Link>
              </div>
            )}
          </div>

          {/* إحصائيات سريعة */}
          <div className="card p-6">
            <h2 className="font-semibold text-foreground mb-3">المفضلة</h2>
            <p className="text-3xl font-bold text-primary mb-1">{favorites.length}</p>
            <p className="text-sm text-muted-foreground">آية محفوظة في المفضلة</p>
          </div>
        </div>

        {/* قائمة المفضلة */}
        {favorites.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">المفضلة الأخيرة</h2>
            <div className="space-y-2">
              {favorites.slice(0, 10).map((f) => (
                <Link
                  key={f.id}
                  href={
                    f.surahNumber
                      ? `/quran/${f.surahNumber}#ayah-${f.ayahNumber}`
                      : "#"
                  }
                  className="card p-3 flex items-center justify-between hover:border-primary/30 transition-soft"
                >
                  <span className="text-sm">
                    {f.title ||
                      (f.surahNumber
                        ? `${SURAH_NAMES_AR[f.surahNumber]} ${f.ayahNumber}`
                        : f.type)}
                  </span>
                  <span className="text-xs text-muted-foreground">←</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* روابط سريعة */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/quran" className="card p-4 text-center text-sm font-medium hover:border-primary/30">
            📖 المصحف
          </Link>
          <Link href="/hifz" className="card p-4 text-center text-sm font-medium hover:border-primary/30">
            🧠 الحفظ
          </Link>
          <Link href="/adhkar" className="card p-4 text-center text-sm font-medium hover:border-primary/30">
            🤲 الأذكار
          </Link>
          <Link href="/tajweed" className="card p-4 text-center text-sm font-medium hover:border-primary/30">
            🎙️ التجويد
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}