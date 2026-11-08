import type { ReactNode } from "react";
import Link from "next/link";

const POINTS = [
  "تتبّع حفظك ومراجعتك على كل أجهزتك",
  "مفضلتك ومرجعياتك محفوظة بأمان",
  "خطة تعلم مرنة تناسب وقتك",
];

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="mx-auto grid w-full max-w-5xl flex-1 items-stretch gap-0 px-4 py-10 sm:py-14 lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden rounded-s-3xl bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -start-24 h-72 w-72 rounded-full bg-white/10"
        />
        <div>
          <Link href="/" className="text-3xl font-bold">
            رِفْق
          </Link>
          <p className="mt-3 text-sm opacity-90 leading-relaxed">
            تعلّم برفق · افهم بعمق · استمر بثبات
          </p>
        </div>
        <ul className="space-y-4 text-sm">
          {POINTS.map((p) => (
            <li key={p} className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs">
                ✓
              </span>
              <span className="leading-relaxed">{p}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs opacity-75">القراءة والتصفح متاحان بدون حساب.</p>
      </aside>

      <section className="card rounded-3xl p-6 sm:p-10 lg:rounded-s-none">
        <Link href="/" className="mb-6 block text-2xl font-bold text-primary lg:hidden">
          رِفْق
        </Link>
        <h1 className="mb-1 text-2xl font-bold">{title}</h1>
        <p className="mb-8 text-sm text-muted-foreground">{subtitle}</p>
        {children}
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          {footer}
        </div>
      </section>
    </div>
  );
}
