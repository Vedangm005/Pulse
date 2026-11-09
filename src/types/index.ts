export type EventCategory = 
  | 'all' 
  | 'tech' 
  | 'workshop' 
  | 'cultural' 
  | 'sports' 
  | 'arts' 
  | 'business';

export type UserRole = 'attendee' | 'organizer' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface AgendaItem {
  id: string;
  timeSlot: string;
  title: string;
  description?: string;
  speakerName?: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  category: EventCategory;
  shortDescription: string;
  fullDescription: string;
  startDate: string; // ISO 8601
  endDate: string;
  registrationDeadline: string;
  venueName: string;
  venueAddress: string;
  venueMapUrl?: string;
  imageUrl: string;
  capacity: number;
  registeredCount: number;
  isFeatured: boolean;
  status: 'published' | 'draft' | 'cancelled' | 'completed';
  organizerId: string;
  organizerName: string;
  agenda: AgendaItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Registration {
  id: string;
  ticketCode: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  userId?: string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  ticketCount: number;
  notes?: string;
  qrPayload: string;
  status: 'confirmed' | 'cancelled';
  registeredAt: string;
}

export interface WaitlistEntry {
  id: string;
  eventId: string;
  userId?: string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  queuePosition: number;
  status: 'waiting' | 'promoted' | 'cancelled';
  createdAt: string;
}

export interface EventFilterState {
  query: string;
  category: EventCategory;
  timeframe: 'all' | 'upcoming' | 'weekend' | 'month';
  sortBy: 'date_asc' | 'date_desc' | 'popularity' | 'title';
  hideFull: boolean;
}
