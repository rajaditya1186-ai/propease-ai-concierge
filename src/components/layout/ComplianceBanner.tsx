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
    <div className="bg-[#111418] text-[#E6E4DF] border-b border-[#2A3038] py-2 shadow-sm text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Left: GujRERA Registration */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-[#C5A059]">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span className="font-semibold text-white tracking-wide text-xs">GujRERA Reg. No:</span>
          </div>
          <span className="font-mono bg-[#1A1E24] px-2.5 py-0.5 rounded-md text-[#C5A059] border border-[#C5A059]/30 text-xs font-semibold select-all">
            {fact.reraNumber}
          </span>
          <span className="text-gray-400 text-xs hidden md:inline">
            • <strong className="text-gray-200">{fact.commercialName}</strong> ({fact.location.locality})
          </span>
        </div>

        {/* Right: DPDP Act 2023 Consent & Opt-Out Notice */}
        <div className="flex items-center gap-2 text-gray-300 text-[11px] sm:text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></div>
          <Lock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span className="text-gray-300">
            <strong className="text-emerald-300">DPDP Act 2023 Compliant</strong> • Explicit Consent Prior to Contact • Instant Opt-Out
          </span>
        </div>
      </div>
    </div>
  );
};

