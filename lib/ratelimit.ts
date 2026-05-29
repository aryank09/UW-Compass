/**
 * Lightweight in-memory sliding-window rate limiter.
 *
 * Note: this is per-instance. On multi-instance Vercel deployments each cold
 * start gets its own map, so the limit is not globally enforced. Swap in
 * @upstash/ratelimit + Vercel KV for global enforcement.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export function createRateLimiter(maxRequests: number, windowMs: number) {
  const map = new Map<string, RateLimitEntry>();

  return function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = map.get(ip);
    if (!entry || now >= entry.resetAt) {
      map.set(ip, { count: 1, resetAt: now + windowMs });
      return false;
    }
    if (entry.count >= maxRequests) return true;
    entry.count++;
    return false;
  };
}
