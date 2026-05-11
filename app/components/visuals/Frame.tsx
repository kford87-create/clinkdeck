type FrameProps = {
  themeColor: string;
  children: React.ReactNode;
};

export default function Frame({ themeColor, children }: FrameProps) {
  return (
    <div
      className="relative w-full aspect-video rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
      style={{
        background: `linear-gradient(135deg, ${themeColor}, ${shift(themeColor)})`,
      }}
    >
      {children}
    </div>
  );
}

export function shift(hex: string) {
  const m = hex.match(/^#([0-9a-f]{6})$/i);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  return `#${[Math.max(0, r - 50), Math.max(0, g - 30), Math.min(255, b + 60)]
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("")}`;
}
