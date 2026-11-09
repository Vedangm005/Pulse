import { Registration } from '../types';

export function exportAttendeeRosterCsv(eventTitle: string, attendees: Registration[]): void {
  const headers = ['Ticket Code', 'Participant Name', 'Email Address', 'Phone', 'Tickets', 'Registered At', 'Notes'];
  
  const escapeCell = (val: string | number | undefined) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = attendees.map((a) => [
    escapeCell(a.ticketCode),
    escapeCell(a.participantName),
    escapeCell(a.participantEmail),
    escapeCell(a.participantPhone),
    escapeCell(a.ticketCount),
    escapeCell(new Date(a.registeredAt).toLocaleString()),
    escapeCell(a.notes || ''),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeFilename = eventTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  link.setAttribute('download', `attendees-${safeFilename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
