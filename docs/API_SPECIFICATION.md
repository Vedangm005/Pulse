# K Explore — API & Service Contract Specification

- **Document ID:** API-KEXP-001
- **Version:** 1.0.0
- **Status:** APPROVED BASELINE
- **Contract Type:** Dual-Engine Typed Service Layer & RESTful Endpoint Specification

---

## 1. Unified Response Structure

All service operations return standardized, predictable envelope structures:

```typescript
// Success Envelope
export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

// Error Envelope
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}
```

---

## 2. Event Endpoints & Service Methods

### 2.1 `GET /api/events` (or `eventService.getAll(filters)`)
- **Description:** Retrieve list of events filtered by search keyword, category, date range, or featured flag.
- **Query / Filter Parameters:**
  - `query` (string, optional): Search keyword against title, venue, and description.
  - `category` (string, optional): One of `'all' | 'tech' | 'workshop' | 'cultural' | 'sports' | 'arts' | 'business'`.
  - `timeframe` (string, optional): One of `'all' | 'upcoming' | 'weekend' | 'month'`.
  - `featured` (boolean, optional): Filter for featured events.
  - `sort` (string, optional): One of `'date_asc' | 'date_desc' | 'popularity' | 'title'`.
- **Response `data`:** Array of `Event` objects.

### 2.2 `GET /api/events/:idOrSlug` (or `eventService.getById(id)`)
- **Description:** Retrieve full details for a single event, including agenda items and organizer profile.
- **Response `data`:** Single `EventDetail` object with nested `agenda: EventAgenda[]`.

### 2.3 `POST /api/events` (or `eventService.create(eventData)`)
- **Authorization:** Requires `organizer` or `admin` role.
- **Request Body:**
```json
{
  "title": "Quantum AI & Web3 Summit 2026",
  "category": "tech",
  "short_description": "Exploring next-gen decentralized intelligence.",
  "full_description": "Comprehensive full description with workshop schedules.",
  "start_date": "2026-11-25T09:00:00Z",
  "end_date": "2026-11-25T18:00:00Z",
  "registration_deadline": "2026-11-24T23:59:59Z",
  "venue_name": "Main Auditorium, Block C",
  "venue_address": "Tech Campus, Sector 4",
  "venue_map_url": "https://maps.google.com/?q=Tech+Campus",
  "image_url": "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
  "capacity": 300,
  "is_featured": true,
  "agenda": [
    { "time_slot": "09:00 - 10:00", "title": "Keynote Address", "speaker_name": "Dr. Sarah Chen" },
    { "time_slot": "10:15 - 12:30", "title": "Hands-on Workshop", "speaker_name": "Dev Team" }
  ]
}
```

### 2.4 `PUT /api/events/:id` (or `eventService.update(id, data)`)
- **Authorization:** Requires event ownership (`organizer_id`) or `admin` role.

### 2.5 `DELETE /api/events/:id` (or `eventService.delete(id)`)
- **Authorization:** Requires event ownership (`organizer_id`) or `admin` role.

---

## 3. Registration & Ticket Endpoints

### 3.1 `POST /api/registrations` (or `registrationService.register(input)`)
- **Description:** Registers an attendee for a specific event. Performs duplicate detection and capacity checks.
- **Request Body:**
```json
{
  "event_id": "8fa4dc23-0000-47cf-b7d0-8cb3c46d316e",
  "participant_name": "Alex Mercer",
  "participant_email": "alex.mercer@example.com",
  "participant_phone": "+1 555-0199",
  "ticket_count": 1,
  "notes": "Vegetarian lunch preference"
}
```
- **Validation Rules:**
  - `participant_name`: min 2, max 100 characters.
  - `participant_email`: valid RFC 5322 regex.
  - `participant_phone`: min 10 digits with optional leading `+`.
- **Response `data` on Success (HTTP 201):**
```json
{
  "success": true,
  "data": {
    "id": "reg_uuid_9921",
    "ticket_code": "KEXP-2026-A8K2",
    "event_id": "8fa4dc23-0000-47cf-b7d0-8cb3c46d316e",
    "event_title": "Quantum AI & Web3 Summit 2026",
    "event_date": "2026-11-25T09:00:00Z",
    "event_venue": "Main Auditorium, Block C",
    "participant_name": "Alex Mercer",
    "participant_email": "alex.mercer@example.com",
    "qr_payload": "https://kexplore.vercel.app/verify/KEXP-2026-A8K2",
    "status": "confirmed",
    "registered_at": "2026-11-09T15:35:00Z"
  },
  "message": "Registration confirmed! Your digital pass has been generated."
}
```
- **Error Cases:**
  - `400 DUPLICATE_REGISTRATION`: Already registered with this email for this event.
  - `409 CAPACITY_REACHED`: Event is sold out; invites attendee to join the Waitlist.

### 3.2 `GET /api/registrations/my-tickets` (or `registrationService.getMyTickets()`)
- **Description:** Fetch all active and past registrations for the authenticated user or local session email.

### 3.3 `DELETE /api/registrations/:id` (or `registrationService.cancel(id)`)
- **Description:** Cancels an active registration and releases 1 slot back to the event capacity.

---

## 4. Waitlist Endpoints

### 4.1 `POST /api/waitlist` (or `waitlistService.join(input)`)
- **Description:** Adds participant to the waiting queue for a fully booked event.
- **Response `data`:** Waitlist confirmation with assigned `queue_position`.

---

## 5. Organizer & Attendee Roster Endpoints

### 5.1 `GET /api/events/:id/attendees` (or `organizerService.getAttendees(eventId)`)
- **Authorization:** Only the event organizer or platform admin.
- **Response `data`:** List of confirmed attendees with names, emails, phones, ticket IDs, and registration timestamps.

### 5.2 `GET /api/events/:id/attendees/export` (or `organizerService.exportRosterCsv(eventId)`)
- **Description:** Generates a structured RFC-4180 compliant CSV string for download.

---

## 6. Authentication & Role Switcher Endpoints

### 6.1 `POST /api/auth/sign-in`
- Real authentication with Supabase Auth or instant role switcher for evaluators (`attendee` / `organizer` / `admin`).
