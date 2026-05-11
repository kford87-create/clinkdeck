export const INQUIRY_STATUSES = ["NEW", "REPLIED"] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const BUDGETS = [
  "Under $10k",
  "$10k – $25k",
  "$25k – $50k",
  "$50k – $100k",
  "$100k+",
  "Not sure yet",
] as const;
export type Budget = (typeof BUDGETS)[number];

export const TIMELINES = [
  "ASAP",
  "Within 1 month",
  "1–3 months",
  "3+ months",
  "Just exploring",
] as const;
export type Timeline = (typeof TIMELINES)[number];
