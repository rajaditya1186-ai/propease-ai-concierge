import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { ProjectId } from '../../types/booking';
import { MASTER_FACT_SHEET } from '../../data/factSheetData';

interface ComplianceBannerProps {
  currentProject: ProjectId;
}

export const ComplianceBanner: React.FC<ComplianceBannerProps> = ({ currentProject }) => {
  const fact = MASTER_FACT_SHEET[currentProject];

  return (
    <div className="bg-[#111418] text-[#E6E4DF] border-b border-[#2A3038] px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-sm">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
        <span className="font-medium text-white tracking-wide">GujRERA Reg. No:</span>
        <span className="font-mono bg-[#1A1E24] px-2 py-0.5 rounded text-[#C5A059] border border-[#C5A059]/30">
          {fact.reraNumber}
        </span>
        <span className="text-gray-400 hidden sm:inline">| {fact.commercialName} ({fact.location.locality})</span>
      </div>

      <div className="flex items-center gap-2 text-gray-300">
        <Lock className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-[11px]">
          DPDP Act 2023 Compliant • Explicit Consent Prior to Contact • Instant Opt-Out
        </span>
      </div>
    </div>
  );
};
