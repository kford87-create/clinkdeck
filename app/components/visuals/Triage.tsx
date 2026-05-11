import Frame from "./Frame";

export type TriageProps = {
  themeColor: string;
  inputName: string;
  signal: string;
  buckets: string[];
};

/**
 * Visual archetype: TRIAGE.
 *
 * Three items spawn from the left, pulse through the central agent,
 * and fly into one of N labelled buckets on the right.
 */
export default function Triage({
  themeColor,
  inputName,
  signal,
  buckets,
}: TriageProps) {
  const bucketCount = Math.max(2, Math.min(4, buckets.length));
  const slice = buckets.slice(0, bucketCount);

  // Item routing: three rotating items, each one heads to a different bucket.
  const items = [0, 1, 2].map((i) => ({
    delay: i * 2,
    bucketIndex: i % bucketCount,
  }));

  return (
    <Frame themeColor={themeColor}>
      <div className="absolute inset-0 p-6 sm:p-8 flex flex-col text-white">
        {/* Top label */}
        <div className="flex items-center gap-3 text-xs sm:text-sm font-medium opacity-90">
          <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur uppercase tracking-wider text-[10px]">
            Triage
          </span>
          <span className="opacity-80">{signal}</span>
        </div>

        {/* Stage */}
        <div className="relative flex-1 mt-3">
          {/* Input column */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[18%]">
            <div className="text-[11px] uppercase tracking-wider opacity-70 mb-1">
              Input
            </div>
            <div className="rounded-lg bg-white/15 backdrop-blur border border-white/20 px-2.5 py-1.5 text-xs sm:text-sm font-medium">
              {inputName}
            </div>
          </div>

          {/* Agent (center) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/95 flex items-center justify-center text-zinc-800 font-bold text-lg shadow-lg"
              style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="9" r="1.5" fill="currentColor" />
                <circle cx="15" cy="9" r="1.5" fill="currentColor" />
                <path
                  d="M8 14c1 1.5 2.5 2 4 2s3-.5 4-2"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>

          {/* Buckets column */}
          <div
            className="absolute top-0 bottom-0 right-0 w-[28%] flex flex-col justify-around gap-2"
          >
            {slice.map((bucket, i) => (
              <div
                key={i}
                className="rounded-lg bg-white/15 backdrop-blur border border-white/30 px-3 py-2 text-xs sm:text-sm font-medium truncate"
              >
                {bucket}
              </div>
            ))}
          </div>

          {/* Animated items */}
          {items.map(({ delay, bucketIndex }, i) => {
            const yOffset = laneOffset(bucketIndex, bucketCount);
            return (
              <div
                key={i}
                className="absolute top-1/2 left-[18%] -translate-y-1/2"
                style={{
                  width: "12%",
                }}
              >
                <div
                  className="rounded-md bg-white text-zinc-800 px-2 py-1 text-[11px] font-semibold shadow"
                  style={{
                    animation: `triageItem 6s ${delay}s linear infinite`,
                    ["--y" as string]: `${yOffset}px`,
                  }}
                >
                  {shortLabel(inputName, i)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Frame>
  );
}

function laneOffset(index: number, total: number) {
  // Map bucket index 0..total-1 onto vertical positions across the right column.
  // Bucket lanes are roughly evenly spaced from -40% to +40% of the card height.
  if (total === 1) return 0;
  const min = -56;
  const max = 56;
  return Math.round(min + (index / (total - 1)) * (max - min));
}

function shortLabel(input: string, index: number) {
  // Truncate to fit on the small chip.
  const trimmed = input.length > 12 ? input.slice(0, 11) + "…" : input;
  return `${trimmed} #${index + 1}`;
}
