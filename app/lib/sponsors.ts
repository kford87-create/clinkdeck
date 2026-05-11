export type Sponsor = {
  id: string;
  name: string;
  logoUrl: string;
  ctaUrl: string;
  copy: string;
  slot: "sidebar";
  activeFrom: Date;
  activeUntil: Date;
};

export const sponsors: Sponsor[] = [];

export function pickSponsor(slot: Sponsor["slot"], now: Date = new Date()) {
  const active = sponsors.filter(
    (s) => s.slot === slot && s.activeFrom <= now && s.activeUntil > now,
  );
  if (active.length === 0) return null;
  return active[Math.floor(Math.random() * active.length)];
}
