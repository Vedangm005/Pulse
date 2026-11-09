import React from 'react';
import { Event } from '../../types';
import { CountdownBadge } from './CountdownBadge';
import { formatEventDate, formatEventTime } from '../../utils/dateUtils';
import { Calendar, MapPin, Users, ArrowUpRight, Heart } from 'lucide-react';

interface EventCardProps {
  event: Event;
  onSelect: (event: Event) => void;
  onRegister: (event: Event) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (eventId: string) => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  tech: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  workshop: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  cultural: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30' },
  sports: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  arts: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  business: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
};

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelect,
  onRegister,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const isFull = event.registeredCount >= event.capacity;
  const fillPercentage = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));
  const categoryStyle = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.tech;

  return (
    <article className="group relative flex flex-col rounded-2xl bg-brand-surface border border-brand-subtle hover:border-brand-lime/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-lime/5 overflow-hidden">
      
      {/* Precision Lime Accent Line on Hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-lime scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-20" />

      {/* Visual Image Banner with Overlays */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-elevated">
        <img
          src={event.imageUrl}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-transparent to-black/30" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider backdrop-blur-md border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}>
            {event.category}
          </span>

          <div className="flex items-center gap-1.5">
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(event.id);
                }}
                className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                  isFavorite
                    ? 'bg-red-500/20 border-red-500/50 text-red-400'
                    : 'bg-black/60 border-white/10 text-white/80 hover:text-white hover:border-white/30'
                }`}
                title={isFavorite ? 'Remove from saved' : 'Save event'}
                aria-label="Bookmark event"
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-400' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Floating Live Countdown */}
        <div className="absolute bottom-3 left-3 z-10">
          <CountdownBadge targetDate={event.startDate} />
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6 justify-between space-y-4">
        <div className="space-y-3">
          
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Calendar className="w-3.5 h-3.5 text-brand-lime shrink-0" />
            <span>
              {formatEventDate(event.startDate)} • {formatEventTime(event.startDate)}
            </span>
          </div>

          {/* Event Title */}
          <h3 
            onClick={() => onSelect(event)}
            className="text-lg font-bold text-white tracking-tight leading-snug group-hover:text-brand-lime transition-colors cursor-pointer line-clamp-2"
          >
            {event.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {event.shortDescription}
          </p>

          {/* Venue & Location */}
          <div className="flex items-center gap-2 text-xs text-zinc-300">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">{event.venueName}</span>
          </div>
        </div>

        {/* Capacity Progress & Action Buttons */}
        <div className="space-y-3 pt-3 border-t border-brand-subtle/60">
          
          {/* Capacity Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <Users className="w-3 h-3 text-zinc-500" />
                <span>Capacity</span>
              </span>
              <span className={`font-semibold ${isFull ? 'text-brand-orange' : 'text-zinc-300'}`}>
                {isFull ? (
                  'Sold Out (Waitlist Open)'
                ) : (
                  `${event.registeredCount} / ${event.capacity} seats`
                )}
              </span>
            </div>
            
            <div className="h-1.5 w-full rounded-full bg-brand-elevated overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isFull
                    ? 'bg-brand-orange'
                    : fillPercentage > 85
                    ? 'bg-amber-400'
                    : 'bg-brand-lime'
                }`}
                style={{ width: `${fillPercentage}%` }}
              />
            </div>
          </div>

          {/* Card Button Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => onSelect(event)}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold bg-brand-elevated border border-brand-subtle text-zinc-200 hover:text-white hover:border-brand-subtle hover:bg-white/[0.04] transition-colors"
            >
              <span>Details</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            <button
              onClick={() => onRegister(event)}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                isFull
                  ? 'bg-brand-orange/15 text-brand-orange border border-brand-orange/40 hover:bg-brand-orange/25'
                  : 'bg-brand-lime text-black hover:bg-brand-lime-hover shadow-sm hover:shadow-glow-lime'
              }`}
            >
              <span>{isFull ? 'Waitlist' : 'Register'}</span>
            </button>
          </div>

        </div>

      </div>

    </article>
  );
};
