import { User } from '../types';

export const DEMO_USERS: Record<string, User> = {
  attendee: {
    id: 'usr_demo_attendee_01',
    email: 'alex.mercer@campus.edu',
    fullName: 'Alex Mercer',
    phone: '+1 555-0144',
    role: 'attendee',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-10-01T08:00:00Z',
  },
  organizer: {
    id: 'usr_demo_organizer_01',
    email: 'sarah.chen@kexplore.io',
    fullName: 'Dr. Sarah Chen',
    phone: '+1 555-0199',
    role: 'organizer',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-09-15T09:30:00Z',
  },
  admin: {
    id: 'usr_demo_admin_01',
    email: 'admin@kexplore.io',
    fullName: 'Platform Overseer',
    phone: '+1 555-0100',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-08-01T00:00:00Z',
  },
};
