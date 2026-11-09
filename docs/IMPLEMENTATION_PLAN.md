# K Explore — Implementation & Milestone Plan

- **Document ID:** PLAN-KEXP-001
- **Version:** 1.0.0
- **Status:** APPROVED BASELINE

---

## Milestone Roadmap

### Milestone 1: Project Setup, Tooling & Design System Foundation
- [ ] Initialize React 19 + TypeScript + Vite project structure in root directory.
- [ ] Install and configure Tailwind CSS v3, PostCSS, and Autoprefixer with custom Linear-inspired design tokens.
- [ ] Install dependencies: `lucide-react`, `clsx`, `tailwind-merge`, `framer-motion`, `zod`, `react-hook-form`, `@hookform/resolvers`, `canvas-confetti`.
- [ ] Set up Vitest and React Testing Library test harness.
- [ ] Establish global theme provider (`ThemeProvider` supporting dark-first, light mode, and system preference).
- [ ] Verify clean compilation (`npm run build` & `npm test`).

### Milestone 2: Domain Layer, Seed Catalog & Dual-Engine Persistence
- [ ] Define comprehensive TypeScript domain models (`Event`, `Registration`, `WaitlistEntry`, `User`, `Category`).
- [ ] Create realistic, curated seed data: 10+ high-fidelity events across 6 distinct categories with rich descriptions, agendas, venue details, and Unsplash photography.
- [ ] Implement `LocalAutonomousDataEngine` with reactive LocalStorage persistence, seed initialization, and async latency simulation.
- [ ] Implement `SupabaseDataEngine` wrapper with automatic fallback when environment variables are not set.
- [ ] Unit tests for data repositories.

### Milestone 3: Premium Header, Navigation & Dark-First Landing Page
- [ ] Build glassmorphic Navbar with brand identity ("K Explore"), navigation links, Quick Role Switcher (Attendee/Organizer/Admin), and Dark/Light Mode toggle.
- [ ] Build editorial Hero section inspired by Linear/Apple:
  - Punchy typography with Electric Lime gradients.
  - Value proposition subtext.
  - Primary CTA buttons ("Explore Events", "Host an Event").
  - Live metric ticker ribbon (Events, Attendees, Success Rate).
- [ ] Build Bento-grid Spotlight for Top Featured Events with live countdown pills.
- [ ] Build Category Pill Navigation with active neon glow indicator.

### Milestone 4: Event Catalog, Fuzzy Search & Multi-Faceted Filters
- [ ] Build real-time Search Bar with instant debounce and clear button.
- [ ] Build Multi-Filter controls: Category selector, Date Range filter (All, Today, Weekend, Month), Availability toggle, and Sort dropdown (Soonest, Popularity, Title).
- [ ] Build Event Card Component:
  - 16:9 cinematic image with shimmer placeholder.
  - Glassmorphic category badge.
  - Live ticking countdown badge (`useCountdown` hook).
  - Venue, Date, and Capacity progress bar.
  - Quick action buttons ("Details", "Register").
  - Subtle hover lift and border glow.
- [ ] Empty state with "Reset Filters" action button.

### Milestone 5: Rich Event Detail View & Calendar Integration
- [ ] Build Event Detail View / Modal:
  - Hero header with high-res banner.
  - Full multi-paragraph description.
  - Interactive schedule/agenda timeline.
  - Venue map details and directions link.
  - Organizer info card.
  - Capacity indicator with dynamic status badge ("Open", "Few Seats Left", "Sold Out").
  - "Add to Calendar" integration: Google Calendar link generator + Apple/Outlook `.ics` file download.

### Milestone 6: Bulletproof Registration Form & Capacity Enforcement
- [ ] Build Registration Modal:
  - Pre-selected event header.
  - Fields: Full Name, Email, Phone Number, Ticket Count, Notes.
  - Client-side validation using React Hook Form + Zod schema.
  - Real-time inline error styling with clear feedback.
- [ ] Capacity and duplicate registration enforcement logic.
- [ ] Loading submission spinner and disabled state to prevent duplicate clicks.

### Milestone 7: Dynamic Digital Ticket, QR Code & Waitlist Engine
- [ ] Build Perforated Digital Ticket Pass Modal:
  - Confetti celebration burst (`canvas-confetti`).
  - Unique Ticket Code (e.g. `KEXP-2026-X8Y2`).
  - SVG QR Code encoder with ticket verification payload.
  - Event metadata summary and attendee details.
  - "Print / Save Ticket as PDF" action and "Add to Calendar" button.
- [ ] Build Waitlist Modal:
  - Automatically triggered when event capacity reaches 100%.
  - Collects participant details and records queue position.
  - Confirmation showing position in line.

### Milestone 8: Attendee Personal Dashboard ("My Tickets" & Saved Events)
- [ ] Build Personal User Dashboard:
  - "Active Tickets" tab: List of confirmed registrations with live countdown to each event, "View Ticket", and "Cancel Registration" options.
  - "Saved Events" tab: Bookmarked events with quick registration CTA.
  - "Past Events" tab.
- [ ] Cancellation workflow with confirmation prompt and capacity release.

### Milestone 9: Organizer Studio & Attendee Rosters
- [ ] Build Organizer Studio:
  - Top metric cards: Total Events Created, Total Registrations, Average Fill Rate.
  - Event Management Table: View, Edit, and Delete/Cancel events.
  - Event Creation Form: Rich drawer/modal to publish new events.
  - Attendee Roster Modal: View table of registered attendees for each event.
  - "Export Roster to CSV" button generating instant file download.

### Milestone 10: Quality Control, Testing, Documentation & Submission Packaging
- [ ] Write Vitest unit tests for validation schemas, countdown logic, and filter algorithms.
- [ ] Write React Testing Library integration tests for registration and theme toggling.
- [ ] Execute TypeScript strict type checking (`tsc --noEmit`).
- [ ] Execute production build (`npm run build`).
- [ ] Create comprehensive `README.md` and `AGENTS.md`.
- [ ] Produce final verification and handover report.
