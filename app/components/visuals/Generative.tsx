import Frame from "./Frame";

export type GenerativeProps = {
  themeColor: string;
  promptName: string;
  artifactName: string;
  qualitySignal: string;
};

/**
 * Visual archetype: GENERATIVE.
 *
 * Prompt card on the left → expanding cloud / particles in the middle →
 * generated artifact materializes on the right.
 */
export default function Generative({
  themeColor,
  promptName,
  artifactName,
  qualitySignal,
}: GenerativeProps) {
  const particles = Array.from({ length: 6 }).map((_, i) => ({
    delay: i * 0.4,
    dx: 28 + ((i * 11) % 24),
    dy: -24 + ((i * 17) % 36),
  }));

  return (
    <Frame themeColor={themeColor}>
      <div className="absolute inset-0 p-6 sm:p-8 flex flex-col text-white">
        <div className="flex items-center gap-3 text-xs sm:text-sm font-medium opacity-90">
          <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur uppercase tracking-wider text-[10px]">
            Generative
          </span>
          <span className="opacity-80">{qualitySignal}</span>
        </div>

        <div className="relative flex-1 mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          {/* Prompt card */}
          <div className="rounded-xl bg-white/15 backdrop-blur border border-white/30 p-3">
            <div className="text-[10px] uppercase tracking-wider opacity-70 mb-1">
              Prompt
            </div>
            <div className="text-xs sm:text-sm font-medium">
              {truncate(promptName, 60)}
            </div>
          </div>

          {/* Center: cloud + particles */}
          <div className="relative h-24 w-24 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full bg-white/40"
              style={{ animation: "genCloud 3.5s linear infinite" }}
            />
            <div
              className="absolute inset-2 rounded-full bg-white/30"
              style={{ animation: "genCloud 3.5s 0.6s linear infinite" }}
            />
            {particles.map((p, i) => (
              <span
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full bg-white"
                style={{
                  animation: `genParticle 2.4s ${p.delay}s ease-out infinite`,
                  ["--dx" as string]: `${p.dx}px`,
                  ["--dy" as string]: `${p.dy}px`,
                }}
              />
            ))}
            <span className="relative z-10 text-2xl">✦</span>
          </div>

          {/* Artifact card */}
          <div
            className="rounded-xl bg-white text-zinc-800 p-3 shadow"
            style={{ animation: "genArtifact 3.5s linear infinite" }}
          >
            <div className="text-[10px] uppercase tracking-wider opacity-60 mb-1">
              Output
            </div>
            <div className="text-xs sm:text-sm font-semibold">
              {truncate(artifactName, 60)}
            </div>
            <div className="mt-2 space-y-1">
              <div className="h-1 w-3/4 rounded bg-zinc-200" />
              <div className="h-1 w-full rounded bg-zinc-200" />
              <div className="h-1 w-2/3 rounded bg-zinc-200" />
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

function truncate(s: string, n: number) {
  return s.length <= n ? s : s.slice(0, n - 1).trimEnd() + "…";
}
