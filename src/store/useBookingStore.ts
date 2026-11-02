import { useState, useEffect } from 'react';
import { SiteVisitSlot, SiteVisitBooking, ProjectId, BookingStatus, SlotHold } from '../types/booking';
import { INITIAL_BOOKINGS } from '../data/seedData';
import { concurrencyLock } from '../services/concurrencyLock';
import { toolConfirmBooking } from '../services/aiBookingTools';
import { generateReminderPayload, SimulatedReminderMessage } from '../services/reminderScheduler';
import { MASTER_FACT_SHEET } from '../data/factSheetData';

const BOOKINGS_STORAGE_KEY = 'propease_bookings_v1';
const SLOTS_STORAGE_KEY = 'propease_slots_v1';
const REMINDERS_STORAGE_KEY = 'propease_reminders_v1';

// Generate authentic slots for the next 7 days for Projects 1 & 2
function generateInitialSlots(): SiteVisitSlot[] {
  const times = [
    { time: '10:00 AM', display: '10:00 AM - 10:45 AM' },
    { time: '11:00 AM', display: '11:00 AM - 11:45 AM' },
    { time: '12:00 PM', display: '12:00 PM - 12:45 PM' },
    { time: '02:00 PM', display: '02:00 PM - 02:45 PM' },
    { time: '03:00 PM', display: '03:00 PM - 03:45 PM' },
    { time: '04:00 PM', display: '04:00 PM - 04:45 PM' },
    { time: '05:00 PM', display: '05:00 PM - 05:45 PM' },
  ];

  const slots: SiteVisitSlot[] = [];
  const projects: ProjectId[] = ['Project 1', 'Project 2'];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];

    for (const proj of projects) {
      for (const t of times) {
        const slotId = concurrencyLock.generateSlotId(proj, dateStr, t.time);
        // Pre-seed some slots to simulate real bookings from sample data
        const isHardikSlot = proj === 'Project 1' && t.time === '11:00 AM' && i === 2;
        const isChiragSlot = proj === 'Project 1' && t.time === '03:00 PM' && i === 3;
        const isKavitaSlot = proj === 'Project 2' && t.time === '12:00 PM' && i === 0;

        const confirmedCount = isHardikSlot || isChiragSlot || isKavitaSlot ? 1 : 0;

        slots.push({
          slotId,
          projectId: proj,
          date: dateStr,
          timeString: t.time,
          displayTime: t.display,
          maxCapacity: 2, // 2 simultaneous visits max per slot
          confirmedCount,
          activeHoldCount: 0,
          assignedExecutiveIds: isHardikSlot ? ['EXEC-01'] : isChiragSlot ? ['EXEC-02'] : isKavitaSlot ? ['EXEC-03'] : [],
        });
      }
    }
  }

  return slots;
}

function getStoredSlots(): SiteVisitSlot[] {
  try {
    const raw = localStorage.getItem(SLOTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback
  }
  return generateInitialSlots();
}

function getStoredBookings(): SiteVisitBooking[] {
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback
  }
  return INITIAL_BOOKINGS;
}

function getStoredReminders(): SimulatedReminderMessage[] {
  try {
    const raw = localStorage.getItem(REMINDERS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback
  }
  return [];
}

export function useBookingStore() {
  const [slots, setSlots] = useState<SiteVisitSlot[]>(getStoredSlots);
  const [bookings, setBookings] = useState<SiteVisitBooking[]>(getStoredBookings);
  const [reminders, setReminders] = useState<SimulatedReminderMessage[]>(getStoredReminders);
  const [activeHold, setActiveHold] = useState<SlotHold | null>(null);

  useEffect(() => {
    localStorage.setItem(SLOTS_STORAGE_KEY, JSON.stringify(slots));
  }, [slots]);

  useEffect(() => {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
  }, [reminders]);

  /**
   * Phase 1: Acquires a 180s hold on a slot.
   */
  const holdSlot = (slotId: string, leadPhone: string) => {
    const targetSlot = slots.find((s) => s.slotId === slotId);
    if (!targetSlot) return { success: false, reason: 'SLOT_NOT_FOUND' };

    const holdResult = concurrencyLock.acquireSlotHold(targetSlot, leadPhone);
    if (holdResult.success && holdResult.hold) {
      setActiveHold(holdResult.hold);
      setSlots((prev) =>
        prev.map((s) => (s.slotId === slotId ? { ...s, activeHoldCount: s.activeHoldCount + 1 } : s))
      );
    }
    return holdResult;
  };

  /**
   * Phase 2: Commits a confirmed site visit.
   */
  const bookSiteVisit = (
    slotId: string,
    leadId: string,
    leadName: string,
    leadPhone: string,
    projectId: ProjectId,
    configuration: '2 BHK' | '3 BHK'
  ) => {
    const targetSlot = slots.find((s) => s.slotId === slotId);
    if (!targetSlot) return { success: false, error: 'SLOT_NOT_FOUND' };

    const { toolResult, booking, updatedSlot } = toolConfirmBooking(
      targetSlot,
      leadId,
      leadName,
      leadPhone,
      projectId,
      configuration,
      activeHold?.holdId
    );

    if (toolResult.success && booking && updatedSlot) {
      setSlots((prev) => prev.map((s) => (s.slotId === slotId ? updatedSlot : s)));
      setBookings((prev) => [booking, ...prev]);
      setActiveHold(null);

      // Generate 24h and 2h reminder logs
      const reraNum = MASTER_FACT_SHEET[projectId].reraNumber;
      const rem24h = generateReminderPayload(booking, '24h_before', reraNum);
      const rem2h = generateReminderPayload(booking, '2h_before', reraNum);
      setReminders((prev) => [rem24h, rem2h, ...prev]);

      return { success: true, booking };
    }

    return { success: false, error: toolResult.error || 'Booking failed' };
  };

  /**
   * Updates booking status (Show / Visited / No-Show / Rescheduled).
   */
  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.bookingId === bookingId ? { ...b, status } : b))
    );
  };

  /**
   * Reset store to initial state.
   */
  const resetToSeeds = () => {
    const defaultSlots = generateInitialSlots();
    setSlots(defaultSlots);
    setBookings(INITIAL_BOOKINGS);
    setReminders([]);
    setActiveHold(null);
    localStorage.removeItem(SLOTS_STORAGE_KEY);
    localStorage.removeItem(BOOKINGS_STORAGE_KEY);
    localStorage.removeItem(REMINDERS_STORAGE_KEY);
  };

  return {
    slots,
    bookings,
    reminders,
    activeHold,
    holdSlot,
    bookSiteVisit,
    updateBookingStatus,
    resetToSeeds,
  };
}
