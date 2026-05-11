import Frame from "./Frame";

export type ScoreRouteProps = {
  themeColor: string;
  inputName: string;
  scoreLabel: string;
  tiers: string[];
};

/**
 * Visual archetype: SCORE_ROUTE.
 *
 * Items spawn, get a fading-in score badge above them, then route to
 * one of the tier lanes (hot / warm / cold etc.) on the right.
 */
export default function ScoreRoute({
  themeColor,
  inputName,
  scoreLabel,
  tiers,
}: ScoreRouteProps) {
  const tierCount = Math.max(2, Math.min(4, tiers.length));
  const slice = tiers.slice(0, tierCount);

  // Three rotating items, staggered across the loop, each routed to a different tier.
  const items = [0, 1, 2].map((i) => ({
    delay: i * 2.3,
    tierIndex: i % tierCount,
    score: scoreFor(i % tierCount, tierCount),
  }));

  return (
    <Frame themeColor={themeColor}>
      <div className="absolute inset-0 p-6 sm:p-8 flex flex-col text-white">
        <div className="flex items-center gap-3 text-xs sm:text-sm font-medium opacity-90">
          <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur uppercase tracking-wider text-[10px]">
            Score &amp; route
          </span>
          <span className="opacity-80">{scoreLabel}</span>
        </div>

        <div className="relative flex-1 mt-3">
          {/* Input column */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[18%]">
            <div className="text-[11px] uppercase tracking-wider opacity-70 mb-1">
              Item
            </div>
            <div className="rounded-lg bg-white/15 backdrop-blur border border-white/20 px-2.5 py-1.5 text-xs sm:text-sm font-medium">
              {inputName}
            </div>
          </div>

          {/* Tier lanes */}
          <div className="absolute top-0 bottom-0 right-0 w-[28%] flex flex-col justify-around gap-2">
            {slice.map((tier, i) => (
              <div
                key={i}
                className="rounded-lg bg-white/15 backdrop-blur border border-white/30 px-3 py-2 text-xs sm:text-sm font-semibold truncate flex items-center gap-2"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: tierColor(i, tierCount) }}
                />
                {tier}
              </div>
            ))}
          </div>

          {/* Animated items + score badges */}
          {items.map(({ delay, tierIndex, score }, i) => {
            const yOffset = laneOffset(tierIndex, tierCount);
            return (
              <div
                key={i}
                className="absolute top-1/2 left-[18%] -translate-y-1/2"
                style={{ width: "12%" }}
              >
                {/* Score badge floating above */}
                <div
                  className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-white text-zinc-900 text-[10px] font-bold shadow"
                  style={{
                    animation: `scoreBadge 6.6s ${delay}s linear infinite`,
                  }}
                >
                  {score}
                </div>
                {/* Item */}
                <div
                  className="rounded-md bg-white text-zinc-800 px-2 py-1 text-[11px] font-semibold shadow"
                  style={{
                    animation: `scoreItem 6.6s ${delay}s linear infinite`,
                    ["--y" as string]: `${yOffset}px`,
                  }}
                >
                  Lead #{i + 1}
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
  if (total === 1) return 0;
  return Math.round(-56 + (index / (total - 1)) * 112);
}

function scoreFor(index: number, total: number) {
  // Higher tier = higher score
  const buckets = [92, 74, 55, 32];
  return buckets[index] ?? 50;
}

function tierColor(index: number, total: number) {
  const palette = ["#fde047", "#fb923c", "#22d3ee", "#a78bfa"];
  return palette[index % palette.length];
}
