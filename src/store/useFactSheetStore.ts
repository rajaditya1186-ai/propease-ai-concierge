import { useState, useEffect } from 'react';
import { ProjectFactSheet } from '../types/factSheet';
import { ProjectId } from '../types/booking';
import { MASTER_FACT_SHEET } from '../data/factSheetData';

const FACT_SHEET_KEY = 'propease_factsheet_v1';

function getStoredFactSheet(): Record<ProjectId, ProjectFactSheet> {
  try {
    const raw = localStorage.getItem(FACT_SHEET_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback
  }
  return MASTER_FACT_SHEET;
}

export function useFactSheetStore() {
  const [factSheets, setFactSheets] = useState<Record<ProjectId, ProjectFactSheet>>(getStoredFactSheet);
  const [activeProject, setActiveProject] = useState<ProjectId>('Project 1');

  useEffect(() => {
    localStorage.setItem(FACT_SHEET_KEY, JSON.stringify(factSheets));
  }, [factSheets]);

  /**
   * Updates project details (prices, amenities, RERA, possession).
   */
  const updateProjectFactSheet = (projectId: ProjectId, updates: Partial<ProjectFactSheet>) => {
    setFactSheets((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        ...updates,
      },
    }));
  };

  /**
   * Resets fact sheet to initial master data.
   */
  const resetFactSheet = () => {
    setFactSheets(MASTER_FACT_SHEET);
    localStorage.removeItem(FACT_SHEET_KEY);
  };

  return {
    factSheets,
    activeFactSheet: factSheets[activeProject],
    activeProject,
    setActiveProject,
    updateProjectFactSheet,
    resetFactSheet,
  };
}
