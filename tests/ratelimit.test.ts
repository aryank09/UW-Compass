import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { createRateLimiter } from '@/lib/ratelimit';

describe('createRateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows requests under the limit', () => {
    const isLimited = createRateLimiter(3, 60_000);
    expect(isLimited('1.2.3.4')).toBe(false);
    expect(isLimited('1.2.3.4')).toBe(false);
    expect(isLimited('1.2.3.4')).toBe(false);
  });

  it('blocks once the limit is reached', () => {
    const isLimited = createRateLimiter(3, 60_000);
    isLimited('1.2.3.4');
    isLimited('1.2.3.4');
    isLimited('1.2.3.4');
    expect(isLimited('1.2.3.4')).toBe(true);
    expect(isLimited('1.2.3.4')).toBe(true);
  });

  it('tracks IPs independently', () => {
    const isLimited = createRateLimiter(2, 60_000);
    isLimited('10.0.0.1');
    isLimited('10.0.0.1');
    expect(isLimited('10.0.0.1')).toBe(true);
    // Different IP should be unaffected
    expect(isLimited('10.0.0.2')).toBe(false);
  });

  it('resets after the window expires', () => {
    const isLimited = createRateLimiter(2, 1_000);
    isLimited('5.5.5.5');
    isLimited('5.5.5.5');
    expect(isLimited('5.5.5.5')).toBe(true);

    vi.advanceTimersByTime(1_001);

    expect(isLimited('5.5.5.5')).toBe(false);
    expect(isLimited('5.5.5.5')).toBe(false);
    expect(isLimited('5.5.5.5')).toBe(true);
  });
});
