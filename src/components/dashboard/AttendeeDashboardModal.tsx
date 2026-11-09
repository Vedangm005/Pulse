import React, { useState } from 'react';
import { Registration, Event } from '../../types';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatFullDateTime } from '../../utils/dateUtils';
import { 
  X, 
  Ticket, 
  Heart, 
  Calendar, 
  MapPin, 
  Trash2, 
  Eye, 
  ExternalLink 
} from 'lucide-react';

interface AttendeeDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrations: Registration[];
  allEvents: Event[];
  onViewTicket: (reg: Registration) => void;
  onSelectEvent: (event: Event) => void;
  onRefresh: () => void;
}

export const AttendeeDashboardModal: React.FC<AttendeeDashboardModalProps> = ({
  isOpen,
  onClose,
  registrations,
  allEvents,
  onViewTicket,
  onSelectEvent,
  onRefresh,
}) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'tickets' | 'saved'>('tickets');

  if (!isOpen) return null;

  const activeRegistrations = registrations.filter((r) => r.status === 'confirmed');
  const favoriteIds = StorageService.getFavorites(currentUser?.id || currentUser?.email || 'default');
  const savedEvents = allEvents.filter((e) => favoriteIds.includes(e.id));

  const handleCancelRegistration = (regId: string, title: string) => {
    const confirmed = window.confirm(`Are you sure you want to cancel your registration for "${title}"? This will release your reserved ticket.`);
    if (!confirmed) return;

    const ok = StorageService.cancelRegistration(regId);
    if (ok) {
      showToast('info', 'Registration Cancelled', `Your ticket for "${title}" has been cancelled.`);
      onRefresh();
    }
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-brand-surface border border-brand-subtle shadow-2xl overflow-hidden my-8 max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-brand-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-lime/10 border border-brand-lime/30 flex items-center justify-center text-brand-lime">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Attendee Portal</h3>
              <p className="text-xs text-zinc-400">
                Logged in as <strong className="text-zinc-200">{currentUser?.fullName || 'Guest Attendee'}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-brand-elevated text-zinc-400 hover:text-white border border-brand-subtle hover:border-brand-lime/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-6 pt-4 border-b border-brand-subtle/60 flex items-center gap-4 bg-brand-surface">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`pb-3 text-xs font-semibold font-mono tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'tickets'
                ? 'border-brand-lime text-brand-lime'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Active Tickets ({activeRegistrations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3 text-xs font-semibold font-mono tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'saved'
                ? 'border-brand-lime text-brand-lime'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Events ({savedEvents.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: ACTIVE TICKETS */}
          {activeTab === 'tickets' && (
            activeRegistrations.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Ticket className="w-10 h-10 text-zinc-600 mx-auto" />
                <p className="text-sm font-semibold text-zinc-200">No active registrations yet</p>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Explore the catalog and register for workshops, hackathons, or cultural summits to view your digital passes here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeRegistrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="p-4 sm:p-5 rounded-2xl bg-brand-elevated border border-brand-subtle hover:border-brand-lime/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-lime/15 text-brand-lime border border-brand-lime/30">
                          {reg.ticketCode}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400">
                          {reg.ticketCount} {reg.ticketCount === 1 ? 'Pass' : 'Passes'}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white tracking-tight truncate">
                        {reg.eventTitle}
                      </h4>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-brand-lime" />
                          <span>{formatFullDateTime(reg.eventDate)}</span>
                        </span>
                        <span className="flex items-center gap-1 truncate max-w-[200px]">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="truncate">{reg.eventVenue}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          onClose();
                          onViewTicket(reg);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-lime text-black hover:bg-brand-lime-hover shadow-sm transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Pass</span>
                      </button>

                      <button
                        onClick={() => handleCancelRegistration(reg.id, reg.eventTitle)}
                        className="p-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors"
                        title="Cancel Registration"
                        aria-label="Cancel registration"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* TAB 2: SAVED EVENTS */}
          {activeTab === 'saved' && (
            savedEvents.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Heart className="w-10 h-10 text-zinc-600 mx-auto" />
                <p className="text-sm font-semibold text-zinc-200">No saved events</p>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Click the heart icon on any event card to save events to your personal watchlist.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-2xl bg-brand-elevated border border-brand-subtle flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <span className="text-[10px] font-mono uppercase text-brand-lime font-bold">
                        {evt.category}
                      </span>
                      <h4 className="text-sm font-bold text-white truncate">{evt.title}</h4>
                      <p className="text-xs text-zinc-400 truncate">{evt.venueName}</p>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onSelectEvent(evt);
                      }}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-surface border border-brand-subtle text-zinc-200 hover:text-white hover:border-brand-lime/40 transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      <span>Explore</span>
                      <ExternalLink className="w-3.5 h-3.5 text-brand-lime" />
                    </button>
                  </div>
                ))}
              </div>
            )
          )}

        </div>

      </div>
    </div>
  );
};
