import React, { useState } from 'react';
import { Event, Registration, EventCategory } from '../../types';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { exportAttendeeRosterCsv } from '../../utils/csvExport';
import { 
  X, 
  Building2, 
  Plus, 
  Users, 
  Download, 
  Trash2, 
  Sparkles 
} from 'lucide-react';

interface OrganizerStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: Event[];
  onRefreshEvents: () => void;
}

export const OrganizerStudioModal: React.FC<OrganizerStudioModalProps> = ({
  isOpen,
  onClose,
  events,
  onRefreshEvents,
}) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [isCreating, setIsCreating] = useState(false);
  const [selectedRosterEvent, setSelectedRosterEvent] = useState<Event | null>(null);
  const [rosterAttendees, setRosterAttendees] = useState<Registration[]>([]);

  // Form states for creating event
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('tech');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [startDate, setStartDate] = useState('2026-11-30T10:00');
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80');
  const [capacity, setCapacity] = useState(150);
  const [isFeatured, setIsFeatured] = useState(false);

  if (!isOpen) return null;

  // Filter events: if admin, shows all; if organizer, shows own or all demo events
  const managedEvents = currentUser?.role === 'admin'
    ? events
    : events.filter((e) => e.organizerId === currentUser?.id || currentUser?.role === 'organizer');

  const totalRegistrations = managedEvents.reduce((acc, curr) => acc + curr.registeredCount, 0);
  const totalCapacity = managedEvents.reduce((acc, curr) => acc + curr.capacity, 0);
  const avgFillRate = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;

  const handleOpenRoster = (event: Event) => {
    const attendees = StorageService.getEventAttendees(event.id);
    setSelectedRosterEvent(event);
    setRosterAttendees(attendees);
  };

  const handleDeleteEvent = (id: string, eventTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      const ok = StorageService.deleteEvent(id);
      if (ok) {
        showToast('info', 'Event Deleted', `"${eventTitle}" has been removed from the platform.`);
        onRefreshEvents();
      }
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shortDesc.trim() || !venueName.trim()) {
      showToast('error', 'Incomplete Form', 'Please fill in all mandatory fields.');
      return;
    }

    const newEvent: Event = {
      id: `evt_custom_${Date.now()}`,
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
      category,
      shortDescription: shortDesc.trim(),
      fullDescription: fullDesc.trim() || shortDesc.trim(),
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(new Date(startDate).getTime() + 4 * 3600 * 1000).toISOString(),
      registrationDeadline: new Date(new Date(startDate).getTime() - 24 * 3600 * 1000).toISOString(),
      venueName: venueName.trim(),
      venueAddress: venueAddress.trim() || 'Campus Center, Sector 1',
      imageUrl: imageUrl.trim(),
      capacity: Number(capacity) || 100,
      registeredCount: 0,
      isFeatured,
      status: 'published',
      organizerId: currentUser?.id || 'usr_demo_organizer_01',
      organizerName: currentUser?.fullName || 'Event Organizer',
      agenda: [
        { id: 'ag_new_1', timeSlot: '10:00 - 11:30', title: 'Opening Session & Keynote' },
        { id: 'ag_new_2', timeSlot: '11:45 - 14:00', title: 'Interactive Showcase & Networking' },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    StorageService.saveEvent(newEvent);
    showToast('success', 'Event Published!', `"${newEvent.title}" is now live in the catalog.`);
    setIsCreating(false);
    onRefreshEvents();
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl rounded-3xl bg-brand-surface border border-brand-subtle shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-brand-subtle flex items-center justify-between bg-brand-elevated">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Organizer Studio</h3>
              <p className="text-xs text-zinc-400">
                Authorized Workspace • {currentUser?.fullName} ({currentUser?.role})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-brand-surface text-zinc-400 hover:text-white border border-brand-subtle hover:border-brand-lime/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Top Metrics Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-brand-elevated border border-brand-subtle">
              <p className="text-xs font-mono uppercase text-zinc-400">Total Events</p>
              <p className="text-2xl font-extrabold text-white font-mono mt-1">{managedEvents.length}</p>
            </div>
            <div className="p-4 rounded-2xl bg-brand-elevated border border-brand-subtle">
              <p className="text-xs font-mono uppercase text-zinc-400">Total Registrations</p>
              <p className="text-2xl font-extrabold text-brand-lime font-mono mt-1">{totalRegistrations}</p>
            </div>
            <div className="p-4 rounded-2xl bg-brand-elevated border border-brand-subtle">
              <p className="text-xs font-mono uppercase text-zinc-400">Overall Fill Rate</p>
              <p className="text-2xl font-extrabold text-amber-300 font-mono mt-1">{avgFillRate}%</p>
            </div>
          </div>

          {/* Creation Section Toggle */}
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-mono uppercase tracking-wider font-semibold text-zinc-300">
              Managed Event Catalog
            </h4>

            <button
              onClick={() => setIsCreating(!isCreating)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-brand-lime text-black hover:bg-brand-lime-hover shadow-glow-lime transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isCreating ? 'Cancel Creation' : 'Create New Event'}</span>
            </button>
          </div>

          {/* INLINE EVENT CREATION FORM */}
          {isCreating && (
            <form onSubmit={handleCreateSubmit} className="p-5 rounded-2xl bg-brand-elevated border border-brand-lime/30 space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-brand-subtle pb-2">
                <span className="text-xs font-mono text-brand-lime uppercase font-semibold">Publish New Gathering</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Next-Gen Cloud & Microservices Summit"
                    className="w-full px-3 py-2 rounded-xl bg-brand-surface border border-brand-subtle text-xs text-white focus:outline-none focus:border-brand-lime"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EventCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-brand-surface border border-brand-subtle text-xs text-white focus:outline-none focus:border-brand-lime"
                  >
                    <option value="tech">Technology</option>
                    <option value="workshop">Workshops</option>
                    <option value="cultural">Cultural</option>
                    <option value="sports">Sports & Gaming</option>
                    <option value="arts">Arts & Media</option>
                    <option value="business">Business & Pitch</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold">Short Excerpt *</label>
                <input
                  type="text"
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Summary for event cards (max 150 characters)"
                  className="w-full px-3 py-2 rounded-xl bg-brand-surface border border-brand-subtle text-xs text-white focus:outline-none focus:border-brand-lime"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold">Full Description</label>
                <textarea
                  rows={3}
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  placeholder="Comprehensive event details, speaker bios, and topics..."
                  className="w-full px-3 py-2 rounded-xl bg-brand-surface border border-brand-subtle text-xs text-white focus:outline-none focus:border-brand-lime"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold">Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-brand-surface border border-brand-subtle text-xs text-white focus:outline-none focus:border-brand-lime"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold">Venue Name *</label>
                  <input
                    type="text"
                    required
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    placeholder="e.g. Turing Hall"
                    className="w-full px-3 py-2 rounded-xl bg-brand-surface border border-brand-subtle text-xs text-white focus:outline-none focus:border-brand-lime"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold">Max Capacity *</label>
                  <input
                    type="number"
                    min={10}
                    max={2000}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-brand-surface border border-brand-subtle text-xs text-white focus:outline-none focus:border-brand-lime"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold">Venue Address</label>
                  <input
                    type="text"
                    value={venueAddress}
                    onChange={(e) => setVenueAddress(e.target.value)}
                    placeholder="e.g. North Quad Building, 2nd Floor"
                    className="w-full px-3 py-2 rounded-xl bg-brand-surface border border-brand-subtle text-xs text-white focus:outline-none focus:border-brand-lime"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold">Banner Image URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-brand-surface border border-brand-subtle text-xs text-white focus:outline-none focus:border-brand-lime"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-brand-subtle text-brand-lime focus:ring-brand-lime"
                  />
                  <span>Mark as Featured Spotlight Event</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-lime text-black hover:bg-brand-lime-hover shadow-glow-lime"
                >
                  Publish Event
                </button>
              </div>
            </form>
          )}

          {/* MANAGED EVENTS TABLE / LIST */}
          <div className="space-y-3">
            {managedEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-4 rounded-2xl bg-brand-elevated border border-brand-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-surface text-brand-lime border border-brand-subtle uppercase">
                      {evt.category}
                    </span>
                    {evt.isFeatured && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Featured
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-white truncate">{evt.title}</h4>
                  <p className="text-xs text-zinc-400 flex items-center gap-2">
                    <span>{evt.venueName}</span>
                    <span>•</span>
                    <span>{new Date(evt.startDate).toLocaleDateString()}</span>
                  </p>
                </div>

                {/* Capacity Counter */}
                <div className="text-left sm:text-right shrink-0">
                  <p className="text-xs font-mono text-zinc-400">Attendance</p>
                  <p className="text-sm font-mono font-bold text-white">
                    {evt.registeredCount} / {evt.capacity} seats ({Math.round((evt.registeredCount / evt.capacity) * 100)}%)
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenRoster(evt)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-surface border border-brand-subtle text-zinc-200 hover:text-white hover:border-brand-lime/40 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5 text-brand-lime" />
                    <span>Roster ({evt.registeredCount})</span>
                  </button>

                  <button
                    onClick={() => handleDeleteEvent(evt.id, evt.title)}
                    className="p-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ATTENDEE ROSTER MODAL VIEW */}
          {selectedRosterEvent && (
            <div className="p-5 rounded-2xl bg-brand-elevated border border-brand-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-brand-subtle pb-3">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Attendee Roster: {selectedRosterEvent.title}
                  </h4>
                  <p className="text-xs text-zinc-400 font-mono">
                    {rosterAttendees.length} confirmed attendee {rosterAttendees.length === 1 ? 'record' : 'records'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportAttendeeRosterCsv(selectedRosterEvent.title, rosterAttendees)}
                    disabled={rosterAttendees.length === 0}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-lime text-black hover:bg-brand-lime-hover disabled:opacity-40 transition-all shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => setSelectedRosterEvent(null)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {rosterAttendees.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-6">No registrations recorded for this event yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="text-[11px] uppercase font-mono text-zinc-500 border-b border-brand-subtle">
                      <tr>
                        <th className="pb-2">Ticket Ref</th>
                        <th className="pb-2">Participant</th>
                        <th className="pb-2">Contact</th>
                        <th className="pb-2">Passes</th>
                        <th className="pb-2">Registered</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-subtle/50 font-mono">
                      {rosterAttendees.map((a) => (
                        <tr key={a.id} className="hover:bg-white/[0.02]">
                          <td className="py-2.5 font-bold text-brand-lime">{a.ticketCode}</td>
                          <td className="py-2.5 font-sans font-medium text-white">{a.participantName}</td>
                          <td className="py-2.5 text-zinc-400">{a.participantEmail}</td>
                          <td className="py-2.5">{a.ticketCount}</td>
                          <td className="py-2.5 text-zinc-500">{new Date(a.registeredAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
