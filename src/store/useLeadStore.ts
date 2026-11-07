import { useState, useEffect, useMemo } from 'react';
import { Lead, LeadSource, LeadStatus } from '../types/lead';
import { INITIAL_LEADS } from '../data/seedData';
import { detectDuplicateLead, mergeDuplicateTouchpoint, normalizePhoneNumber } from '../services/deduplicationEngine';

// Local storage key for persistent state
const STORAGE_KEY = 'propease_leads_v1';

function getStoredLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback to initial seeds
  }
  return INITIAL_LEADS;
}

export function useLeadStore() {
  const [leads, setLeads] = useState<Lead[]>(getStoredLeads);
  const [selectedSource, setSelectedSource] = useState<LeadSource | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }, [leads]);

  /**
   * Ingests a new lead from any channel, automatically checking for duplicates.
   */
  const ingestLead = (
    name: string,
    phone: string,
    source: LeadSource,
    projectInterest: 'Project 1' | 'Project 2' | 'Both',
    configurationWanted: '2 BHK' | '3 BHK' | 'Unspecified',
    email?: string,
    notes?: string
  ): { lead: Lead; isNewRecord: boolean } => {
    const dupCheck = detectDuplicateLead(phone, email, leads);

    if (dupCheck.isDuplicate && dupCheck.matchedLead) {
      // Merge touchpoint into existing lead
      const merged = mergeDuplicateTouchpoint(dupCheck.matchedLead, source, notes);
      setLeads((prev) => prev.map((l) => (l.id === merged.id ? merged : l)));
      return { lead: merged, isNewRecord: false };
    }

    // Create new primary lead
    const newId = `LD-${Math.floor(58231 + Math.random() * 1000)}`;
    const newLead: Lead = {
      id: newId,
      name,
      phone: normalizePhoneNumber(phone),
      email,
      source,
      projectInterest,
      configurationWanted,
      preferredLanguage: 'en',
      status: 'New',
      firstResponseTimeSeconds: 16, // Under 2 mins SLA
      isDuplicate: false,
      touchpoints: [
        {
          source,
          timestamp: new Date().toISOString(),
          campaign: `${source} Direct Inbound`,
        },
      ],
      dpdpConsentGiven: true,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLeads((prev) => [newLead, ...prev]);
    return { lead: newLead, isNewRecord: true };
  };

  /**
   * Updates an existing lead's status.
   */
  const updateLeadStatus = (leadId: string, status: LeadStatus, executiveName?: string) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              status,
              assignedExecutiveName: executiveName || l.assignedExecutiveName,
              updatedAt: new Date().toISOString(),
            }
          : l
      )
    );
  };

  /**
   * Merges two leads manually from the Deduplication Modal.
   */
  const manualMergeLeads = (primaryLeadId: string, secondaryLeadId: string) => {
    const primary = leads.find((l) => l.id === primaryLeadId);
    const secondary = leads.find((l) => l.id === secondaryLeadId);
    if (!primary || !secondary) return;

    const mergedTouchpoints = [...primary.touchpoints, ...secondary.touchpoints];
    const updatedPrimary: Lead = {
      ...primary,
      isDuplicate: true,
      touchpoints: mergedTouchpoints,
      notes: `${primary.notes || ''} | Merged with ${secondary.id} (${secondary.source})`,
      updatedAt: new Date().toISOString(),
    };

    setLeads((prev) => prev.filter((l) => l.id !== secondaryLeadId).map((l) => (l.id === primary.id ? updatedPrimary : l)));
  };

  /**
   * Resets leads to the original seed data.
   */
  const resetToSeeds = () => {
    setLeads(INITIAL_LEADS);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Memoized filtered view for high search/filter rendering efficiency
  const filteredLeads = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return leads.filter((lead) => {
      const matchesSource = selectedSource === 'All' || lead.source === selectedSource;
      const matchesStatus = selectedStatus === 'All' || lead.status === selectedStatus;
      if (!matchesSource || !matchesStatus) return false;
      if (!q) return true;
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        lead.id.toLowerCase().includes(q) ||
        lead.configurationWanted.toLowerCase().includes(q)
      );
    });
  }, [leads, selectedSource, selectedStatus, searchQuery]);

  return {
    leads,
    filteredLeads,
    selectedSource,
    setSelectedSource,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    ingestLead,
    updateLeadStatus,
    manualMergeLeads,
    resetToSeeds,
  };
}
