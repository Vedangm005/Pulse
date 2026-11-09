import React, { useEffect } from 'react';
import { Event } from '../../types';
import { CountdownBadge } from '../events/CountdownBadge';
import { formatFullDateTime } from '../../utils/dateUtils';
import { createGoogleCalendarUrl, downloadIcsFile } from '../../utils/calendar';
import { 
  X, 
  Calendar, 
  MapPin, 
  Users, 
  Building2, 
  ExternalLink, 
  Download, 
  CalendarPlus, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';

interface EventDetailModalProps {
  event: Event | null;
  onClose: () => void;
  onRegister: (event: Event) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onRegister,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!event) return null;

  const isFull = event.registeredCount >= event.capacity;
  const spotsLeft = Math.max(0, event.capacity - event.registeredCount);

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-event-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl rounded-3xl bg-brand-surface border border-brand-subtle shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-brand-black/70 text-zinc-300 hover:text-white border border-brand-subtle hover:border-brand-lime/40 backdrop-blur-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1">
          
          {/* Hero Banner Visual */}
          <div className="relative aspect-[21/9] sm:aspect-[2/1] w-full bg-brand-elevated overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-brand-surface/40 to-transparent" />
            
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-brand-lime text-black">
                {event.category}
              </span>
              <CountdownBadge targetDate={event.startDate} />
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Header Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <Calendar className="w-4 h-4 text-brand-lime" />
                <span>{formatFullDateTime(event.startDate)}</span>
              </div>

              <h2 id="modal-event-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {event.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-300 pt-1">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-lime shrink-0" />
                  <strong>{event.venueName}</strong> — {event.venueAddress}
                </span>
                {event.venueMapUrl && (
                  <a
                    href={event.venueMapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-brand-lime hover:underline font-mono"
                  >
                    <span>View Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Capacity & Host Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-brand-elevated border border-brand-subtle">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-surface border border-brand-subtle flex items-center justify-center text-brand-lime">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-mono uppercase text-zinc-400">Organized By</p>
                  <p className="text-xs font-semibold text-zinc-100">{event.organizerName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-brand-surface border border-brand-subtle flex items-center justify-center ${isFull ? 'text-brand-orange' : 'text-brand-lime'}`}>
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-mono uppercase text-zinc-400">Capacity Status</p>
                  <p className={`text-xs font-semibold ${isFull ? 'text-brand-orange' : 'text-zinc-100'}`}>
                    {isFull ? '100% Full (Waitlist Open)' : `${spotsLeft} spots available (${event.registeredCount}/${event.capacity})`}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-sm font-mono uppercase tracking-wider font-semibold text-zinc-300">
                About The Event
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                {event.fullDescription}
              </p>
            </div>

            {/* Agenda Timeline */}
            {event.agenda && event.agenda.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-mono uppercase tracking-wider font-semibold text-zinc-300">
                  Event Schedule & Agenda
                </h3>
                <div className="space-y-2.5">
                  {event.agenda.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-brand-surface border border-brand-subtle text-xs"
                    >
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-brand-elevated text-brand-lime font-mono font-semibold shrink-0">
                        <Clock className="w-3 h-3" />
                        <span>{item.timeSlot}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-zinc-100">{item.title}</p>
                        {item.speakerName && (
                          <p className="text-zinc-400 text-[11px] mt-0.5">Speaker: {item.speakerName}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Calendar Integration Section */}
            <div className="p-4 rounded-2xl bg-brand-surface border border-brand-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <CalendarPlus className="w-4 h-4 text-brand-lime" />
                <span>Sync with your personal schedule</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={createGoogleCalendarUrl(event)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-elevated border border-brand-subtle text-zinc-200 hover:text-white hover:border-brand-lime/40 transition-colors inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3 h-3 text-brand-lime" />
                  <span>Google Calendar</span>
                </a>
                <button
                  onClick={() => downloadIcsFile(event)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-elevated border border-brand-subtle text-zinc-200 hover:text-white hover:border-brand-lime/40 transition-colors inline-flex items-center gap-1.5"
                >
                  <Download className="w-3 h-3 text-brand-lime" />
                  <span>Download .ICS</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Sticky Footer CTA */}
        <div className="p-4 sm:p-6 border-t border-brand-subtle bg-brand-elevated flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-xs font-mono text-zinc-400">Admission Fee</p>
            <p className="text-lg font-bold text-brand-lime flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Free Registration
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl text-xs font-semibold border border-brand-subtle text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onRegister(event);
              }}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md ${
                isFull
                  ? 'bg-brand-orange text-white hover:bg-brand-orange/90 shadow-glow-orange'
                  : 'bg-brand-lime text-black hover:bg-brand-lime-hover shadow-glow-lime'
              }`}
            >
              {isFull ? 'Join Waitlist Queue' : 'Register for Event'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
