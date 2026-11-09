import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../src/services/storageService';

describe('StorageService & Business Rules', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with seed events on first call', () => {
    const events = StorageService.getEvents();
    expect(events.length).toBeGreaterThanOrEqual(7);
    expect(events[0].title).toBeDefined();
  });

  it('enforces duplicate registration prevention for same email and event', () => {
    const events = StorageService.getEvents();
    const targetEvent = events[0];

    // First registration succeeds
    const reg1 = StorageService.registerForEvent({
      eventId: targetEvent.id,
      participantName: 'Jane Doe',
      participantEmail: 'jane.doe@example.com',
      participantPhone: '+1 555-0101',
    });
    expect(reg1.success).toBe(true);

    // Second registration with same email fails with DUPLICATE_REGISTRATION
    const reg2 = StorageService.registerForEvent({
      eventId: targetEvent.id,
      participantName: 'Jane Doe',
      participantEmail: 'jane.doe@example.com',
      participantPhone: '+1 555-0101',
    });
    expect(reg2.success).toBe(false);
    if (!reg2.success) {
      expect(reg2.code).toBe('DUPLICATE_REGISTRATION');
    }
  });

  it('enforces capacity limit and rejects registration when full', () => {
    // Event evt_sports_001 is seeded with capacity: 350 and registeredCount: 350
    const fullEvent = StorageService.getEventById('evt_sports_001');
    expect(fullEvent).toBeDefined();

    const attempt = StorageService.registerForEvent({
      eventId: 'evt_sports_001',
      participantName: 'Sam Player',
      participantEmail: 'sam.player@example.com',
      participantPhone: '+1 555-0102',
    });

    expect(attempt.success).toBe(false);
    if (!attempt.success) {
      expect(attempt.code).toBe('CAPACITY_REACHED');
    }
  });

  it('cancels registration and releases capacity back to the event', () => {
    const event = StorageService.getEvents()[0];
    const initialCount = event.registeredCount;

    const reg = StorageService.registerForEvent({
      eventId: event.id,
      participantName: 'Mark Vance',
      participantEmail: 'mark@example.com',
      participantPhone: '+1 555-0103',
    });
    expect(reg.success).toBe(true);

    if (reg.success) {
      const updatedEvent = StorageService.getEventById(event.id);
      expect(updatedEvent?.registeredCount).toBe(initialCount + 1);

      // Now cancel
      const cancelled = StorageService.cancelRegistration(reg.registration.id);
      expect(cancelled).toBe(true);

      const postCancelEvent = StorageService.getEventById(event.id);
      expect(postCancelEvent?.registeredCount).toBe(initialCount);
    }
  });
});
