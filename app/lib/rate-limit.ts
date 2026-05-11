/**
 * In-memory sliding-window rate limiter. Resets on process restart,
 * which is fine for a single-instance deploy. For multi-instance,
 * swap to Upstash Redis or similar.
 */

type Bucket = { count: number; firstSeenAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: true } | { ok: false; retryAfterMs: number } {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now - existing.firstSeenAt > windowMs) {
    buckets.set(key, { count: 1, firstSeenAt: now });
    return { ok: true };
  }

  if (existing.count >= limit) {
    return {
      ok: false,
      retryAfterMs: existing.firstSeenAt + windowMs - now,
    };
  }

  existing.count += 1;
  return { ok: true };
}

// Best-effort cleanup so the map doesn't grow unbounded.
const CLEAN_INTERVAL_MS = 5 * 60 * 1000;
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      // Drop buckets older than 1 hour.
      if (now - bucket.firstSeenAt > 60 * 60 * 1000) {
        buckets.delete(key);
      }
    }
  }, CLEAN_INTERVAL_MS).unref?.();
}
