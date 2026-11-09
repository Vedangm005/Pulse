# Pulse — Event Discovery & Management Platform

Pulse is a responsive event discovery and management web application designed to simplify how users explore events, register for gatherings, and manage their digital tickets.

The platform provides a centralized interface for discovering campus events, hackathons, technical workshops, cultural programmes, and other gatherings. It also includes event management tools for organizers, allowing them to create events, monitor registrations, and manage attendee information.

The application is built using React, TypeScript, and Vite, with a focus on usability, responsive design, and maintainable frontend architecture.

## Features

### Event Discovery
- Browse upcoming and featured events through a responsive event catalogue.
- Search events by title, description, and venue.
- Filter events by category and date.
- Sort events based on available criteria.
- View event descriptions, schedules, speakers, and venue information.
- Track upcoming events using live countdown timers.

### Registration and Digital Tickets
- Register for events using a validated registration form.
- Validate user details using Zod schemas.
- Prevent duplicate registrations and enforce event capacity limits.
- Generate individual digital tickets with unique reference codes.
- Display QR codes containing ticket reference information.
- Print digital tickets using a print-friendly layout.
- Cancel existing registrations.

### Attendee Dashboard
- View registered events and corresponding tickets.
- Track upcoming event dates.
- Manage saved and bookmarked events.
- Access registration details and cancel bookings.

### Event Management
- Create, update, and remove events through the Organizer Studio.
- Monitor event capacity and registration counts.
- View attendee registration records.
- Export attendee information as CSV files.
- Manage waitlists when events reach their registration limits.

### Additional Functionality
- Dark and light themes with persistent preferences.
- Google Calendar integration.
- Downloadable `.ics` calendar files.
- Responsive layouts for mobile, tablet, and desktop.
- Interactive UI elements and subtle animations.

## Technology Stack

| Area | Technology |
|---|---|
| Frontend | React 18, TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Form Validation | React Hook Form, Zod |
| Animations | Framer Motion |
| Notifications | Toast-based UI components |
| QR Generation | QR code library |
| Testing | Vitest, React Testing Library |
| Data Persistence | Browser LocalStorage |

## Project Structure

```text
Pulse/
├── docs/
│   ├── PROJECT_SPEC.md
│   ├── SYSTEM_ARCHITECTURE.md
│   ├── DATABASE_DESIGN.md
│   ├── API_SPECIFICATION.md
│   ├── USER_FLOWS.md
│   ├── SECURITY_DESIGN.md
│   ├── IMPLEMENTATION_PLAN.md
│   └── DECISIONS.md
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── hero/
│   │   ├── events/
│   │   ├── detail/
│   │   ├── registration/
│   │   ├── dashboard/
│   │   └── organizer/
│   │
│   ├── context/
│   ├── data/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── validation/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── tests/
│   ├── storageService.test.ts
│   ├── countdown.test.ts
│   ├── filters.test.ts
│   ├── foundation.test.tsx
│   └── registrationFlow.test.tsx
│
├── AGENTS.md
├── README.md
├── package.json
├── package-lock.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Getting Started

### Prerequisites

Ensure the following are installed:

- Node.js 18 or later
- npm 9 or later
- Git

### Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the project directory:

```bash
cd Pulse
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local development URL displayed in the terminal. By default, Vite uses:

```text
http://localhost:5173
```

## Testing and Build

The project uses Vitest and React Testing Library for automated testing.

Run the test suite:

```bash
npm test
```

Generate a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The production-ready static files are generated inside the `dist/` directory.

### Test Coverage

The current test suite contains 17 tests across five test files, covering:

- Local data storage and registration management.
- Duplicate registration and event capacity handling.
- Countdown calculations and date boundaries.
- Event search and filtering.
- Theme switching and component behaviour.
- Registration form validation and user interactions.

The recorded verification results are 17 passing tests and a successful production build.

## Architecture and Data Persistence

Pulse currently follows a frontend-only architecture.

The application uses a service layer to separate event and registration operations from the UI components. This makes the application easier to maintain and provides a foundation for integrating a backend in the future.

Browser LocalStorage is used to persist:

- Event catalogue changes.
- User registrations.
- Saved events.
- Waitlist entries.
- Theme preferences.
- Demo user state.

**Current limitations**

The application does not currently use a connected backend or server-side database.

Consequently:

- Data is stored separately in each browser.
- Registrations are not synchronized across devices or users.
- Demo role switching is not equivalent to real authentication.
- QR codes represent ticket reference information but are not verified by a secure server.
- LocalStorage data can be modified by the browser user.

The database and API specifications in the `docs/` directory describe potential backend implementations and are not deployed services.

## Deployment

Pulse can be deployed as a static website using Vercel or Netlify.

### Vercel

1. Push the project to a GitHub repository.
2. Import the repository into Vercel.
3. Configure the following build settings:

| Setting | Value |
|---|---|
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm ci` |

4. Deploy the application.

### Netlify

Build the project:

```bash
npm run build
```

Deploy the generated `dist/` directory using Netlify.

## Project Evaluation

The application has been developed with the following objectives:

- A consistent and responsive user interface.
- Accessible event discovery and registration workflows.
- Reusable React components and TypeScript interfaces.
- Input validation and client-side data safety.
- Persistent browser-based data management.
- Automated testing and production build verification.
- Clear technical documentation and deployment support.

---

**Pulse — Event Discovery & Management Platform**

Built using React, TypeScript, and Vite.
