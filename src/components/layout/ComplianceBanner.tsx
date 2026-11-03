import React, { useState } from 'react';
import { ShieldCheck, Lock, Copy, Check } from 'lucide-react';
import { ProjectId } from '../../types/booking';
import { MASTER_FACT_SHEET } from '../../data/factSheetData';

interface ComplianceBannerProps {
  currentProject: ProjectId;
}

export const ComplianceBanner: React.FC<ComplianceBannerProps> = ({ currentProject }) => {
  const fact = MASTER_FACT_SHEET[currentProject];
  const [copied, setCopied] = useState(false);

  const handleCopyRera = () => {
    navigator.clipboard.writeText(fact.reraNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-[#111418] text-[#E6E4DF] border-b border-[#2A3038] py-1.5 shadow-sm text-xs overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2">

        {/* Left: GujRERA Registration with copy button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            {/* Verified shield with green glow */}
            <span className="relative flex-shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            </span>
            <span className="font-semibold text-white tracking-wide text-xs">GujRERA Reg:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <code className="font-mono bg-[#1A1E24] px-2 py-0.5 rounded-md text-[#C5A059] border border-[#C5A059]/30 text-xs font-semibold select-all tracking-tight">
              {fact.reraNumber}
            </code>
            {/* Copy to clipboard button */}
            <button
              onClick={handleCopyRera}
              className="flex items-center gap-1 text-gray-500 hover:text-[#C5A059] transition-colors group relative"
              title="Copy RERA number"
              aria-label="Copy RERA registration number"
            >
              {copied ? (
                <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-semibold animate-fade-up">
                  <Check className="w-3 h-3" />
                  Copied!
                </span>
              ) : (
                <Copy className="w-3 h-3 group-hover:scale-110 transition-transform" />
              )}
            </button>
          </div>

          <span className="text-gray-400 text-xs hidden md:inline">
            · <strong className="text-gray-200">{fact.commercialName}</strong> ({fact.location.locality})
          </span>
        </div>

        {/* Right: DPDP Compliance — marquee on mobile */}
        <div className="flex items-center gap-2 text-gray-300 text-[11px] sm:text-xs overflow-hidden">
          <Lock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          {/* Marquee effect on very small screens, static on larger */}
          <span className="hidden sm:inline">
            <strong className="text-emerald-300">DPDP Act 2023</strong> · Explicit Consent · Instant Opt-Out
          </span>
          <span className="sm:hidden whitespace-nowrap overflow-hidden">
            <span className="inline-block" style={{ animation: 'marquee 14s linear infinite' }}>
              DPDP Act 2023 Compliant · Explicit Consent Required · Instant Opt-Out Honoured &nbsp;&nbsp;&nbsp;
            </span>
          </span>
          <span
            className="bg-emerald-900/50 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-800/60 flex-shrink-0 hidden sm:flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            LIVE
          </span>
        </div>
      </div>

      {/* Inline keyframe for mobile marquee (no extra CSS file needed) */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
