import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Event } from '../../types';
import { CountdownBadge } from '../events/CountdownBadge';
import { formatEventDate } from '../../utils/dateUtils';
import { Sparkles, Calendar, MapPin, ArrowRight } from 'lucide-react';

interface FeaturedSpotlightProps {
  featuredEvents: Event[];
  onSelectEvent: (event: Event) => void;
  onRegisterEvent: (event: Event) => void;
}

export const FeaturedSpotlight: React.FC<FeaturedSpotlightProps> = ({
  featuredEvents,
  onSelectEvent,
  onRegisterEvent,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (featuredEvents.length === 0) return null;

  const leadEvent = featuredEvents[0];
  const secondaryEvents = featuredEvents.slice(1, 3);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <section id="featured" className="py-16 sm:py-24 border-b border-brand-subtle">
      <div className="space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-lime/30 bg-brand-lime/10 text-brand-lime text-xs font-mono font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Featured & Spotlight Events
            </h2>
          </div>
          <a
            href="#events"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-brand-lime hover:underline"
          >
            <span>View All Events ({featuredEvents.length}+ featured)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Asymmetric Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          
          {/* Primary Lead Spotlight Card (7 cols) */}
          {leadEvent && (
            <motion.div
              variants={cardVariants}
              whileHover={shouldReduceMotion ? undefined : { y: -4 }}
              className="lg:col-span-7 relative group rounded-3xl overflow-hidden bg-brand-surface border border-brand-subtle hover:border-brand-lime/40 transition-colors duration-300 flex flex-col justify-between min-h-[440px] p-6 sm:p-8 shadow-2xl"
            >
              {/* Background Photography with deep gradient vignette */}
              <div className="absolute inset-0 z-0">
                <img
                  src={leadEvent.imageUrl}
                  alt={leadEvent.title}
                  className="w-full h-full object-cover object-center brightness-[0.45] group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-surface/80 to-transparent" />
              </div>

              {/* Top Meta Badges */}
              <div className="relative z-10 flex items-center justify-between gap-3">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-brand-lime text-black uppercase tracking-wider shadow-glow-lime">
                  Spotlight • {leadEvent.category}
                </span>
                <CountdownBadge targetDate={leadEvent.startDate} />
              </div>

              {/* Bottom Editorial Content */}
              <div className="relative z-10 space-y-4 pt-16">
                <div className="flex items-center gap-2 text-xs font-mono text-brand-lime">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatEventDate(leadEvent.startDate)}</span>
                  <span>•</span>
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">{leadEvent.venueName}</span>
                </div>

                <h3 
                  onClick={() => onSelectEvent(leadEvent)}
                  className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight cursor-pointer hover:text-brand-lime transition-colors leading-tight"
                >
                  {leadEvent.title}
                </h3>

                <p className="text-sm text-zinc-300 max-w-xl leading-relaxed line-clamp-2">
                  {leadEvent.shortDescription}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => onRegisterEvent(leadEvent)}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-lime text-black hover:bg-brand-lime-hover shadow-glow-lime hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Reserve Spot
                  </button>
                  <button
                    onClick={() => onSelectEvent(leadEvent)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-colors"
                  >
                    View Schedule & Agenda
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Secondary Stacked Bento Highlights (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {secondaryEvents.map((event) => (
              <motion.div
                key={event.id}
                variants={cardVariants}
                whileHover={shouldReduceMotion ? undefined : { y: -3 }}
                className="relative group rounded-3xl overflow-hidden bg-brand-surface border border-brand-subtle hover:border-brand-lime/40 transition-colors duration-300 flex-1 p-5 sm:p-6 flex flex-col justify-between shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-brand-lime font-bold">
                      {event.category}
                    </span>
                    <h4
                      onClick={() => onSelectEvent(event)}
                      className="text-base sm:text-lg font-bold text-white tracking-tight hover:text-brand-lime transition-colors cursor-pointer line-clamp-1"
                    >
                      {event.title}
                    </h4>
                  </div>
                  <CountdownBadge targetDate={event.startDate} />
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 my-3 leading-relaxed">
                  {event.shortDescription}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-brand-subtle/50 text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="truncate">{event.venueName}</span>
                  </span>

                  <button
                    onClick={() => onRegisterEvent(event)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-brand-elevated text-brand-lime border border-brand-lime/30 hover:bg-brand-lime hover:text-black transition-all"
                  >
                    Register
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </motion.div>

      </div>
    </section>
  );
};
