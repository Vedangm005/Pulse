import React from 'react';
import { Event } from '../../types';
import { EventCard } from './EventCard';
import { SearchX } from 'lucide-react';

interface EventGridProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
  onRegisterEvent: (event: Event) => void;
  favorites: string[];
  onToggleFavorite: (eventId: string) => void;
  onResetFilters: () => void;
}

export const EventGrid: React.FC<EventGridProps> = ({
  events,
  onSelectEvent,
  onRegisterEvent,
  favorites,
  onToggleFavorite,
  onResetFilters,
}) => {
  if (events.length === 0) {
    return (
      <div className="py-20 px-4 text-center rounded-2xl border border-dashed border-brand-subtle bg-brand-surface/30 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-elevated border border-brand-subtle mx-auto flex items-center justify-center text-zinc-500">
          <SearchX className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-white">No events match your criteria</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try adjusting your search query, clearing category filters, or selecting "Any Date".
          </p>
        </div>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-lime text-black hover:bg-brand-lime-hover shadow-sm transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onSelect={onSelectEvent}
          onRegister={onRegisterEvent}
          isFavorite={favorites.includes(event.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};
