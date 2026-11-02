export type ProjectId = 'Project 1' | 'Project 2';

export type BookingStatus = 'Booked' | 'Visited' | 'No-Show' | 'Cancelled' | 'Rescheduled';

export interface LocationPin {
  lat: number;
  lng: number;
  address: string;
  landmark: string;
  googleMapsUrl: string;
}

export interface SlotHold {
  holdId: string;
  slotId: string;
  leadPhone: string;
  expiresAt: number; // Unix timestamp ms (Date.now() + 180_000)
}

export interface SiteVisitSlot {
  slotId: string; // e.g. "SLOT-P1-20261105-1100"
  projectId: ProjectId;
  date: string; // YYYY-MM-DD
  timeString: string; // e.g. "11:00 AM"
  displayTime: string; // "11:00 AM - 11:45 AM"
  maxCapacity: number; // Max concurrent appointments (default: 2)
  confirmedCount: number;
  activeHoldCount: number;
  assignedExecutiveIds: string[];
  isBlocked?: boolean; // Admin can block a slot to prevent new bookings
}

export interface SiteVisitBooking {
  bookingId: string; // e.g. "BK-9021"
  leadId: string;
  leadName: string;
  leadPhone: string;
  projectId: ProjectId;
  projectName: string;
  date: string;
  timeString: string;
  assignedExecutiveId: string;
  assignedExecutiveName: string;
  status: BookingStatus;
  configurationWanted: '2 BHK' | '3 BHK';
  locationPin: LocationPin;
  reminders: {
    reminder24hScheduled: string;
    reminder24hSent: boolean;
    reminder2hScheduled: string;
    reminder2hSent: boolean;
  };
  bookedAt: string;
  notes?: string;
}

export interface SalesExecutive {
  id: string; // e.g. "EXEC-01"
  name: string;
  role: string;
  phone: string;
  email: string;
  assignedProjects: ProjectId[];
  languages: ('en' | 'hi' | 'gu')[];
  avatar: string;
  totalAssigned: number;
  totalVisited: number;
  showUpRate: number; // Percentage
  activeToday: boolean;
}
