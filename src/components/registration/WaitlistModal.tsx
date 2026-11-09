import React, { useState } from 'react';
import { Event, WaitlistEntry } from '../../types';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { X, Clock, User, Mail, Phone, AlertCircle } from 'lucide-react';

interface WaitlistModalProps {
  event: Event | null;
  onClose: () => void;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({ event, onClose }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [error, setError] = useState<string | null>(null);
  const [successEntry, setSuccessEntry] = useState<WaitlistEntry | null>(null);

  if (!event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    const res = StorageService.joinWaitlist({
      eventId: event.id,
      participantName: name,
      participantEmail: email,
      participantPhone: phone,
      userId: currentUser?.id,
    });

    if (!res.success) {
      setError(res.error);
      return;
    }

    setSuccessEntry(res.entry);
    showToast('info', 'Waitlist Joined', `You are #${res.entry.queuePosition} in line.`);
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md rounded-3xl bg-brand-surface border border-brand-subtle shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-brand-black/60 text-zinc-400 hover:text-white border border-brand-subtle hover:border-brand-lime/40 backdrop-blur-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="bg-gradient-to-r from-brand-orange/20 via-brand-surface to-brand-orange/10 p-6 sm:p-8 border-b border-brand-subtle text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-orange/20 border border-brand-orange/40 text-brand-orange mx-auto flex items-center justify-center shadow-glow-orange">
            <Clock className="w-6 h-6" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-brand-orange text-white uppercase tracking-wider">
            Capacity Reached
          </span>
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            Join Event Waitlist
          </h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            {event.title} is currently full. Secure your position in the priority queue.
          </p>
        </div>

        {successEntry ? (
          <div className="p-6 sm:p-8 space-y-5 text-center">
            <div className="p-5 rounded-2xl bg-brand-elevated border border-brand-subtle space-y-2">
              <p className="text-xs font-mono text-zinc-400 uppercase">Your Queue Position</p>
              <p className="text-4xl font-extrabold text-brand-orange font-mono">
                #{successEntry.queuePosition}
              </p>
              <p className="text-xs text-zinc-300">
                If another participant cancels, priority is assigned in queue order.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-brand-elevated border border-brand-subtle text-zinc-200 hover:text-white transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold">Your Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Full name"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-brand-elevated border border-brand-subtle text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@campus.edu"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-brand-elevated border border-brand-subtle text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+1 555-0144"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-brand-elevated border border-brand-subtle text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-orange text-white hover:bg-brand-orange/90 shadow-glow-orange"
              >
                Confirm Waitlist Position
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
