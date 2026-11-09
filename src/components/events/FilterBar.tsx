import React from 'react';
import { EventCategory, EventFilterState } from '../../types';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface FilterBarProps {
  filters: EventFilterState;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: EventCategory) => void;
  onTimeframeChange: (timeframe: EventFilterState['timeframe']) => void;
  onSortChange: (sort: EventFilterState['sortBy']) => void;
  onReset: () => void;
  totalResults: number;
}

const CATEGORIES: { id: EventCategory; label: string }[] = [
  { id: 'all', label: 'All Events' },
  { id: 'tech', label: 'Technology' },
  { id: 'workshop', label: 'Workshops' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'sports', label: 'Sports & Gaming' },
  { id: 'arts', label: 'Arts & Media' },
  { id: 'business', label: 'Business & Pitch' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onSearchChange,
  onCategoryChange,
  onTimeframeChange,
  onSortChange,
  onReset,
  totalResults,
}) => {
  const hasActiveFilters =
    filters.query.trim() !== '' ||
    filters.category !== 'all' ||
    filters.timeframe !== 'all' ||
    filters.sortBy !== 'date_asc';

  return (
    <div className="space-y-5 bg-brand-surface/40 p-4 sm:p-6 rounded-2xl border border-brand-subtle backdrop-blur-sm">
      
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by event title, venue, or keyword..."
            className="w-full pl-10 pr-10 py-3 rounded-xl bg-brand-elevated border border-brand-subtle text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-brand-lime/60 focus:ring-1 focus:ring-brand-lime/60 transition-all"
          />
          {filters.query && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-0.5"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Timeframe & Sort Selectors */}
        <div className="flex items-center gap-2">
          
          {/* Timeframe selector */}
          <div className="relative">
            <select
              value={filters.timeframe}
              onChange={(e) => onTimeframeChange(e.target.value as EventFilterState['timeframe'])}
              className="appearance-none pl-3.5 pr-8 py-3 rounded-xl bg-brand-elevated border border-brand-subtle text-xs font-medium text-zinc-200 focus:outline-none focus:border-brand-lime/60 cursor-pointer"
            >
              <option value="all">Any Date</option>
              <option value="upcoming">Upcoming</option>
              <option value="weekend">This Weekend</option>
              <option value="month">This Month</option>
            </select>
            <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
          </div>

          {/* Sort order selector */}
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => onSortChange(e.target.value as EventFilterState['sortBy'])}
              className="appearance-none pl-3.5 pr-8 py-3 rounded-xl bg-brand-elevated border border-brand-subtle text-xs font-medium text-zinc-200 focus:outline-none focus:border-brand-lime/60 cursor-pointer"
            >
              <option value="date_asc">Date: Soonest First</option>
              <option value="date_desc">Date: Latest First</option>
              <option value="popularity">Most Popular</option>
              <option value="title">Title: A–Z</option>
            </select>
            <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
          </div>

        </div>

      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = filters.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-brand-lime text-black font-semibold shadow-glow-lime'
                  : 'bg-brand-elevated text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] border border-brand-subtle'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Results Header & Reset Link */}
      <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
        <span>
          Showing <strong className="text-zinc-200 font-mono">{totalResults}</strong> {totalResults === 1 ? 'event' : 'events'}
        </span>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-brand-lime hover:underline font-mono"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

    </div>
  );
};
