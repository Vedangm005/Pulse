# K Explore — Responsive Event Management Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-17%20Passed-brightgreen.svg)](https://vitest.dev/)

> **Task Title:** Design and Develop a Responsive Event Management Website  
> **Course / Unit:** K Explore – Web Designing  
> **Evaluation Criteria:** Creativity, UI/UX, Functionality, Responsiveness, Code Quality, Documentation, Deployment.

---

> **Implementation status (important):** The current checked-in application is a frontend demonstration. Event data, registrations, waitlists, favourites, theme preference, and demo user state are stored in the visitor's browser using `localStorage`. The current source does **not** include a connected Supabase/Firebase backend, server API, real authentication, cross-device synchronization, or server-side ticket verification. The database/API documents describe a proposed design and should not be interpreted as deployed backend functionality.

## 1. Project Overview

**K Explore** is a modern, responsive event discovery and lifecycle management platform built for campus gatherings, tech hackathons, design workshops, and cultural summits. 

Designed with inspiration from **Linear, Apple, and Raycast**, the application features a dark-first obsidian interface (`#09090b`), high-contrast typography, **Electric Lime** (`#D4FF00`) interactive accents, and smooth micro-interactions.

### Key Capabilities

1. **Editorial Hero & Bento-Grid Spotlight:** Dynamic introduction with real-time stats and spotlighted featured events.
2. **Synchronized Live Countdowns:** Real-time ticking timers (`08d 14h 22m 10s`) rendered with tabular numeric alignment to prevent layout shifting.
3. **Multi-Faceted Search & Filtering:** Real-time search by keyword, venue, or title; category filters (Tech, Workshops, Cultural, Sports, Arts, Business); date range filtering; and sorting.
4. **Interactive Event Detail View:** Modal view presenting full schedules, agendas, speaker profiles, venue locations, and calendar sync (Google Calendar & `.ics` download).
5. **Form Validation with Zod:** JavaScript/TypeScript validation checking name bounds, RFC 5322 compliant emails, and 10-digit phone numbers before submission.
6. **Digital Ticket Pass with Dynamic QR Code:** Perforated ticket with printable PDF styling and SVG QR code encoding ticket verification data.
7. **Capacity & Waitlist System:** Prevents overbooking; sold-out events allow users to join a priority waitlist queue.
8. **Attendee Dashboard ("My Tickets"):** Review registered tickets, live countdowns to registered events, download passes, and cancel registrations.
9. **Organizer Studio:** Role-gated dashboard allowing organizers to create, edit, delete events, inspect registration quotas, and export attendee rosters to `.csv`.
10. **Theme Switcher:** Dark-first design with accessible Light Mode toggle, persisting in `localStorage`.

---

## 2. Technology Stack

- **Framework:** React (TypeScript)
- **Bundler:** Vite
- **Styling:** Tailwind CSS (custom dark-first design tokens)
- **Icons:** Lucide React
- **Validation:** React Hook Form + Zod
- **Visual Effects:** Canvas Confetti
- **Testing:** Vitest + React Testing Library + jsdom
- **Persistence:** Strongly-typed LocalStorage domain engine (`StorageService`) with seed catalog

---

## 3. Project Structure

```text
├── docs/
│   ├── PROJECT_SPEC.md          # Comprehensive Product Specification
│   ├── SYSTEM_ARCHITECTURE.md   # System Architecture & Diagrams
│   ├── DATABASE_DESIGN.md       # PostgreSQL DDL & Local Schema
│   ├── API_SPECIFICATION.md     # REST Contracts & Service Interfaces
│   ├── USER_FLOWS.md            # Interaction Sequence Diagrams
│   ├── SECURITY_DESIGN.md       # Threat Model & OWASP Compliance
│   ├── IMPLEMENTATION_PLAN.md   # Milestone Execution Plan
│   └── DECISIONS.md             # Architecture Decision Records (ADRs)
│
├── src/
│   ├── components/
│   │   ├── common/              # Buttons, inputs, modals
│   │   ├── layout/              # Navbar, Footer, Container
│   │   ├── hero/                # FeaturedSpotlight, Bento grid
│   │   ├── events/              # EventCard, EventGrid, FilterBar, CountdownBadge
│   │   ├── detail/              # EventDetailModal
│   │   ├── registration/        # RegistrationModal, TicketPassModal, WaitlistModal
│   │   ├── dashboard/           # AttendeeDashboardModal
│   │   └── organizer/           # OrganizerStudioModal
│   ├── context/                 # AuthContext, ThemeContext, ToastContext
│   ├── data/                    # seedEvents.ts, demoAccounts.ts
│   ├── hooks/                   # useCountdown.ts, useEventFilters.ts
│   ├── services/                # storageService.ts
│   ├── utils/                   # calendar.ts, csvExport.ts, dateUtils.ts, qr.ts
│   ├── validation/              # registrationSchema.ts
│   ├── App.tsx                  # Main Application Orchestrator
│   ├── index.css                # Tailwind directives & design tokens
│   └── main.tsx                 # Entrypoint
│
├── tests/                       # Automated Test Suite (17 tests)
│   ├── storageService.test.ts   # Duplicate prevention, capacity, cancellation
│   ├── countdown.test.ts        # Countdown time math & expiration guards
│   ├── filters.test.ts          # Search indexing & category filtering
│   ├── foundation.test.tsx      # Theme toggle & layout components
│   └── registrationFlow.test.tsx# Form validation & interactive user journey
│
├── AGENTS.md                    # Persistent instructions for agents
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 4. Getting Started & Installation

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation
```bash
# 1. Clone repository
git clone <your-github-repo-url>
cd "K Explore"

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 5. Verification & Testing

```bash
# Run Vitest test suite
npm test

# Run strict TypeScript compiler check & production build
npm run build

# Preview production build locally
npm run preview
```

### Actual Test Results (Verified)
- **Test Files:** 5 passed (5)
- **Tests:** 17 passed (17)
- **TypeScript Checking:** 0 errors
- **Production Build:** Succeeded (`dist/`)

---

## 6. Static Deployment Guide

The application builds to zero-dependency static assets in `dist/`.

### Deploy to Vercel
```bash
npx vercel
```
*Or import the GitHub repository in the Vercel dashboard. Build command: `npm run build`, Output directory: `dist`.*

### Deploy to Netlify
```bash
npx netlify deploy --prod --dir=dist
```
*Or drag-and-drop the `dist/` folder into Netlify Drop.*

### Deploy to GitHub Pages
1. In `package.json`, ensure `"base": "./"` is set in `vite.config.ts` (already configured).
2. Run `npm run build`.
3. Deploy the `dist/` directory to your `gh-pages` branch.

---

## 7. Submission Checklist

- [x] Responsive on mobile phones (320px–480px), tablets, and desktops
- [x] Hero section introducing platform with key metrics
- [x] Upcoming & featured events showcase (Bento grid)
- [x] Event cards with name, date, venue, image, and short description
- [x] Live search and category filters (instant, zero page-reloads)
- [x] Detailed event modal with agenda and venue details
- [x] Registration form collecting Name, Email, Phone, and Event
- [x] JavaScript form validation (Zod schema checking email syntax & 10-digit phone)
- [x] Confirmation notification & printable digital ticket with SVG QR code
- [x] Bonus 1: Dark / Light Mode with LocalStorage persistence
- [x] Bonus 2: Live synchronized event countdown timers
- [x] Bonus 3: Framer Motion & CSS smooth micro-interactions
- [x] Bonus 4: LocalStorage registration data management & cancellation
- [x] Advanced 1: Personal Attendee Dashboard ("My Tickets" & Saved Events)
- [x] Advanced 2: Organizer Studio (Event CRUD, Roster inspection, CSV export)
- [x] Advanced 3: Waitlist queueing for sold-out events
- [x] Advanced 4: Google Calendar and `.ics` file synchronization
