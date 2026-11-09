import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { 
  Zap, 
  Sun, 
  Moon, 
  Ticket, 
  Sparkles, 
  Menu, 
  X, 
  Building2, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';

interface NavbarProps {
  onOpenMyTickets?: () => void;
  onOpenOrganizerStudio?: () => void;
  activeTicketCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMyTickets,
  onOpenOrganizerStudio,
  activeTicketCount = 0,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, loginAsDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    loginAsDemo(role);
    setRoleMenuOpen(false);
  };

  return (
    <header id="top" className="sticky top-0 z-40 w-full border-b border-brand-subtle bg-brand-black/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <a 
              href="#" 
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime rounded-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-surface to-brand-elevated border border-brand-lime/30 flex items-center justify-center text-brand-lime group-hover:shadow-glow-lime group-hover:border-brand-lime transition-all duration-300">
                <Zap className="w-5 h-5 transition-transform group-hover:scale-110 duration-200" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  PULSE
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-lime animate-pulse"></span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 -mt-1">
                  Events Platform
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links with subtle lime indicators */}
            <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
              <a 
                href="#events" 
                className="relative px-3.5 py-2 text-zinc-300 hover:text-white rounded-lg transition-colors group"
              >
                <span>Browse Events</span>
                <span className="absolute bottom-0.5 left-3.5 right-3.5 h-[2px] bg-brand-lime scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </a>

              <a 
                href="#featured" 
                className="relative px-3.5 py-2 text-zinc-300 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 group"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-lime" />
                <span>Featured</span>
                <span className="absolute bottom-0.5 left-3.5 right-3.5 h-[2px] bg-brand-lime scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </a>

              <a 
                href="#about" 
                className="relative px-3.5 py-2 text-zinc-300 hover:text-white rounded-lg transition-colors group"
              >
                <span>Platform</span>
                <span className="absolute bottom-0.5 left-3.5 right-3.5 h-[2px] bg-brand-lime scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </a>
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Demo Role Switcher (Controlled Account Picker) */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-brand-subtle bg-brand-surface hover:border-brand-lime/40 text-xs font-medium text-zinc-300 hover:text-white transition-all"
                title="Switch persona"
              >
                {currentUser?.role === 'admin' ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                ) : currentUser?.role === 'organizer' ? (
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <UserCheck className="w-3.5 h-3.5 text-brand-lime" />
                )}
                <span className="capitalize">{currentUser?.role || 'Guest'}</span>
                <span className="text-[10px] text-zinc-500 font-mono">(Role)</span>
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-brand-subtle bg-brand-elevated p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-brand-subtle mb-1">
                    <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      Switch Role
                    </p>
                    <p className="text-xs text-zinc-200 mt-0.5 font-medium truncate">
                      {currentUser?.fullName}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRoleSelect('attendee')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                      currentUser?.role === 'attendee'
                        ? 'bg-brand-lime/10 text-brand-lime font-semibold'
                        : 'text-zinc-300 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-brand-lime" />
                      <span>Attendee (Alex)</span>
                    </div>
                    {currentUser?.role === 'attendee' && <span className="w-1.5 h-1.5 rounded-full bg-brand-lime"></span>}
                  </button>
                  <button
                    onClick={() => handleRoleSelect('organizer')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                      currentUser?.role === 'organizer'
                        ? 'bg-amber-400/10 text-amber-400 font-semibold'
                        : 'text-zinc-300 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-amber-400" />
                      <span>Organizer (Dr. Chen)</span>
                    </div>
                    {currentUser?.role === 'organizer' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                  </button>
                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                      currentUser?.role === 'admin'
                        ? 'bg-purple-400/10 text-purple-400 font-semibold'
                        : 'text-zinc-300 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      <span>Admin (Platform)</span>
                    </div>
                    {currentUser?.role === 'admin' && <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>}
                  </button>
                </div>
              )}
            </div>

            {/* Organizer Studio CTA (If Organizer or Admin) */}
            {(currentUser?.role === 'organizer' || currentUser?.role === 'admin') && onOpenOrganizerStudio && (
              <button
                onClick={onOpenOrganizerStudio}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/30 hover:bg-amber-400/20 transition-colors"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Organizer Studio</span>
              </button>
            )}

            {/* My Tickets Button */}
            {onOpenMyTickets && (
              <button
                onClick={onOpenMyTickets}
                className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-surface border border-brand-subtle text-zinc-100 hover:border-brand-lime/50 hover:bg-white/[0.04] transition-all"
                title="View your registered tickets"
              >
                <Ticket className="w-4 h-4 text-brand-lime" />
                <span>My Passes</span>
                {activeTicketCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-brand-lime text-black">
                    {activeTicketCount}
                  </span>
                )}
              </button>
            )}

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-pressed={theme === 'light'}
              className="p-2.5 rounded-xl border border-brand-subtle bg-brand-surface text-zinc-300 hover:text-white hover:border-brand-lime/40 transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-brand-lime" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-400" />
              )}
            </button>
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-pressed={theme === 'light'}
              className="p-2 rounded-lg border border-brand-subtle text-zinc-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-brand-lime" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-brand-subtle text-zinc-300 hover:text-white"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-brand-subtle bg-brand-surface/98 p-4 space-y-3">
          <nav className="flex flex-col gap-1 text-sm font-medium">
            <a 
              href="#events" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-zinc-200 hover:bg-white/[0.04] rounded-lg"
            >
              Browse Events
            </a>
            <a 
              href="#featured" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-zinc-200 hover:bg-white/[0.04] rounded-lg flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-brand-lime" />
              Featured Events
            </a>
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-zinc-200 hover:bg-white/[0.04] rounded-lg"
            >
              Platform Overview
            </a>
          </nav>

          <div className="pt-3 border-t border-brand-subtle flex flex-col gap-2">
            {onOpenMyTickets && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMyTickets();
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold bg-brand-lime/10 text-brand-lime border border-brand-lime/30"
              >
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4" />
                  <span>My Passes & Tickets</span>
                </div>
                {activeTicketCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-brand-lime text-black">
                    {activeTicketCount}
                  </span>
                )}
              </button>
            )}

            {(currentUser?.role === 'organizer' || currentUser?.role === 'admin') && onOpenOrganizerStudio && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOrganizerStudio();
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/30"
              >
                <Building2 className="w-4 h-4" />
                <span>Organizer Studio</span>
              </button>
            )}

            {/* Mobile Role Switcher */}
            <div className="pt-2">
              <span className="text-[11px] font-mono text-zinc-500 uppercase">Current Persona</span>
              <div className="grid grid-cols-3 gap-1.5 mt-1">
                {(['attendee', 'organizer', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleSelect(r)}
                    className={`px-2 py-1.5 rounded-lg text-xs capitalize font-medium border ${
                      currentUser?.role === r
                        ? 'border-brand-lime bg-brand-lime/10 text-brand-lime font-bold'
                        : 'border-brand-subtle text-zinc-400'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
