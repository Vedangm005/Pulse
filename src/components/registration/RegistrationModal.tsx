import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegistrationSchema, RegistrationFormData } from '../../validation/registrationSchema';
import { Event, Registration } from '../../types';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Ticket, 
  Calendar, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';

interface RegistrationModalProps {
  event: Event | null;
  onClose: () => void;
  onSuccess: (registration: Registration) => void;
  onSwitchToWaitlist?: (event: Event) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  event,
  onClose,
  onSuccess,
  onSwitchToWaitlist,
}) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      participantName: currentUser?.fullName || '',
      participantEmail: currentUser?.email || '',
      participantPhone: currentUser?.phone || '',
      ticketCount: 1,
      notes: '',
    },
  });

  if (!event) return null;

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    // Simulate minor network latency for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 300));

    const result = StorageService.registerForEvent({
      eventId: event.id,
      participantName: data.participantName,
      participantEmail: data.participantEmail,
      participantPhone: data.participantPhone,
      ticketCount: data.ticketCount,
      notes: data.notes,
      userId: currentUser?.id,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setServerError(result.error);
      showToast('error', 'Registration Failed', result.error);
      return;
    }

    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4FF00', '#FFFFFF', '#FF5500'],
      });
    } catch {
      // Confetti not supported in environment
    }

    showToast('success', 'Registration Confirmed!', `Ticket ref: ${result.registration.ticketCode}`);
    onClose();
    onSuccess(result.registration);
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl rounded-3xl bg-brand-surface border border-brand-subtle shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-brand-black/60 text-zinc-400 hover:text-white border border-brand-subtle hover:border-brand-lime/40 backdrop-blur-md transition-colors"
          aria-label="Close registration"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header with Selected Event Preview */}
        <div className="bg-brand-elevated p-6 sm:p-8 border-b border-brand-subtle space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-lime text-black uppercase tracking-wider">
              {event.category}
            </span>
            <span className="text-xs font-mono text-zinc-400">Official Registration Form</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Register for {event.title}
          </h3>

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-300">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-lime" />
              <span>{new Date(event.startDate).toLocaleDateString()}</span>
            </span>
            <span className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span className="truncate">{event.venueName}</span>
            </span>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-5">
          
          {/* Server Error Alert */}
          {serverError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{serverError}</p>
              </div>
              {serverError.includes('capacity') && onSwitchToWaitlist && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSwitchToWaitlist(event);
                  }}
                  className="mt-1 font-semibold text-brand-lime hover:underline block"
                >
                  Click here to join the Waitlist instead →
                </button>
              )}
            </div>
          )}

          {/* Full Name Input */}
          <div className="space-y-1.5">
            <label htmlFor="participantName" className="block text-xs font-semibold text-zinc-300 font-mono uppercase tracking-wider">
              Full Name <span className="text-brand-lime">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="participantName"
                type="text"
                {...register('participantName')}
                placeholder="e.g. Alex Mercer"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-elevated border text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none transition-all ${
                  errors.participantName
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-brand-subtle focus:border-brand-lime/60 focus:ring-1 focus:ring-brand-lime/60'
                }`}
              />
            </div>
            {errors.participantName && (
              <p className="text-[11px] text-red-400 font-medium">{errors.participantName.message}</p>
            )}
          </div>

          {/* Email Address Input */}
          <div className="space-y-1.5">
            <label htmlFor="participantEmail" className="block text-xs font-semibold text-zinc-300 font-mono uppercase tracking-wider">
              Email Address <span className="text-brand-lime">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="participantEmail"
                type="email"
                {...register('participantEmail')}
                placeholder="e.g. alex.mercer@campus.edu"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-elevated border text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none transition-all ${
                  errors.participantEmail
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-brand-subtle focus:border-brand-lime/60 focus:ring-1 focus:ring-brand-lime/60'
                }`}
              />
            </div>
            {errors.participantEmail && (
              <p className="text-[11px] text-red-400 font-medium">{errors.participantEmail.message}</p>
            )}
          </div>

          {/* Phone Number Input */}
          <div className="space-y-1.5">
            <label htmlFor="participantPhone" className="block text-xs font-semibold text-zinc-300 font-mono uppercase tracking-wider">
              Phone Number <span className="text-brand-lime">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="participantPhone"
                type="tel"
                {...register('participantPhone')}
                placeholder="e.g. +1 555-0144 or 9876543210"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-elevated border text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none transition-all ${
                  errors.participantPhone
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-brand-subtle focus:border-brand-lime/60 focus:ring-1 focus:ring-brand-lime/60'
                }`}
              />
            </div>
            {errors.participantPhone && (
              <p className="text-[11px] text-red-400 font-medium">{errors.participantPhone.message}</p>
            )}
          </div>

          {/* Ticket Count & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300 font-mono uppercase tracking-wider">
                Passes
              </label>
              <div className="relative">
                <Ticket className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <select
                  {...register('ticketCount', { valueAsNumber: true })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-elevated border border-brand-subtle text-sm text-zinc-100 focus:outline-none focus:border-brand-lime/60"
                >
                  <option value={1}>1 Pass</option>
                  <option value={2}>2 Passes</option>
                  <option value={3}>3 Passes</option>
                  <option value={4}>4 Passes</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300 font-mono uppercase tracking-wider">
                Special Requests (Optional)
              </label>
              <input
                type="text"
                {...register('notes')}
                placeholder="e.g. Accessibility seating"
                className="w-full px-4 py-2.5 rounded-xl bg-brand-elevated border border-brand-subtle text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-brand-lime/60"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-brand-subtle flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-brand-subtle text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-lime text-black hover:bg-brand-lime-hover shadow-glow-lime disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Pass...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Free Registration</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
