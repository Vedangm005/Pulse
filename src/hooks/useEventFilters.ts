import { useState, useMemo } from 'react';
import { Event, EventCategory, EventFilterState } from '../types';

export function useEventFilters(events: Event[]) {
  const [filters, setFilters] = useState<EventFilterState>({
    query: '',
    category: 'all',
    timeframe: 'all',
    sortBy: 'date_asc',
    hideFull: false,
  });

  const setQuery = (query: string) => setFilters((prev) => ({ ...prev, query }));
  const setCategory = (category: EventCategory) => setFilters((prev) => ({ ...prev, category }));
  const setTimeframe = (timeframe: EventFilterState['timeframe']) => setFilters((prev) => ({ ...prev, timeframe }));
  const setSortBy = (sortBy: EventFilterState['sortBy']) => setFilters((prev) => ({ ...prev, sortBy }));
  const toggleHideFull = () => setFilters((prev) => ({ ...prev, hideFull: !prev.hideFull }));
  const resetFilters = () =>
    setFilters({
      query: '',
      category: 'all',
      timeframe: 'all',
      sortBy: 'date_asc',
      hideFull: false,
    });

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // 1. Text Search Query
      if (filters.query.trim()) {
        const q = filters.query.toLowerCase().trim();
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesShort = event.shortDescription.toLowerCase().includes(q);
        const matchesVenue = event.venueName.toLowerCase().includes(q);
        const matchesAddress = event.venueAddress.toLowerCase().includes(q);
        const matchesOrganizer = event.organizerName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesShort && !matchesVenue && !matchesAddress && !matchesOrganizer) {
          return false;
        }
      }

      // 2. Category Filter
      if (filters.category !== 'all' && event.category !== filters.category) {
        return false;
      }

      // 3. Hide Full Capacity
      if (filters.hideFull && event.registeredCount >= event.capacity) {
        return false;
      }

      // 4. Timeframe Filter
      if (filters.timeframe !== 'all') {
        const now = new Date();
        const eventDate = new Date(event.startDate);
        const diffDays = (eventDate.getTime() - now.getTime()) / (1000 * 3600 * 24);

        if (filters.timeframe === 'upcoming' && diffDays < 0) {
          return false;
        }
        if (filters.timeframe === 'weekend') {
          // Check if event is within next 7 days and is a Saturday (6) or Sunday (0)
          const day = eventDate.getDay();
          if (diffDays < 0 || diffDays > 7 || (day !== 0 && day !== 6)) {
            return false;
          }
        }
        if (filters.timeframe === 'month') {
          // Within next 30 days
          if (diffDays < 0 || diffDays > 30) {
            return false;
          }
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'date_asc') {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }
      if (filters.sortBy === 'date_desc') {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }
      if (filters.sortBy === 'popularity') {
        return b.registeredCount - a.registeredCount;
      }
      if (filters.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [events, filters]);

  return {
    filters,
    filteredEvents,
    setQuery,
    setCategory,
    setTimeframe,
    setSortBy,
    toggleHideFull,
    resetFilters,
  };
}
