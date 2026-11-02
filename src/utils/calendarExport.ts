import { SiteVisitBooking } from '../types/booking';

/**
 * Generates an iCalendar (.ics) string for a booked site visit.
 */
export function generateIcsContent(booking: SiteVisitBooking): string {
  const cleanDate = booking.date.replace(/-/g, '');
  // Defaulting to standard 45-min appointment block
  const startHour = booking.timeString.includes('11:00')
    ? '110000'
    : booking.timeString.includes('12:00')
    ? '120000'
    : booking.timeString.includes('03:00')
    ? '150000'
    : '100000';
  
  const endHour = booking.timeString.includes('11:00')
    ? '114500'
    : booking.timeString.includes('12:00')
    ? '124500'
    : booking.timeString.includes('03:00')
    ? '154500'
    : '104500';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Company A//PropEase AI Concierge//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${booking.bookingId}@companya-realty.in`,
    `DTSTAMP:${cleanDate}T000000Z`,
    `DTSTART:${cleanDate}T${startHour}`,
    `DTEND:${cleanDate}T${endHour}`,
    `SUMMARY:Site Visit: ${booking.projectName} with ${booking.assignedExecutiveName}`,
    `DESCRIPTION:Site walkthrough with ${booking.assignedExecutiveName} for ${booking.configurationWanted} unit. Contact: ${booking.assignedExecutiveName}. Address: ${booking.locationPin.address}`,
    `LOCATION:${booking.locationPin.address}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Triggers a browser download of the .ics file.
 */
export function downloadCalendarInvite(booking: SiteVisitBooking): void {
  const icsData = generateIcsContent(booking);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Site_Visit_${booking.projectName.replace(/\s+/g, '_')}_${booking.bookingId}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
