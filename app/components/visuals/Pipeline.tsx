import Frame from "./Frame";

export type PipelineProps = {
  themeColor: string;
  inputName: string;
  outputName: string;
  steps: string[];
};

/**
 * Visual archetype: PIPELINE.
 *
 * An item moves left → right through a chain of step nodes.
 * Steps are evenly spaced; the dot rides the connector lines.
 */
export default function Pipeline({
  themeColor,
  inputName,
  outputName,
  steps,
}: PipelineProps) {
  const allNodes = [inputName, ...steps.slice(0, 4), outputName];

  return (
    <Frame themeColor={themeColor}>
      <div className="absolute inset-0 p-6 sm:p-8 flex flex-col text-white">
        <div className="flex items-center gap-3 text-xs sm:text-sm font-medium opacity-90">
          <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur uppercase tracking-wider text-[10px]">
            Pipeline
          </span>
          <span className="opacity-80">step by step</span>
        </div>

        <div className="relative flex-1 mt-4 flex items-center">
          {/* Connector line spanning the row */}
          <div className="absolute left-[6%] right-[6%] top-1/2 -translate-y-1/2 h-0.5 bg-white/30 rounded-full" />

          {/* Animated dot */}
          <div
            className="absolute top-1/2 -translate-y-1/2 left-[6%]"
            style={{ width: "88%" }}
          >
            {[0, 1].map((i) => (
              <div
                key={i}
                className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white shadow"
                style={{
                  animation: `pipelineDot 5s ${i * 2.5}s linear infinite`,
                  ["--end" as string]: "100%",
                }}
              />
            ))}
          </div>

          {/* Nodes */}
          <div className="relative flex w-full justify-between items-center px-[2%]">
            {allNodes.map((label, i) => {
              const isFirst = i === 0;
              const isLast = i === allNodes.length - 1;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1.5"
                  style={{ width: `${Math.max(60, 100 / allNodes.length)}%`, maxWidth: 140 }}
                >
                  <div
                    className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                      isFirst || isLast
                        ? "bg-white text-zinc-900"
                        : "bg-white/25 backdrop-blur border border-white/40 text-white"
                    }`}
                  >
                    {isFirst ? "in" : isLast ? "out" : i}
                  </div>
                  <div className="text-[10px] sm:text-xs font-medium text-center opacity-95 max-w-[12ch] truncate">
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Frame>
  );
}
