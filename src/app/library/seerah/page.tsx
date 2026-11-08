import BackToLibrary from "@/components/BackToLibrary";
import Header from "@/components/Header";
import ReviewBadge from "@/components/ReviewBadge";
import Footer from "@/components/Footer";
import { SEERAH_TIMELINE } from "@/lib/data/seerah";
import { IconMap } from "@/components/icons";
import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "السيرة النبوية",
  description: "خط زمني لأهم أحداث السيرة",
};

export default function SeerahPage() {
  return (
    <>
      <Header />
      <BackToLibrary />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <PageHeader
          icon={<IconMap size={22} />}
          kicker="السيرة"
          title="السيرة النبوية"
        />
        <p className="text-muted-foreground mb-8">
          خط زمني موجز لأهم الأحداث. مع ذكر المصادر، والتمييز بين الثابت والمشهور.
        </p>

        <div className="relative border-r-2 border-primary/30 pr-6 space-y-8">
          {SEERAH_TIMELINE.map((event) => (
            <div key={event.id} className="relative">
              <div className="absolute -right-[1.4rem] top-1 h-3 w-3 rounded-full bg-primary border-2 border-background" />
              <div className="card p-5">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-primary">{event.year}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      event.period === "makki"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                    }`}
                  >
                    {event.period === "makki" ? "مكّي" : "مدني"}
                  </span>
                </div>
                <h2 className="font-semibold text-foreground mb-2">{event.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {event.summary}
                </p>
                <p className="text-xs text-muted-foreground">
                  المصادر: {event.sources.join(" · ")} <ReviewBadge status={event.reviewStatus} />
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
          هذا ملخص تعليمي. للتفاصيل يُرجع إلى كتب السيرة المعتمدة مع مراعاة منهج المحدثين في الرواية.
        </div>
      </main>
      <Footer />
    </>
  );
}