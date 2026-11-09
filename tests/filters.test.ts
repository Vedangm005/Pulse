import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEventFilters } from '../src/hooks/useEventFilters';
import { SEED_EVENTS } from '../src/data/seedEvents';

describe('useEventFilters Hook', () => {
  it('filters events by search query in title, venue, or description', () => {
    const { result } = renderHook(() => useEventFilters(SEED_EVENTS));

    expect(result.current.filteredEvents.length).toBe(SEED_EVENTS.length);

    act(() => {
      result.current.setQuery('Quantum');
    });

    expect(result.current.filteredEvents.length).toBe(1);
    expect(result.current.filteredEvents[0].title).toContain('Quantum');
  });

  it('filters events by category', () => {
    const { result } = renderHook(() => useEventFilters(SEED_EVENTS));

    act(() => {
      result.current.setCategory('sports');
    });

    const categories = result.current.filteredEvents.map((e) => e.category);
    expect(categories.every((c) => c === 'sports')).toBe(true);
  });

  it('sorts events by popularity (registered count descending)', () => {
    const { result } = renderHook(() => useEventFilters(SEED_EVENTS));

    act(() => {
      result.current.setSortBy('popularity');
    });

    const counts = result.current.filteredEvents.map((e) => e.registeredCount);
    for (let i = 0; i < counts.length - 1; i++) {
      expect(counts[i]).toBeGreaterThanOrEqual(counts[i + 1]);
    }
  });

  it('resets all filters back to initial state', () => {
    const { result } = renderHook(() => useEventFilters(SEED_EVENTS));

    act(() => {
      result.current.setQuery('Quantum');
      result.current.setCategory('tech');
      result.current.setSortBy('popularity');
    });
    expect(result.current.filteredEvents.length).toBe(1);

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filteredEvents.length).toBe(SEED_EVENTS.length);
    expect(result.current.filters.query).toBe('');
    expect(result.current.filters.category).toBe('all');
  });
});
