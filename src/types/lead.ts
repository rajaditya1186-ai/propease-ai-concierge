export type LeadSource = 'Property portal' | 'Social media ad' | 'Website' | 'Hoarding call';

export type LeadStatus =
  | 'New'
  | 'In Conversation'
  | 'Site Visit Booked'
  | 'Visited'
  | 'No-Show'
  | 'Cold'
  | 'Unresponsive';

export type ProjectInterest = 'Project 1' | 'Project 2' | 'Both';

export type BHKPreference = '2 BHK' | '3 BHK' | 'Unspecified';

export type LanguageCode = 'en' | 'hi' | 'gu';

export interface LeadTouchpoint {
  source: LeadSource;
  timestamp: string;
  campaign?: string;
  channelDetails?: string;
}

export interface Lead {
  id: string; // e.g. "LD-58210"
  name: string; // e.g. "Hardik Patel"
  phone: string; // Normalized E.164 (+91...)
  email?: string;
  source: LeadSource;
  projectInterest: ProjectInterest;
  configurationWanted: BHKPreference;
  budgetRange?: string; // e.g. "₹95L - ₹1.2Cr"
  preferredLanguage: LanguageCode;
  status: LeadStatus;
  firstResponseTimeSeconds?: number;
  assignedExecutiveId?: string;
  assignedExecutiveName?: string;
  isDuplicate: boolean;
  duplicateOfId?: string;
  touchpoints: LeadTouchpoint[];
  dpdpConsentGiven: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
