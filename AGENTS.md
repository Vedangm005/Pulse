# AGENTS.md — Persistent Instructions for Coding Agents

## 1. Project Overview & Architecture
- **Project Name:** K Explore — Responsive Event Management Platform
- **Assignment Context:** K Explore – Web Designing
- **Architecture:** Zero-Config Client-Side Jamstack (React 18/19, TypeScript, Tailwind CSS, Vite) backed by a strongly typed LocalStorage domain persistence layer (`StorageService`).
- **Design Philosophy:** Dark-first editorial aesthetic inspired by Linear, Apple, and Raycast. Obsidian base (`#09090b`), surface charcoal (`#121316`), and Electric Lime accents (`#D4FF00`). Accessible light mode toggle included.

## 2. Approved Technology Stack
- **Frontend Core:** React 18/19, TypeScript (Strict mode enabled)
- **Bundler:** Vite
- **Styling:** Tailwind CSS with `@tailwind` directives in `src/index.css`
- **Icons:** `lucide-react`
- **Validation:** `zod` + `react-hook-form` with `@hookform/resolvers/zod`
- **Celebration Effects:** `canvas-confetti`
- **Testing:** `vitest` + `@testing-library/react` + `@testing-library/jest-dom` + `jsdom`

## 3. Strict Development Rules
- **No Unapproved Dependencies:** Do not add heavy or unnecessary dependencies.
- **Do Not Break Static Deployment:** The project must build cleanly to static assets (`npm run build` -> `dist/`) without requiring an active external database server. Evaluators can host and test it on GitHub Pages, Vercel, or Netlify with zero setup.
- **Role Escalation Protection:** Do not allow arbitrary client-side role creation. Role switching is strictly governed through controlled demo accounts (`DEMO_USERS` in `src/data/demoAccounts.ts`).
- **Database & Domain Invariants:**
  - Prevent duplicate registrations with the same email and event combination (`DUPLICATE_REGISTRATION`).
  - Prevent exceeding event capacity (`CAPACITY_REACHED`). Full events offer waitlist queuing.
  - Decrement capacity when an event registration is cancelled.
  - Every confirmed registration must receive a formatted ticket code (`KEXP-2026-XXXX`) and an SVG QR code.
- **Testing Before Completion:** Always run `npm test` and `npm run build` before declaring changes complete. Fix errors directly rather than using `@ts-ignore` or `any`.

## 4. Key Project Commands
- Run dev server: `npm run dev`
- Run test suite: `npm test`
- Build for production: `npm run build`
- Preview production build: `npm run preview`
