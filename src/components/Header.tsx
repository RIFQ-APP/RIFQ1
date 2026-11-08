"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  IconBook,
  IconSparkles,
  IconBrain,
  IconMic,
  IconHands,
  IconCheck,
  IconScroll,
  IconSearch,
  IconMenu,
  IconX,
  IconUser,
  IconAward,
} from "@/components/icons";

const navItems = [
  { href: "/quran", label: "المصحف", Icon: IconBook },
  { href: "/tafsir", label: "التفسير", Icon: IconSparkles },
  { href: "/hifz", label: "الحفظ", Icon: IconBrain },
  { href: "/tajweed", label: "التجويد", Icon: IconMic },
  { href: "/adhkar", label: "الأذكار", Icon: IconHands },
  { href: "/wird", label: "الورد", Icon: IconCheck },
  { href: "/library", label: "المكتبة", Icon: IconScroll },
  { href: "/search", label: "البحث", Icon: IconSearch },
  { href: "/quizzes", label: "اختبارات", Icon: IconAward },
  // quizzes in mobile extra
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ name: string | null; email: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUser(d?.user || null))
      .catch(() => setUser(null));
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md supports-[backdrop-filter]:bg-card/80 shadow-[0_1px_3px_rgba(30,77,43,0.04)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <img
            src="/logo.svg"
            alt="رِفْق"
            className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
            width={40}
            height={40}
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary leading-tight">رِفْق</span>
            <span className="text-[10px] text-muted-foreground leading-none tracking-wider">RIFQ</span>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-0.5 flex-1 justify-center">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link text-sm font-medium inline-flex items-center gap-1.5 ${isActive ? "active" : ""}`}
              >
                <item.Icon size={15} className="opacity-80" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 shrink-0">
          <ThemeToggle />
          {user ? (
            <>
              <Link href="/dashboard" className="btn-secondary text-sm hidden sm:inline-flex">
                {user.name || "حسابي"}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-muted-foreground hover:text-primary hidden sm:inline px-2"
              >
                خروج
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn-secondary text-sm hidden sm:inline-flex">
                دخول
              </Link>
              <Link href="/auth/register" className="btn-primary text-sm">
                ابدأ
              </Link>
            </>
          )}

          <button
            type="button"
            className="xl:hidden flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="القائمة"
          >
            {mobileOpen ? <IconX size={22} /> : <IconMenu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="xl:hidden border-t border-border bg-card px-4 py-3">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link text-sm font-medium inline-flex items-center gap-2 ${pathname.startsWith(item.href) ? "active" : ""}`}
              >
                <item.Icon size={15} className="opacity-80" />
                {item.label}
              </Link>
            ))}
            <Link href="/plan" className="nav-link text-sm font-medium">
              خطة التعلم
            </Link>
            <div className="mt-2 flex gap-2 pt-2 border-t border-border">
              {user ? (
                <>
                  <Link href="/dashboard" className="btn-secondary text-sm flex-1 text-center">
                    حسابي
                  </Link>
                  <button type="button" onClick={handleLogout} className="btn-secondary text-sm flex-1">
                    خروج
                  </button>
                </>
              ) : (
                <Link href="/auth/login" className="btn-secondary text-sm flex-1 text-center">
                  دخول
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
