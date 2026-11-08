/**
 * بيانات وصفية مشتركة للمحتوى الشرعي.
 * القاعدة: لا يُعرض نص شرعي بلا مصدر، ولا يُعدّ مراجَعاً إلا بتعيين صريح من مراجع.
 */
export type ReviewStatus = "reviewed" | "needs_review" | "draft";

export const REVIEW_STATUS_LABEL: Record<ReviewStatus, string> = {
  reviewed: "مراجَع",
  needs_review: "قيد المراجعة",
  draft: "مسودة",
};

/** غياب الحالة يعني «قيد المراجعة» — لا يُفترض أن المحتوى مراجَع أبداً */
export function getReviewStatus(item: { reviewStatus?: ReviewStatus }): ReviewStatus {
  return item.reviewStatus ?? "needs_review";
}
