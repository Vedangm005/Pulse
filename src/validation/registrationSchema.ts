import { z } from 'zod';

export const RegistrationSchema = z.object({
  participantName: z
    .string()
    .trim()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(80, { message: 'Name must not exceed 80 characters' })
    .regex(/^[a-zA-Z\s'.-]+$/, { message: 'Name contains invalid characters' }),
  participantEmail: z
    .string()
    .trim()
    .email({ message: 'Please enter a valid email address (e.g. name@domain.com)' })
    .max(120, { message: 'Email address is too long' }),
  participantPhone: z
    .string()
    .trim()
    .regex(/^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, {
      message: 'Please enter a valid phone number with at least 10 digits',
    }),
  ticketCount: z
    .number({ invalid_type_error: 'Please select a valid ticket count' })
    .int()
    .min(1, { message: 'At least 1 ticket required' })
    .max(5, { message: 'Maximum 5 tickets per registration' })
    .default(1),
  notes: z
    .string()
    .trim()
    .max(300, { message: 'Special notes must not exceed 300 characters' })
    .optional(),
});

export type RegistrationFormData = z.infer<typeof RegistrationSchema>;
