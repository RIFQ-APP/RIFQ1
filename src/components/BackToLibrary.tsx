import Link from "next/link";

export default function BackToLibrary() {
  return (
    <div className="border-b border-border bg-background">
      <div className="mx-auto max-w-5xl px-4 py-2 sm:px-6 lg:px-8">
        <Link
          href="/library"
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-muted-foreground hover:bg-secondary hover:text-primary transition-soft"
        >
          <span aria-hidden>→</span>
          العودة إلى المكتبة
        </Link>
      </div>
    </div>
  );
}
