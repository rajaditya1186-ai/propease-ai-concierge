import { ProjectId, SiteVisitSlot, SiteVisitBooking } from '../types/booking';
import { AgentToolCallResult } from '../types/tools';
import { concurrencyLock } from './concurrencyLock';
import { MASTER_FACT_SHEET } from '../data/factSheetData';
import { SALES_EXECUTIVES } from '../data/executivesData';

/**
 * Tool 1: check_available_slots
 * Evaluates real-time conflict-free slots.
 */
export function toolCheckAvailableSlots(
  projectId: ProjectId,
  slots: SiteVisitSlot[],
  date?: string
): AgentToolCallResult {
  const filtered = slots.filter((s) => {
    const matchProject = s.projectId === projectId;
    const matchDate = date ? s.date === date : true;
    const hasCapacity = s.confirmedCount + s.activeHoldCount < s.maxCapacity;
    return matchProject && matchDate && hasCapacity;
  });

  if (filtered.length === 0) {
    return {
      toolName: 'check_available_slots',
      success: true,
      data: [],
      userFacingMessage: `Currently all scheduled slots for ${MASTER_FACT_SHEET[projectId].commercialName} on this date are fully reserved. Would you like me to check the next available day?`,
    };
  }

  const slotSummary = filtered
    .slice(0, 4)
    .map((s) => `${s.date} at ${s.displayTime}`)
    .join(', ');

  return {
    toolName: 'check_available_slots',
    success: true,
    data: filtered,
    userFacingMessage: `Here are upcoming free slots for ${MASTER_FACT_SHEET[projectId].commercialName}: ${slotSummary}. Which time suits you best?`,
  };
}

/**
 * Tool 2: hold_slot
 * Holds a slot for 180 seconds to prevent race conditions while user types details.
 */
export function toolHoldSlot(
  slot: SiteVisitSlot,
  leadPhone: string
): AgentToolCallResult {
  const result = concurrencyLock.acquireSlotHold(slot, leadPhone);

  if (!result.success) {
    return {
      toolName: 'hold_slot',
      success: false,
      error: result.reason,
      userFacingMessage: `That specific slot was just selected by another buyer a moment ago. Let me show you the closest available alternative time.`,
    };
  }

  return {
    toolName: 'hold_slot',
    success: true,
    data: result.hold,
    userFacingMessage: `I have held the ${slot.timeString} slot for you for 3 minutes while you confirm your visit pass.`,
  };
}

/**
 * Tool 3: confirm_site_visit
 * Atomically commits a site visit booking and assigns a named sales advisor.
 */
export function toolConfirmBooking(
  slot: SiteVisitSlot,
  leadId: string,
  leadName: string,
  leadPhone: string,
  projectId: ProjectId,
  configuration: '2 BHK' | '3 BHK',
  holdId?: string
): {
  toolResult: AgentToolCallResult;
  booking?: SiteVisitBooking;
  updatedSlot?: SiteVisitSlot;
} {
  const commitResult = concurrencyLock.validateAndCommitBooking(slot, holdId);

  if (!commitResult.success || !commitResult.updatedSlot) {
    return {
      toolResult: {
        toolName: 'confirm_site_visit',
        success: false,
        error: commitResult.error,
        userFacingMessage: `Double booking prevented: That slot reached full capacity right now. Please select an adjacent slot.`,
      },
    };
  }

  // Assign appropriate named sales executive from Company A
  const candidateExecs = SALES_EXECUTIVES.filter(
    (e) => e.activeToday && e.assignedProjects.includes(projectId)
  );
  const assignedExec = candidateExecs.length > 0 ? candidateExecs[0] : SALES_EXECUTIVES[0];

  const projectFact = MASTER_FACT_SHEET[projectId];
  const bookingId = `BK-${Date.now().toString().slice(-5)}`;

  const booking: SiteVisitBooking = {
    bookingId,
    leadId,
    leadName,
    leadPhone,
    projectId,
    projectName: projectFact.commercialName,
    date: slot.date,
    timeString: slot.timeString,
    assignedExecutiveId: assignedExec.id,
    assignedExecutiveName: assignedExec.name,
    status: 'Booked',
    configurationWanted: configuration,
    locationPin: {
      lat: projectFact.location.coordinates.lat,
      lng: projectFact.location.coordinates.lng,
      address: projectFact.location.address,
      landmark: projectFact.location.nearbyLandmarks[0] || projectFact.location.locality,
      googleMapsUrl: `https://maps.google.com/?q=${projectFact.location.coordinates.lat},${projectFact.location.coordinates.lng}`,
    },
    reminders: {
      reminder24hScheduled: `${slot.date}T10:00:00Z`,
      reminder24hSent: false,
      reminder2hScheduled: `${slot.date}T09:00:00Z`,
      reminder2hSent: false,
    },
    bookedAt: new Date().toISOString(),
    notes: `Booked via PropEase AI Concierge. Assigned to ${assignedExec.name}.`,
  };

  return {
    toolResult: {
      toolName: 'confirm_site_visit',
      success: true,
      data: booking,
      userFacingMessage: `Your site visit for ${projectFact.commercialName} is officially confirmed for ${slot.date} at ${slot.timeString}! Your dedicated advisor ${assignedExec.name} will meet you at the site.`,
    },
    booking,
    updatedSlot: commitResult.updatedSlot,
  };
}

/**
 * Tool 4: escalate_to_executive
 * Escalates to a named sales executive when the user asks or when questions exceed the Fact Sheet.
 */
export function toolEscalateToExecutive(
  leadId: string,
  projectId: ProjectId,
  reason: string,
  summary: string
): AgentToolCallResult {
  const candidateExecs = SALES_EXECUTIVES.filter((e) => e.assignedProjects.includes(projectId));
  const assigned = candidateExecs.length > 0 ? candidateExecs[0] : SALES_EXECUTIVES[0];

  return {
    toolName: 'escalate_to_executive',
    success: true,
    data: {
      leadId,
      assignedExecutiveId: assigned.id,
      assignedExecutiveName: assigned.name,
      assignedPhone: assigned.phone,
      reason,
      summary,
    },
    userFacingMessage: `I have connected your inquiry directly to our Senior Sales Advisor, ${assigned.name}. They have received your chat context and will reach out promptly.`,
  };
}
