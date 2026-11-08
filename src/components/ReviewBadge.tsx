import { REVIEW_STATUS_LABEL, getReviewStatus, type ReviewStatus } from "@/lib/content";

export default function ReviewBadge({ status }: { status?: ReviewStatus }) {
  const s = getReviewStatus({ reviewStatus: status });
  const tone =
    s === "reviewed"
      ? "bg-primary/10 text-primary"
      : "bg-secondary text-muted-foreground";
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs ${tone}`}
      title="حالة المراجعة العلمية للمحتوى"
    >
      {REVIEW_STATUS_LABEL[s]}
    </span>
  );
}
