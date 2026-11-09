# K Explore — Complete User Journeys & Interaction Flows

- **Document ID:** FLOW-KEXP-001
- **Version:** 1.0.0
- **Status:** APPROVED BASELINE

---

## 1. Flow 1: Attendee Event Discovery & Multi-Faceted Filtering

```mermaid
sequenceDiagram
    autonumber
    actor Attendee
    participant UI as Discovery View
    participant Hook as useEventFilters
    participant Service as EventService
    participant Store as DataEngine

    Attendee->>UI: Lands on Homepage
    UI->>Service: Fetch published events + featured events
    Service->>Store: Query events
    Store-->>Service: Return event list
    Service-->>UI: Render Hero, Bento Grid & Event Cards with Live Countdowns
    
    Attendee->>UI: Types "Cyber" in search bar
    UI->>Hook: Update query state: "Cyber"
    Hook->>Hook: Filter events by title / venue / tags
    Hook-->>UI: Instant card update without page flash
    
    Attendee->>UI: Clicks category pill "Tech"
    UI->>Hook: Set category filter: "tech"
    Hook-->>UI: Animated transition displaying tech matches
    
    Attendee->>UI: Clicks "Sort: Soonest First"
    Hook->>Hook: Sort by start_date ASC
    Hook-->>UI: Cards reordered smoothly
```

---

## 2. Flow 2: Event Registration, Capacity Check & Digital Ticket Generation

```mermaid
sequenceDiagram
    autonumber
    actor Attendee
    participant Card as Event Card
    participant Modal as Registration Modal
    participant Engine as RegistrationEngine
    participant Ticket as TicketPass Component

    Attendee->>Card: Clicks "Register Now"
    Card->>Modal: Open Registration Modal (Pre-populated event)
    Attendee->>Modal: Enters Name, Email, Phone, and Notes
    Attendee->>Modal: Clicks "Confirm Registration"
    
    Modal->>Modal: Run Zod Schema Validation
    alt Validation Errors Present
        Modal-->>Attendee: Display inline validation errors (Red border + helper text)
    else Form Valid
        Modal->>Engine: Submit registration payload
        Engine->>Engine: Check event capacity & duplicate registration
        
        alt Duplicate Email on Active Registration
            Engine-->>Modal: Return 400 DUPLICATE_REGISTRATION
            Modal-->>Attendee: Show warning: "You are already registered for this event."
        else Capacity Reached (Sold Out)
            Engine-->>Modal: Return 409 CAPACITY_REACHED
            Modal-->>Attendee: Offer "Event is Full — Join Waitlist Instead"
        else Registration Confirmed
            Engine->>Engine: Generate Ticket UUID & SVG QR Code payload
            Engine-->>Modal: Return Registration confirmed with Ticket Code
            Modal->>Ticket: Render Perforated Digital Ticket Pass
            Ticket-->>Attendee: Display Ticket Pass with Print / Download & Add to Calendar options
        end
    end
```

---

## 3. Flow 3: Waitlist Queuing Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Attendee
    participant Card as Event Card (Full)
    participant Modal as Waitlist Modal
    participant Engine as WaitlistEngine

    Attendee->>Card: Views event showing "Sold Out / Capacity 100%"
    Card->>Modal: Clicks "Join Waitlist"
    Attendee->>Modal: Enters Name, Email, Phone
    Modal->>Engine: Submit waitlist entry
    Engine->>Engine: Compute next queue position (e.g. #4)
    Engine-->>Modal: Waitlist entry recorded
    Modal-->>Attendee: Display confirmation: "You are #4 on the waitlist! We will notify you if a slot opens."
```

---

## 4. Flow 4: Personal Dashboard (My Registrations, Bookmarks & Cancellation)

```mermaid
sequenceDiagram
    autonumber
    actor Attendee
    participant Nav as Navbar
    participant Dash as Attendee Dashboard
    participant Engine as RegistrationEngine

    Attendee->>Nav: Clicks "My Tickets"
    Nav->>Dash: Open Dashboard (Active Tickets tab)
    Dash->>Engine: Fetch registrations for user/email
    Engine-->>Dash: Return active passes and saved events
    Dash-->>Attendee: Display tickets with live countdown to each event
    
    Attendee->>Dash: Clicks "Cancel Registration" on an event
    Dash->>Attendee: Display confirmation dialog: "Are you sure you want to cancel?"
    Attendee->>Dash: Confirms cancellation
    Dash->>Engine: Mark registration as 'cancelled'
    Engine->>Engine: Decrement registered_count & release slot
    Engine-->>Dash: Cancellation successful
    Dash-->>Attendee: Toast notification "Registration cancelled. Slot released."
```

---

## 5. Flow 5: Organizer Studio (Event Creation & Attendee Roster Export)

```mermaid
sequenceDiagram
    autonumber
    actor Organizer
    participant Studio as Organizer Studio
    participant Form as Event Creator Form
    participant Engine as EventEngine
    participant Roster as Attendee Roster Modal

    Organizer->>Studio: Accesses Organizer Studio (Role = Organizer)
    Studio-->>Organizer: Displays metrics: Total Events, Registrations, Quota
    
    Organizer->>Studio: Clicks "+ Create New Event"
    Studio->>Form: Opens Event Creation Drawer
    Organizer->>Form: Enters Title, Category, Dates, Venue, Image, Agenda
    Organizer->>Form: Clicks "Publish Event"
    Form->>Form: Zod validation
    Form->>Engine: Save new event record
    Engine-->>Studio: Event created successfully
    Studio-->>Organizer: Event published instantly to catalog
    
    Organizer->>Studio: Clicks "View Attendees" on event
    Studio->>Roster: Open Attendee Roster Table
    Roster->>Engine: Fetch attendee list for event
    Engine-->>Roster: Return participant records
    Roster-->>Organizer: Display table of registered attendees
    Organizer->>Roster: Clicks "Export to CSV"
    Roster-->>Organizer: Browser downloads `event-attendees.csv`
```
