# K Explore — Security Design & Threat Model

- **Document ID:** SEC-KEXP-001
- **Version:** 1.0.0
- **Status:** APPROVED BASELINE
- **Framework:** OWASP Top 10 Web Application Security Standards

---

## 1. Threat Modeling & Mitigation Matrix

| Threat Category | Potential Attack Vector | K Explore Mitigation Architecture |
|---|---|---|
| **Injection (SQLi)** | User inputs manipulated to alter database queries. | • In Supabase: Parameterized queries exclusively via Supabase SDK.<br/>• In Local Engine: Strongly-typed TypeScript access without dynamic string query construction. |
| **Cross-Site Scripting (XSS)** | Malicious scripts injected through event descriptions, names, or notes. | • 100% React JSX safe interpolation.<br/>• Zero use of `dangerouslySetInnerHTML`.<br/>• Strict Zod string trimming and entity encoding on user input. |
| **Broken Access Control (IDOR)** | Attendee attempts to view or delete another attendee's ticket or modify another organizer's event. | • Supabase Row Level Security (RLS) ensures users can only read/update their own registrations (`user_id = auth.uid()`).<br/>• Local engine isolates user sessions and checks ownership prior to cancel/edit operations. |
| **Denial of Service / Race Conditions** | Concurrent registrations exceeding the event capacity limit. | • In Supabase: Atomic database increment transaction with `CHECK (registered_count <= capacity)`.<br/>• In Local Engine: Synchronous mutation locks guaranteeing single-threaded capacity checks before ticket confirmation. |
| **Sensitive Data Exposure** | Password hashes, secrets, or administrative tokens leaked to client bundles. | • Vite bundle strictly isolates client code; zero secret tokens or service-role keys bundled.<br/>• Supabase anonymous key has strictly limited, RLS-governed permissions. |
| **Session Hijacking & State Tampering** | Malicious script modifying LocalStorage keys to impersonate roles or hijack registrations. | • Defensive JSON schema validation on every storage read.<br/>• Corrupt or tampered payloads trigger graceful reset to safe defaults rather than crashing or escalating privilege. |

---

## 2. Input Validation Specifications (Zod Schemas)

All inputs are subjected to strict validation prior to state changes or API dispatch:

### 2.1 Registration Form Schema
```typescript
import { z } from 'zod';

export const RegistrationSchema = z.object({
  eventId: z.string().uuid({ message: "Invalid event reference" }),
  participantName: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(80, { message: "Name must not exceed 80 characters" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Name contains invalid characters" }),
  participantEmail: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address (e.g. name@domain.com)" })
    .max(120, { message: "Email is too long" }),
  participantPhone: z
    .string()
    .trim()
    .regex(/^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, {
      message: "Please enter a valid 10-digit phone number (e.g. +1 555-0199 or 9876543210)",
    }),
  ticketCount: z
    .number()
    .int()
    .min(1, { message: "At least 1 ticket required" })
    .max(5, { message: "Maximum 5 tickets per individual registration" })
    .default(1),
  notes: z.string().trim().max(300, { message: "Notes must not exceed 300 characters" }).optional(),
});
```

### 2.2 Event Creation Schema (Organizer Studio)
```typescript
export const CreateEventSchema = z.object({
  title: z.string().trim().min(5).max(150),
  category: z.enum(['tech', 'workshop', 'cultural', 'sports', 'arts', 'business']),
  shortDescription: z.string().trim().min(20).max(250),
  fullDescription: z.string().trim().min(50).max(3000),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  registrationDeadline: z.string().datetime(),
  venueName: z.string().trim().min(3).max(120),
  venueAddress: z.string().trim().min(5).max(200),
  venueMapUrl: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().url({ message: "Must be a valid image URL" }),
  capacity: z.number().int().min(5).max(5000),
  isFeatured: z.boolean().default(false),
});
```

---

## 3. QR Code Cryptographic Payload Generation

Each digital ticket produces an SVG QR code. The payload contains:
1. `ticket_code`: Unique identifier (e.g., `KEXP-2026-X8Y2`).
2. `event_id`: Reference to the event.
3. `timestamp`: UNIX timestamp of registration.
4. `verification_url`: Direct validation URL that can be scanned by event staff at the door to verify ticket validity and show the attendee's name.
