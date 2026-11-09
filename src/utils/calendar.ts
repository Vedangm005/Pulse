import { Event } from '../types';

export function createGoogleCalendarUrl(event: Event): string {
  const formatTime = (iso: string) => {
    return new Date(iso).toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const start = formatTime(event.startDate);
  const end = formatTime(event.endDate);
  const title = encodeURIComponent(event.title);
  const details = encodeURIComponent(`${event.shortDescription}\n\nVenue: ${event.venueName}, ${event.venueAddress}`);
  const location = encodeURIComponent(`${event.venueName}, ${event.venueAddress}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}

export function downloadIcsFile(event: Event): void {
  const formatTime = (iso: string) => {
    return new Date(iso).toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const start = formatTime(event.startDate);
  const end = formatTime(event.endDate);
  const now = formatTime(new Date().toISOString());

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//K Explore//Event Management Platform//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:kexp_${event.id}_${Date.now()}@kexplore.io`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.shortDescription.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.venueName}\\, ${event.venueAddress}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.slug || 'event'}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
