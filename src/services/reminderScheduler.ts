import { SiteVisitBooking } from '../types/booking';

export interface SimulatedReminderMessage {
  id: string;
  bookingId: string;
  leadName: string;
  recipientPhone: string;
  type: '24h_before' | '2h_before';
  scheduledFor: string;
  sentAt?: string;
  channel: 'WhatsApp' | 'SMS';
  messageBody: string;
  status: 'Scheduled' | 'Delivered' | 'OptedOut';
}

/**
 * Generates RERA-compliant templated reminders.
 * Under RERA, promotional messages must show the project registration number.
 * Under DPDP 2023, reminders must provide an explicit opt-out instruction.
 */
export function generateReminderPayload(
  booking: SiteVisitBooking,
  type: '24h_before' | '2h_before',
  reraNumber: string
): SimulatedReminderMessage {
  const is24h = type === '24h_before';

  const messageBody = is24h
    ? `Namaste ${booking.leadName}! Looking forward to welcoming you tomorrow at ${booking.projectName} for your site visit at ${booking.timeString}. Your advisor ${booking.assignedExecutiveName} is prepared with the floor plans. Location Pin: ${booking.locationPin.googleMapsUrl} | RERA: ${reraNumber}. Reply STOP to cancel or opt out under DPDP 2023.`
    : `Hello ${booking.leadName}! Your site visit at ${booking.projectName} is in 2 hours (${booking.timeString}). Dedicated parking is reserved for your vehicle. Meet ${booking.assignedExecutiveName} at the reception. Location: ${booking.locationPin.landmark}. GujRERA: ${reraNumber}.`;

  return {
    id: `REM-${booking.bookingId}-${type}`,
    bookingId: booking.bookingId,
    leadName: booking.leadName,
    recipientPhone: booking.leadPhone,
    type,
    scheduledFor: is24h
      ? booking.reminders.reminder24hScheduled
      : booking.reminders.reminder2hScheduled,
    sentAt: new Date().toISOString(),
    channel: 'WhatsApp',
    messageBody,
    status: 'Delivered',
  };
}
