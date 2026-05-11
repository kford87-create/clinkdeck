import type { InquiryStatus } from "@/app/lib/types";

const STATUS_STYLES: Record<InquiryStatus, string> = {
  NEW: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
  REPLIED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
};

export default function StatusBadge({ status }: { status: InquiryStatus }) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[status]}`}
    >
      {status.toLowerCase()}
    </span>
  );
}
