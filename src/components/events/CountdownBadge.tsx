import React from 'react';
import { useCountdown } from '../../hooks/useCountdown';
import { Clock } from 'lucide-react';

interface CountdownBadgeProps {
  targetDate: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CountdownBadge: React.FC<CountdownBadgeProps> = ({
  targetDate,
  size = 'sm',
  className = '',
}) => {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800/90 text-zinc-400 border border-brand-subtle text-xs font-mono font-medium ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
        <span>Event Active / Concluded</span>
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`grid grid-cols-4 gap-2 text-center p-3 rounded-2xl bg-brand-surface/90 border border-brand-lime/25 backdrop-blur-md shadow-glow-lime ${className}`}>
        <div className="flex flex-col">
          <span className="text-2xl sm:text-3xl font-extrabold text-brand-lime font-mono tabular-nums leading-none">
            {days}
          </span>
          <span className="text-[10px] text-zinc-400 font-mono uppercase mt-1">Days</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums leading-none">
            {hours}
          </span>
          <span className="text-[10px] text-zinc-400 font-mono uppercase mt-1">Hours</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums leading-none">
            {minutes}
          </span>
          <span className="text-[10px] text-zinc-400 font-mono uppercase mt-1">Mins</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl sm:text-3xl font-extrabold text-brand-lime font-mono tabular-nums leading-none">
            {seconds}
          </span>
          <span className="text-[10px] text-zinc-400 font-mono uppercase mt-1">Secs</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-black/90 text-brand-lime border border-brand-lime/30 backdrop-blur-md text-xs font-mono font-semibold tabular-nums shadow-lg ${className}`}
      title="Live ticking countdown to event start"
    >
      <Clock className="w-3.5 h-3.5 text-brand-lime shrink-0 animate-pulse" />
      <span>
        {days}d {hours}h {minutes}m {seconds}s
      </span>
    </div>
  );
};
