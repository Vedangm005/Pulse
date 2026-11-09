import { Event, Registration, WaitlistEntry } from '../types';
import { SEED_EVENTS } from '../data/seedEvents';

const STORAGE_KEYS = {
  EVENTS: 'kexp_events_v2',
  REGISTRATIONS: 'kexp_registrations_v2',
  WAITLIST: 'kexp_waitlist_v2',
  FAVORITES: 'kexp_favorites_v2',
};

// Generate an authentic, formatted ticket code like KEXP-2026-X8Y2
function generateTicketCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `KEXP-2026-${rand}`;
}

export class StorageService {
  // --- EVENTS ---
  static getEvents(): Event[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (!data) {
        // Initialize with realistic seed events
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(SEED_EVENTS));
        return SEED_EVENTS;
      }
      return JSON.parse(data) as Event[];
    } catch {
      return SEED_EVENTS;
    }
  }

  static getEventById(id: string): Event | undefined {
    const events = this.getEvents();
    return events.find((e) => e.id === id);
  }

  static saveEvent(event: Event): Event {
    const events = this.getEvents();
    const index = events.findIndex((e) => e.id === event.id);

    if (index >= 0) {
      events[index] = { ...event, updatedAt: new Date().toISOString() };
    } else {
      events.unshift({
        ...event,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    return event;
  }

  static deleteEvent(id: string): boolean {
    const events = this.getEvents();
    const filtered = events.filter((e) => e.id !== id);
    if (filtered.length !== events.length) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(filtered));
      return true;
    }
    return false;
  }

  // --- REGISTRATIONS ---
  static getRegistrations(): Registration[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      return data ? (JSON.parse(data) as Registration[]) : [];
    } catch {
      return [];
    }
  }

  static registerForEvent(input: {
    eventId: string;
    participantName: string;
    participantEmail: string;
    participantPhone: string;
    ticketCount?: number;
    notes?: string;
    userId?: string;
  }): { success: true; registration: Registration } | { success: false; error: string; code: string } {
    const events = this.getEvents();
    const event = events.find((e) => e.id === input.eventId);

    if (!event) {
      return { success: false, error: 'Event not found', code: 'EVENT_NOT_FOUND' };
    }

    const registrations = this.getRegistrations();
    const cleanEmail = input.participantEmail.trim().toLowerCase();

    // 1. Enforce Duplicate Registration constraint
    const existing = registrations.find(
      (r) => r.eventId === input.eventId && 
             r.participantEmail.toLowerCase() === cleanEmail && 
             r.status === 'confirmed'
    );

    if (existing) {
      return {
        success: false,
        error: `You are already registered for "${event.title}" with ticket code ${existing.ticketCode}.`,
        code: 'DUPLICATE_REGISTRATION',
      };
    }

    // 2. Enforce Event Capacity constraint
    const count = input.ticketCount || 1;
    if (event.registeredCount + count > event.capacity) {
      return {
        success: false,
        error: `This event has reached full capacity (${event.registeredCount}/${event.capacity} registered). Would you like to join the waitlist?`,
        code: 'CAPACITY_REACHED',
      };
    }

    // 3. Generate secure ticket pass & QR payload
    const ticketCode = generateTicketCode();
    const timestamp = new Date().toISOString();
    const qrPayload = JSON.stringify({
      code: ticketCode,
      event: event.title,
      name: input.participantName.trim(),
      email: cleanEmail,
      ts: timestamp,
      v: '1.0',
    });

    const newRegistration: Registration = {
      id: `reg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ticketCode,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.startDate,
      eventVenue: event.venueName,
      userId: input.userId,
      participantName: input.participantName.trim(),
      participantEmail: cleanEmail,
      participantPhone: input.participantPhone.trim(),
      ticketCount: count,
      notes: input.notes?.trim(),
      qrPayload,
      status: 'confirmed',
      registeredAt: timestamp,
    };

    // 4. Atomically update registrations & event counter
    registrations.unshift(newRegistration);
    event.registeredCount += count;

    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));

    return { success: true, registration: newRegistration };
  }

  static cancelRegistration(registrationId: string): boolean {
    const registrations = this.getRegistrations();
    const reg = registrations.find((r) => r.id === registrationId);

    if (!reg || reg.status === 'cancelled') return false;

    // Mark cancelled
    reg.status = 'cancelled';

    // Release capacity back to the event
    const events = this.getEvents();
    const event = events.find((e) => e.id === reg.eventId);
    if (event && event.registeredCount > 0) {
      event.registeredCount = Math.max(0, event.registeredCount - reg.ticketCount);
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    }

    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
    return true;
  }

  static getRegistrationsByEmailOrUser(emailOrUserId: string): Registration[] {
    const regs = this.getRegistrations();
    const target = emailOrUserId.trim().toLowerCase();
    return regs.filter(
      (r) => (r.userId && r.userId === emailOrUserId) || r.participantEmail.toLowerCase() === target
    );
  }

  static getEventAttendees(eventId: string): Registration[] {
    const regs = this.getRegistrations();
    return regs.filter((r) => r.eventId === eventId && r.status === 'confirmed');
  }

  // --- WAITLIST ---
  static getWaitlist(): WaitlistEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WAITLIST);
      return data ? (JSON.parse(data) as WaitlistEntry[]) : [];
    } catch {
      return [];
    }
  }

  static joinWaitlist(input: {
    eventId: string;
    participantName: string;
    participantEmail: string;
    participantPhone: string;
    userId?: string;
  }): { success: true; entry: WaitlistEntry } | { success: false; error: string } {
    const waitlist = this.getWaitlist();
    const cleanEmail = input.participantEmail.trim().toLowerCase();

    const existing = waitlist.find(
      (w) => w.eventId === input.eventId && 
             w.participantEmail.toLowerCase() === cleanEmail && 
             w.status === 'waiting'
    );

    if (existing) {
      return {
        success: false,
        error: `You are already on the waitlist at position #${existing.queuePosition}.`,
      };
    }

    const currentCount = waitlist.filter((w) => w.eventId === input.eventId && w.status === 'waiting').length;
    const entry: WaitlistEntry = {
      id: `wt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      eventId: input.eventId,
      userId: input.userId,
      participantName: input.participantName.trim(),
      participantEmail: cleanEmail,
      participantPhone: input.participantPhone.trim(),
      queuePosition: currentCount + 1,
      status: 'waiting',
      createdAt: new Date().toISOString(),
    };

    waitlist.push(entry);
    localStorage.setItem(STORAGE_KEYS.WAITLIST, JSON.stringify(waitlist));
    return { success: true, entry };
  }

  // --- FAVORITES / BOOKMARKS ---
  static getFavorites(userIdOrEmail: string): string[] {
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.FAVORITES}_${userIdOrEmail}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static toggleFavorite(eventId: string, userIdOrEmail: string): boolean {
    const key = `${STORAGE_KEYS.FAVORITES}_${userIdOrEmail}`;
    const favs = this.getFavorites(userIdOrEmail);
    const index = favs.indexOf(eventId);
    let isFav = false;

    if (index >= 0) {
      favs.splice(index, 1);
    } else {
      favs.push(eventId);
      isFav = true;
    }

    localStorage.setItem(key, JSON.stringify(favs));
    return isFav;
  }
}
