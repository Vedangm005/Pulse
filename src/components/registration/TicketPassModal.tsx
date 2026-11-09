import React from 'react';
import { Registration } from '../../types';
import { generateQrSvg } from '../../utils/qr';
import { formatFullDateTime } from '../../utils/dateUtils';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Ticket, 
  User, 
  Share2
} from 'lucide-react';

interface TicketPassModalProps {
  registration: Registration | null;
  onClose: () => void;
}

export const TicketPassModal: React.FC<TicketPassModalProps> = ({
  registration,
  onClose,
}) => {
  if (!registration) return null;

  const qrSvg = generateQrSvg(registration.qrPayload, 160);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const text = `I'm attending ${registration.eventTitle}! Ticket Ref: ${registration.ticketCode}`;
    navigator.clipboard.writeText(text);
    alert('Ticket reference copied to clipboard!');
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-brand-surface border border-brand-subtle shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Floating Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-brand-black/60 text-zinc-400 hover:text-white border border-brand-subtle hover:border-brand-lime/40 backdrop-blur-md transition-colors print:hidden"
          aria-label="Close pass"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Celebration Header */}
        <div className="bg-gradient-to-r from-brand-lime/20 via-brand-surface to-brand-lime/10 p-6 sm:p-8 border-b border-brand-subtle text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-lime/20 border border-brand-lime/40 text-brand-lime mx-auto flex items-center justify-center shadow-glow-lime">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-brand-lime text-black uppercase tracking-wider">
            Registration Confirmed
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Here Is Your Digital Pass
          </h3>
          <p className="text-xs text-zinc-400">
            Show this digital ticket or QR code at check-in.
          </p>
        </div>

        {/* Perforated Ticket Card Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="relative rounded-2xl bg-brand-elevated border border-brand-subtle p-5 sm:p-6 space-y-5">
            
            {/* Ticket Top: Title & Code */}
            <div className="flex items-start justify-between gap-4 border-b border-dashed border-brand-subtle pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-brand-lime font-bold">
                  Event Pass
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                  {registration.eventTitle}
                </h4>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono uppercase text-zinc-500">Ticket Ref</span>
                <p className="text-sm font-mono font-extrabold text-brand-lime tracking-wider">
                  {registration.ticketCode}
                </p>
              </div>
            </div>

            {/* Middle Grid: Meta & QR Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              
              <div className="space-y-3 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-brand-lime shrink-0" />
                  <span className="font-semibold text-white truncate">{registration.participantName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{formatFullDateTime(registration.eventDate)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{registration.eventVenue}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Ticket className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>{registration.ticketCount} {registration.ticketCount === 1 ? 'General Pass' : 'General Passes'}</span>
                </div>
              </div>

              {/* Dynamic QR Code */}
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-brand-subtle">
                <div 
                  className="rounded-lg overflow-hidden p-1 bg-white shadow-inner"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
                <span className="text-[9px] font-mono text-zinc-400 uppercase mt-2 tracking-widest">
                  Scan to Verify
                </span>
              </div>

            </div>

            {/* Bottom Bar: Timestamp */}
            <div className="pt-3 border-t border-dashed border-brand-subtle flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>Status: <strong className="text-brand-lime">CONFIRMED</strong></span>
              <span>Issued: {new Date(registration.registeredAt).toLocaleDateString()}</span>
            </div>

          </div>

          {/* Action Buttons (Hidden when printing) */}
          <div className="grid grid-cols-2 gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-brand-lime text-black hover:bg-brand-lime-hover shadow-glow-lime transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold bg-brand-elevated border border-brand-subtle text-zinc-200 hover:text-white hover:border-brand-lime/40 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Ticket</span>
            </button>
          </div>

          <div className="text-center print:hidden">
            <button
              onClick={onClose}
              className="text-xs text-zinc-400 hover:text-zinc-200 hover:underline font-mono"
            >
              Return to Events
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
