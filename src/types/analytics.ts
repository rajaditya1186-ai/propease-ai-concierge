import { LeadSource } from './lead';

export interface ChannelPerformance {
  source: LeadSource;
  monthlySpendINR: number;
  totalLeads: number;
  costPerLeadINR: number;
  validLeads: number;
  duplicateCount: number;
  visitsBooked: number;
  visitsCompleted: number;
  showUpRatePercent: number;
  costPerCompletedVisitINR: number;
  leadsUncontacted48h: number;
  uncontactedRatePercent: number;
}

export interface ExecutiveKpiSummary {
  totalMonthlyLeads: number;
  totalMonthlySpendINR: number;
  averageResponseTimeSeconds: number; // Target < 120s (historical 14h)
  uncontactedLeadsCount: number; // Target < 5% (historical 35%)
  uncontactedRatePercent: number;
  monthlyRevenueSavedINR: number; // Rescued lead spend
  totalSiteVisitsBooked: number;
  totalSiteVisitsCompleted: number;
  overallLeadToVisitRate: number; // Target >= 8% (historical 6%)
  overallShowUpRate: number;
  channels: ChannelPerformance[];
}
