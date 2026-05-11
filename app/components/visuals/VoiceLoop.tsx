import Frame from "./Frame";

export type VoiceLoopProps = {
  themeColor: string;
  userSays: string;
  agentThinks: string;
  agentSays: string;
};

/**
 * Visual archetype: VOICE_LOOP.
 *
 * Two avatars facing each other. Speech bubbles fade in/out in sequence:
 *   user speaks → agent thinks → agent replies → loop.
 */
export default function VoiceLoop({
  themeColor,
  userSays,
  agentThinks,
  agentSays,
}: VoiceLoopProps) {
  return (
    <Frame themeColor={themeColor}>
      <div className="absolute inset-0 p-6 sm:p-8 flex flex-col text-white">
        <div className="flex items-center gap-3 text-xs sm:text-sm font-medium opacity-90">
          <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur uppercase tracking-wider text-[10px]">
            Voice loop
          </span>
          <span className="opacity-80">live conversation</span>
        </div>

        <div className="relative flex-1 mt-3 grid grid-cols-2">
          {/* User side */}
          <div className="relative flex flex-col justify-center items-center gap-3">
            <div
              className="absolute top-2 left-1/2 -translate-x-1/2 max-w-[85%] rounded-2xl rounded-bl-sm bg-white text-zinc-800 px-3 py-2 text-xs sm:text-sm font-medium shadow"
              style={{
                animation: "voiceUserBubble 6s linear infinite",
              }}
            >
              {truncate(userSays, 90)}
            </div>
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/85 flex items-center justify-center text-zinc-800">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
              </svg>
            </div>
            <div className="text-[10px] uppercase tracking-wider opacity-70">
              User
            </div>
          </div>

          {/* Agent side */}
          <div className="relative flex flex-col justify-center items-center gap-3">
            <div
              className="absolute top-2 right-2 max-w-[85%] rounded-2xl rounded-br-sm bg-white text-zinc-800 px-3 py-2 text-xs sm:text-sm font-medium shadow"
              style={{
                animation: "voiceAgentBubble 6s linear infinite",
              }}
            >
              {truncate(agentSays, 90)}
            </div>
            <div className="relative">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/85 flex items-center justify-center text-zinc-800">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2a4 4 0 0 0-4 4v6a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4zM5 11v1a7 7 0 0 0 14 0v-1M12 19v3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1"
                style={{ animation: "voiceThinking 6s linear infinite" }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-white"
                    style={{
                      animation: `voiceDot 0.8s ${i * 0.15}s ease-in-out infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="text-[10px] uppercase tracking-wider opacity-70">
              Agent
            </div>
          </div>

          {/* Mid-loop "thinking" caption */}
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs opacity-90 italic max-w-[80%] text-center"
            style={{ animation: "voiceThinking 6s linear infinite" }}
          >
            {truncate(agentThinks, 90)}
          </div>
        </div>
      </div>
    </Frame>
  );
}

function truncate(s: string, n: number) {
  return s.length <= n ? s : s.slice(0, n - 1).trimEnd() + "…";
}
