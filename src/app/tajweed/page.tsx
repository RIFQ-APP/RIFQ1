import Link from "next/link";
import BackToLibrary from "@/components/BackToLibrary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TAJWEED_LESSONS } from "@/lib/data/tajweed";
import { IconMic, IconBookOpen } from "@/components/icons";

export const metadata = {
  title: "أكاديمية التجويد",
  description: "مسار متدرج لتعلّم أحكام التجويد",
};

const levels = [
  { id: "beginner", label: "مبتدئ", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200" },
  { id: "intermediate", label: "متوسط", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200" },
  { id: "advanced", label: "متقدم", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200" },
];

export default function TajweedPage() {
  const sorted = [...TAJWEED_LESSONS].sort((a, b) => a.order - b.order);

  return (
    <>
      <Header />
      <BackToLibrary />
      <main className="flex-1 mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary mb-3">
            <IconMic size={14} />
            مسار متدرج
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">أكاديمية التجويد</h1>
          <p className="text-muted-foreground">
            مسار متدرج من المقدمات إلى الأحكام. كل درس يتضمن تعريفاً وأمثلة وأخطاء شائعة ومراجع.
          </p>
        </div>

        <div className="card p-5 mb-8 bg-secondary/40">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">تنبيه:</strong> هذه دروس نظرية مساعدة.
            لا تُغني عن التلقي من معلم متقن، ولا نقدم تقييماً آلياً للتلاوة كبديل عن الشيخ المؤهل.
          </p>
        </div>

        <div className="space-y-3">
          {sorted.filter(Boolean).map((lesson) => {
            const level = levels.find((l) => l.id === lesson.level) || levels[0];
            return (
              <Link
                key={lesson.id}
                href={`/tajweed/${lesson.id}`}
                className="card p-5 flex items-start gap-4 transition-soft hover:border-primary/40 group"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary font-bold text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-soft">
                  {lesson.order}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="font-semibold text-foreground group-hover:text-primary transition-soft">
                      {lesson.title}
                    </h2>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${level.color}`}>
                      {level.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{lesson.summary}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
