import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCountdown } from '../src/hooks/useCountdown';

describe('useCountdown Hook', () => {
  it('returns valid padded strings for future event target', () => {
    // 5 days into future
    const futureDate = new Date(Date.now() + 5 * 86400 * 1000 + 3600 * 1000).toISOString();
    const { result } = renderHook(() => useCountdown(futureDate));

    expect(result.current.isExpired).toBe(false);
    expect(Number(result.current.days)).toBeGreaterThanOrEqual(4);
    expect(result.current.hours).toMatch(/^\d{2}$/);
    expect(result.current.minutes).toMatch(/^\d{2}$/);
    expect(result.current.seconds).toMatch(/^\d{2}$/);
  });

  it('handles expired dates gracefully with 00 values', () => {
    // 2 days in past
    const pastDate = new Date(Date.now() - 2 * 86400 * 1000).toISOString();
    const { result } = renderHook(() => useCountdown(pastDate));

    expect(result.current.isExpired).toBe(true);
    expect(result.current.days).toBe('00');
    expect(result.current.hours).toBe('00');
    expect(result.current.minutes).toBe('00');
    expect(result.current.seconds).toBe('00');
    expect(result.current.totalSeconds).toBe(0);
  });
});
