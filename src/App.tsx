import React, { useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Event, Registration } from './types';
import { StorageService } from './services/storageService';
import { useEventFilters } from './hooks/useEventFilters';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Container } from './components/layout/Container';
import { FeaturedSpotlight } from './components/hero/FeaturedSpotlight';
import { FilterBar } from './components/events/FilterBar';
import { EventGrid } from './components/events/EventGrid';
import { EventDetailModal } from './components/detail/EventDetailModal';
import { RegistrationModal } from './components/registration/RegistrationModal';
import { WaitlistModal } from './components/registration/WaitlistModal';
import { TicketPassModal } from './components/registration/TicketPassModal';
import { AttendeeDashboardModal } from './components/dashboard/AttendeeDashboardModal';
import { OrganizerStudioModal } from './components/organizer/OrganizerStudioModal';
import { 
  Zap, 
  ArrowRight, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Shield, 
  Smartphone, 
  QrCode 
} from 'lucide-react';

export const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  // Primary Data State
  const [events, setEvents] = useState<Event[]>(() => StorageService.getEvents());
  const [registrations, setRegistrations] = useState<Registration[]>(() => StorageService.getRegistrations());
  const [favorites, setFavorites] = useState<string[]>(() =>
    StorageService.getFavorites(currentUser?.id || currentUser?.email || 'default')
  );

  // Filter Engine Hook
  const {
    filters,
    filteredEvents,
    setQuery,
    setCategory,
    setTimeframe,
    setSortBy,
    resetFilters,
  } = useEventFilters(events);

  // Modals Management
  const [detailEvent, setDetailEvent] = useState<Event | null>(null);
  const [registerEvent, setRegisterEvent] = useState<Event | null>(null);
  const [waitlistEvent, setWaitlistEvent] = useState<Event | null>(null);
  const [confirmedPass, setConfirmedPass] = useState<Registration | null>(null);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [organizerOpen, setOrganizerOpen] = useState(false);

  // Genuine computed metrics
  const totalRsvps = events.reduce((sum, e) => sum + e.registeredCount, 0);
  const totalCapacity = events.reduce((sum, e) => sum + e.capacity, 0);
  const avgFillRate = totalCapacity > 0 ? Math.round((totalRsvps / totalCapacity) * 100) : 0;
  const uniqueCategories = new Set(events.map((e) => e.category)).size;

  // Sync state helpers
  const refreshData = useCallback(() => {
    setEvents(StorageService.getEvents());
    setRegistrations(StorageService.getRegistrations());
    setFavorites(StorageService.getFavorites(currentUser?.id || currentUser?.email || 'default'));
  }, [currentUser]);

  useEffect(() => {
    refreshData();
  }, [currentUser, refreshData]);

  // Active tickets for current user / session
  const userTickets = registrations.filter(
    (r) => r.status === 'confirmed' &&
           ((currentUser?.id && r.userId === currentUser.id) || 
            (currentUser?.email && r.participantEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
            !currentUser)
  );

  const handleToggleFavorite = (eventId: string) => {
    const isFav = StorageService.toggleFavorite(eventId, currentUser?.id || currentUser?.email || 'default');
    setFavorites((prev) => (isFav ? [...prev, eventId] : prev.filter((id) => id !== eventId)));
  };

  const handleSelectEvent = (event: Event) => {
    setDetailEvent(event);
  };

  const handleRegisterEvent = (event: Event) => {
    if (event.registeredCount >= event.capacity) {
      setWaitlistEvent(event);
    } else {
      setRegisterEvent(event);
    }
  };

  const handleRegistrationSuccess = (reg: Registration) => {
    refreshData();
    setConfirmedPass(reg);
  };

  const featuredEvents = events.filter((e) => e.isFeatured);

  return (
    <div className="min-h-screen bg-brand-black text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Universal Navbar */}
      <Navbar
        activeTicketCount={userTickets.length}
        onOpenMyTickets={() => setDashboardOpen(true)}
        onOpenOrganizerStudio={() => setOrganizerOpen(true)}
      />

      <main className="flex-1">
        
        {/* EDITORIAL HERO SECTION */}
        <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden border-b border-brand-subtle">
          
          {/* Subtle Precision Architectural Grid (Linear-style) */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40 [background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" 
            aria-hidden="true"
          />

          {/* Controlled Center Lime Glow */}
          <div 
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[320px] bg-brand-lime/10 blur-[130px] rounded-full pointer-events-none hero-glow-drift" 
            aria-hidden="true"
          />

          <Container className="relative">
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="max-w-4xl mx-auto text-center space-y-6"
            >
              
              {/* Refined Pill Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-lime/30 bg-brand-lime/10 text-brand-lime text-xs font-semibold tracking-wide uppercase font-mono">
                <Zap className="w-3.5 h-3.5" />
                <span>PULSE • EVENT INTELLIGENCE & DISCOVERY</span>
              </div>

              {/* Large Editorial Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.06]">
                Curate. Connect. <br />
                <span className="hero-gradient-text">
                  Experience Gatherings.
                </span>
              </h1>

              {/* Subheading Narrative */}
              <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Discover upcoming hackathons, tech summits, cultural fests, and workshops. With synchronized live countdowns, instant registration, and verified digital passes with QR codes.
              </p>

              {/* Primary Call to Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
                <a
                  href="#events"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-brand-lime text-black hover:bg-brand-lime-hover shadow-glow-lime hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Explore All Events</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#featured"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm bg-brand-surface border border-brand-subtle text-zinc-200 hover:text-white hover:border-brand-lime/40 hover:bg-white/[0.04] transition-all"
                >
                  <Sparkles className="w-4 h-4 text-brand-lime" />
                  <span>View Spotlight ({featuredEvents.length})</span>
                </a>
              </div>

              {/* Demo metrics are calculated from the sample event catalog and this browser's local registrations. */}
              <div className="pt-12 mt-12 border-t border-brand-subtle/70">
                <p className="mb-4 text-right text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-500">Sample event catalogue · updates in this browser</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-brand-surface/40 border border-brand-subtle text-left">
                  <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{events.length}</p>
                  <p className="text-xs text-zinc-400 mt-1 font-mono">Curated Events</p>
                </div>
                <div className="p-4 rounded-2xl bg-brand-surface/40 border border-brand-subtle text-left">
                  <p className="text-2xl sm:text-3xl font-extrabold text-brand-lime font-mono">{totalRsvps}</p>
                  <p className="text-xs text-zinc-400 mt-1 font-mono">Active RSVPs</p>
                </div>
                <div className="p-4 rounded-2xl bg-brand-surface/40 border border-brand-subtle text-left">
                  <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{avgFillRate}%</p>
                  <p className="text-xs text-zinc-400 mt-1 font-mono">Average Fill Rate</p>
                </div>
                <div className="p-4 rounded-2xl bg-brand-surface/40 border border-brand-subtle text-left">
                  <p className="text-2xl sm:text-3xl font-extrabold text-brand-lime font-mono">{uniqueCategories}</p>
                  <p className="text-xs text-zinc-400 mt-1 font-mono">Active Categories</p>
                </div>
                </div>
              </div>

            </motion.div>
          </Container>
        </section>

        {/* BENTO-GRID FEATURED SPOTLIGHT */}
        <Container>
          <FeaturedSpotlight
            featuredEvents={featuredEvents}
            onSelectEvent={handleSelectEvent}
            onRegisterEvent={handleRegisterEvent}
          />
        </Container>

        {/* INTERACTIVE EVENT CATALOG */}
        <section id="events" className="py-16 sm:py-24">
          <Container className="space-y-8">
            
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-lime">
                Explore The Calendar
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                All Upcoming Gatherings
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
                Filter by category, search by venue or keywords, and track remaining seats in real time.
              </p>
            </div>

            {/* Filter Bar */}
            <FilterBar
              filters={filters}
              onSearchChange={setQuery}
              onCategoryChange={setCategory}
              onTimeframeChange={setTimeframe}
              onSortChange={setSortBy}
              onReset={resetFilters}
              totalResults={filteredEvents.length}
            />

            {/* Events Grid */}
            <EventGrid
              events={filteredEvents}
              onSelectEvent={handleSelectEvent}
              onRegisterEvent={handleRegisterEvent}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onResetFilters={resetFilters}
            />

          </Container>
        </section>

        {/* USER-FACING PLATFORM BENEFITS */}
        <section id="about" className="border-t border-brand-subtle bg-brand-surface/30 py-16 sm:py-20">
          <Container>
            <div className="mx-auto max-w-4xl space-y-10">
              <div className="mx-auto max-w-2xl space-y-3 text-center">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-lime">
                  The PULSE experience
                </span>
                <h2 className="text-2xl font-extrabold tracking-tight text-zinc-100 sm:text-4xl">
                  Everything you need to make it happen.
                </h2>
                <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
                  Find the right gathering, save your place, and keep every event detail close at hand.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-3 rounded-2xl border border-brand-subtle bg-brand-surface p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-lime/30 bg-brand-lime/10 text-brand-lime"><Sparkles className="h-5 w-5" /></div>
                  <h3 className="font-bold text-zinc-100">Discover what matters</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">Explore curated gatherings and find events that match your interests.</p>
                </div>
                <div className="space-y-3 rounded-2xl border border-brand-subtle bg-brand-surface p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-lime/30 bg-brand-lime/10 text-brand-lime"><Calendar className="h-5 w-5" /></div>
                  <h3 className="font-bold text-zinc-100">Never miss a moment</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">Check event dates, follow live countdowns, and plan ahead with confidence.</p>
                </div>
                <div className="space-y-3 rounded-2xl border border-brand-subtle bg-brand-surface p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-lime/30 bg-brand-lime/10 text-brand-lime"><QrCode className="h-5 w-5" /></div>
                  <h3 className="font-bold text-zinc-100">Your pass, always ready</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">Keep your registration details and digital event pass together in one place.</p>
                </div>
                <div className="space-y-3 rounded-2xl border border-brand-subtle bg-brand-surface p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-lime/30 bg-brand-lime/10 text-brand-lime"><Shield className="h-5 w-5" /></div>
                  <h3 className="font-bold text-zinc-100">Simple, clear registration</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">Register with guided forms and receive a clear confirmation of your booking.</p>
                </div>
                <div className="space-y-3 rounded-2xl border border-brand-subtle bg-brand-surface p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-lime/30 bg-brand-lime/10 text-brand-lime"><Smartphone className="h-5 w-5" /></div>
                  <h3 className="font-bold text-zinc-100">Made for every screen</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">Browse and manage your event plans on mobile, tablet, or desktop.</p>
                </div>
                <div className="space-y-3 rounded-2xl border border-brand-subtle bg-brand-surface p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-lime/30 bg-brand-lime/10 text-brand-lime"><CheckCircle2 className="h-5 w-5" /></div>
                  <h3 className="font-bold text-zinc-100">Stay in control</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">Save events you like and review or manage your registrations when plans change.</p>
                </div>
              </div>
            </div>
          </Container>
        </section>

      </main>

      <Footer
        onOpenMyTickets={() => setDashboardOpen(true)}
        onOpenOrganizerStudio={
          currentUser?.role === 'organizer' || currentUser?.role === 'admin'
            ? () => setOrganizerOpen(true)
            : undefined
        }
      />

      {/* ALL MODALS & DIALOGS */}
      {detailEvent && (
        <EventDetailModal
          event={detailEvent}
          onClose={() => setDetailEvent(null)}
          onRegister={handleRegisterEvent}
        />
      )}

      {registerEvent && (
        <RegistrationModal
          event={registerEvent}
          onClose={() => setRegisterEvent(null)}
          onSuccess={handleRegistrationSuccess}
          onSwitchToWaitlist={(evt) => {
            setRegisterEvent(null);
            setWaitlistEvent(evt);
          }}
        />
      )}

      {waitlistEvent && (
        <WaitlistModal
          event={waitlistEvent}
          onClose={() => setWaitlistEvent(null)}
        />
      )}

      {confirmedPass && (
        <TicketPassModal
          registration={confirmedPass}
          onClose={() => setConfirmedPass(null)}
        />
      )}

      <AttendeeDashboardModal
        isOpen={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
        registrations={registrations}
        allEvents={events}
        onViewTicket={(reg) => {
          setConfirmedPass(reg);
        }}
        onSelectEvent={handleSelectEvent}
        onRefresh={refreshData}
      />

      <OrganizerStudioModal
        isOpen={organizerOpen}
        onClose={() => setOrganizerOpen(false)}
        events={events}
        onRefreshEvents={refreshData}
      />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
