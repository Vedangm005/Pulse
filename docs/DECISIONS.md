# K Explore — Architecture Decision Records (ADRs)

- **Document ID:** ADR-KEXP-001
- **Status:** APPROVED

---

## ADR-001: Dual-Engine Data Provider Architecture (Supabase + Autonomous LocalStorage)

### Context
The user requested a full-fledged backend powered by Supabase with PostgreSQL, Supabase Auth, and Row Level Security (RLS) to support multi-user shared data, while also requiring that the frontend can be deployed statically to Vercel, Netlify, or GitHub Pages. Furthermore, academic evaluators frequently open project links without configuring API keys or backend services.

### Decision
We implement a typed **Dual-Engine Repository Pattern** (`IDataEngine`).
- If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables are detected, the app connects to the remote Supabase PostgreSQL cluster with full Auth and RLS.
- If these keys are not set, the app transparently boots an **Autonomous Local-First Engine** backed by browser `localStorage` and seeded data.
- The UI exposes a **Quick Role Switcher** (`Attendee`, `Organizer`, `Admin`) in the navigation bar to allow professors and evaluators to test all role-gated workflows (organizer studio, attendee dashboard, event creation, attendee roster CSV export) in one click without tedious sign-up hurdles.

### Consequences
- **Positive:** 100% resilience. Zero chance of an evaluator receiving a blank screen or broken API errors on GitHub Pages.
- **Positive:** Production-ready PostgreSQL architecture and SQL schemas documented and ready for Supabase deployments.
- **Trade-off:** Minimal extra abstraction in the service layer, handled cleanly via standard TypeScript interfaces.

---

## ADR-002: Linear / Apple / Raycast-Inspired Dark-First Aesthetic with Electric Lime Accents

### Context
Generic AI-generated websites often feature saturated purple gradients, generic cards, and cliché illustrations. The user explicitly demanded an editorial, startup-quality aesthetic with dark charcoal surfaces, Electric Lime accents, Inter/Geist typography, and subtle micro-interactions.

### Decision
- Dark-first default theme (`#09090b` obsidian background, `#121316` card surface) with Electric Lime (`#D4FF00`) and Cyber Lime (`#E2FF38`) interactive accents.
- An accessible light mode toggle (`#f8fafc` background, slate typography, olive-lime contrast) persisted in `localStorage`.
- High-contrast, tabular numeric typography for countdown timers to eliminate layout shifting.
- Reusable glassmorphic badges, perforated digital ticket styling, and Framer Motion micro-interactions.

---

## ADR-003: Single-Page Architecture with Hash/Modal Routing for GitHub Pages

### Context
Hosting client-side single-page applications with HTML5 pushState on static servers like GitHub Pages often causes HTTP 404 Not Found errors when refreshing deep URLs like `/events/123`.

### Decision
Adopt a hybrid SPA routing strategy using accessible full-page views, modal dialogs, and hash-anchored navigation (`/#events`, `/#featured`, `/#dashboard`).
This guarantees 100% reload reliability on any static file server without needing custom server rewrite rules.
