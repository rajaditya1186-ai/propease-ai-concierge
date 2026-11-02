import { Lead, LeadSource, LeadTouchpoint } from '../types/lead';

/**
 * Normalizes phone numbers to standard E.164 format for India (+91XXXXXXXXXX).
 * Handles numbers with leading 0, with or without +91, with spaces, hyphens or brackets.
 */
export function normalizePhoneNumber(rawPhone: string): string {
  if (!rawPhone) return '';
  // Remove all non-digit characters
  const digits = rawPhone.replace(/\D/g, '');

  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return `+91${digits.slice(1)}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  if (digits.startsWith('91') && digits.length > 10) {
    return `+${digits}`;
  }
  return `+${digits}`;
}

/**
 * Normalizes email address (lowercase and trimmed).
 */
export function normalizeEmail(rawEmail?: string): string {
  if (!rawEmail) return '';
  return rawEmail.trim().toLowerCase();
}

export interface DuplicateDetectionResult {
  isDuplicate: boolean;
  matchedLead?: Lead;
  matchType?: 'phone' | 'email' | 'both';
}

/**
 * Checks if an incoming inquiry is a duplicate of any existing lead.
 */
export function detectDuplicateLead(
  newPhone: string,
  newEmail: string | undefined,
  existingLeads: Lead[]
): DuplicateDetectionResult {
  const normalizedPhone = normalizePhoneNumber(newPhone);
  const normalizedEmail = normalizeEmail(newEmail);

  for (const lead of existingLeads) {
    const existingPhone = normalizePhoneNumber(lead.phone);
    const existingEmail = normalizeEmail(lead.email);

    const phoneMatch = Boolean(normalizedPhone && existingPhone === normalizedPhone);
    const emailMatch = Boolean(normalizedEmail && existingEmail && existingEmail === normalizedEmail);

    if (phoneMatch && emailMatch) {
      return { isDuplicate: true, matchedLead: lead, matchType: 'both' };
    }
    if (phoneMatch) {
      return { isDuplicate: true, matchedLead: lead, matchType: 'phone' };
    }
    if (emailMatch) {
      return { isDuplicate: true, matchedLead: lead, matchType: 'email' };
    }
  }

  return { isDuplicate: false };
}

/**
 * Merges an incoming touchpoint into an existing lead without creating duplicate records.
 */
export function mergeDuplicateTouchpoint(
  targetLead: Lead,
  incomingSource: LeadSource,
  campaignDetails?: string
): Lead {
  const newTouchpoint: LeadTouchpoint = {
    source: incomingSource,
    timestamp: new Date().toISOString(),
    campaign: campaignDetails || `${incomingSource} Inbound Touchpoint`,
  };

  const updatedTouchpoints = [...targetLead.touchpoints, newTouchpoint];

  return {
    ...targetLead,
    isDuplicate: true,
    touchpoints: updatedTouchpoints,
    updatedAt: new Date().toISOString(),
    notes: targetLead.notes
      ? `${targetLead.notes} | New touchpoint from ${incomingSource}`
      : `Touchpoint recorded from ${incomingSource}`,
  };
}
