import React from 'react';
import { ArrowUpRight, Zap } from 'lucide-react';
import { Container } from './Container';

interface FooterProps {
  onOpenMyTickets?: () => void;
  onOpenOrganizerStudio?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenMyTickets,
  onOpenOrganizerStudio,
}) => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 w-full border-t border-brand-subtle bg-brand-surface transition-colors duration-200">
      <Container className="py-12 sm:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-12">
          <div className="space-y-4">
            <a
              href="#top"
              className="inline-flex items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime"
              aria-label="PULSE home"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-lime/30 bg-brand-elevated text-brand-lime">
                <Zap className="h-5 w-5" />
              </span>
              <span className="flex items-center gap-1.5 text-xl font-bold tracking-tight text-zinc-100">
                PULSE<span className="h-2 w-2 rounded-full bg-brand-lime" />
              </span>
            </a>
            <p className="max-w-sm text-sm leading-7 text-zinc-400">
              Discover events, connect with people, and find experiences worth remembering.
            </p>
            <a
              href="#events"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-lime transition-colors hover:text-brand-lime-hover"
            >
              Find your next event <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <nav aria-label="Discover" className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-200">Discover</h2>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><a href="#events" className="transition-colors hover:text-brand-lime">Upcoming events</a></li>
              <li><a href="#featured" className="transition-colors hover:text-brand-lime">Featured events</a></li>
              <li><a href="#events" className="transition-colors hover:text-brand-lime">Browse categories</a></li>
            </ul>
          </nav>

          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-200">Your experience</h2>
            <ul className="space-y-3 text-sm text-zinc-400">
              {onOpenMyTickets && (
                <li>
                  <button type="button" onClick={onOpenMyTickets} className="transition-colors hover:text-brand-lime">
                    My tickets
                  </button>
                </li>
              )}
              <li><a href="#about" className="transition-colors hover:text-brand-lime">Why PULSE</a></li>
              {onOpenOrganizerStudio && (
                <li>
                  <button type="button" onClick={onOpenOrganizerStudio} className="transition-colors hover:text-brand-lime">
                    Organizer studio
                  </button>
                </li>
              )}
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-200">Made for moments</h2>
            <p className="max-w-xs text-sm leading-7 text-zinc-400">
              From campus meetups to big ideas, make it easier to find your people and be part of something.
            </p>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-lime/20 bg-brand-lime/5 px-3 py-1.5 text-xs font-medium text-brand-lime">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-lime" /> Discover. Connect. Experience.
            </span>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-brand-subtle pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} PULSE. All rights reserved.</p>
          <a href="#top" className="transition-colors hover:text-brand-lime">Back to top ↑</a>
        </div>
      </Container>
    </footer>
  );
};
