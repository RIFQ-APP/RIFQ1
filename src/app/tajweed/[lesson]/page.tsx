import Link from "next/link";
import { notFound } from "next/navigation";
import BackToLibrary from "@/components/BackToLibrary";
import Header from "@/components/Header";
import { IconMic } from "@/components/icons";
import Footer from "@/components/Footer";
import { getLesson, TAJWEED_LESSONS } from "@/lib/data/tajweed";

interface PageProps {
  params: Promise<{ lesson: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { lesson } = await params;
  const data = getLesson(lesson);
  return {
    title: data?.title || "درس تجويد",
    description: data?.summary,
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { lesson } = await params;
  const data = getLesson(lesson);
  if (!data) notFound();

  const idx = TAJWEED_LESSONS.findIndex((l) => l.id === lesson);
  const prev = idx > 0 ? TAJWEED_LESSONS[idx - 1] : null;
  const next = idx < TAJWEED_LESSONS.length - 1 ? TAJWEED_LESSONS[idx + 1] : null;

  return (
    <>
      <Header />
      <BackToLibrary />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link href="/tajweed" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
          ← العودة للدروس
        </Link>

        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary mb-3"><IconMic size={20} /></div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{data.title}</h1>
        <p className="text-muted-foreground mb-8">{data.summary}</p>

        <section className="prose-sm mb-8">
          <div className="card p-6 whitespace-pre-line leading-relaxed text-foreground">
            {data.content}
          </div>
        </section>

        {data.examples.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-3">أمثلة</h2>
            <div className="space-y-3">
              {data.examples.map((ex, i) => (
                <div key={i} className="card p-4">
                  <p className="font-quran text-xl text-quran-text mb-1">{ex.text}</p>
                  <p className="text-sm text-muted-foreground">{ex.note}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.commonMistakes.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-3">أخطاء شائعة</h2>
            <ul className="card p-4 space-y-2">
              {data.commonMistakes.map((m, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-destructive">•</span> {m}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">المراجع</h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            {data.sources.map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
          </ul>
        </section>

        <div className="flex justify-between border-t border-border pt-6">
          {prev ? (
            <Link href={`/tajweed/${prev.id}`} className="btn-secondary text-sm">
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/tajweed/${next.id}`} className="btn-secondary text-sm">
              {next.title} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
