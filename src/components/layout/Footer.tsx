import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Lock,
  Copy,
  Check,
  Zap,
  Clock,
  ArrowUp,
  FileText,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { AppView } from './Header';
import { MASTER_FACT_SHEET } from '../../data/factSheetData';

interface FooterProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onOpenStressTest?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onViewChange,
  onOpenStressTest,
}) => {
  const [copiedRera, setCopiedRera] = useState<string | null>(null);

  const handleCopyRera = (reraNumber: string) => {
    navigator.clipboard.writeText(reraNumber).then(() => {
      setCopiedRera(reraNumber);
      setTimeout(() => setCopiedRera(null), 2000);
    });
  };

  const project1 = MASTER_FACT_SHEET['Project 1'];
  const project2 = MASTER_FACT_SHEET['Project 2'];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#0E1116] text-gray-400 border-t border-[#222831] text-xs mt-auto overflow-hidden">
      {/* Top subtle champagne bronze divider */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Streamlined 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 pb-8 border-b border-[#1E242E]">

          {/* Column 1: Company A & Ahmedabad Developer Profile */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#161B22] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shadow-md flex-shrink-0">
                <span className="shimmer-text font-serif font-bold text-lg leading-none">A</span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-white tracking-tight leading-snug">
                  Company A
                </h3>
                <p className="text-[10px] text-[#C5A059] font-mono tracking-widest uppercase font-semibold">
                  Residential Developer · Ahmedabad
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Leading Ahmedabad residential developer. 420 luxury apartments across 2 projects (2 &amp; 3 BHK, ₹65L – ₹1.2 Cr). Annual bookings ₹180–₹220 Crore.
            </p>

            {/* Ahmedabad Sales Desk & Contact Details */}
            <div className="space-y-2 pt-1 text-[11px] text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>S.G. Highway, Bodakdev, Ahmedabad — 380054</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Sales Desk &amp; Hoarding Helpline: +91 98250 12345</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <Mail className="w-3.5 h-3.5 text-[#3E54AC] shrink-0" />
                <span>concierge@companya.in</span>
              </div>
            </div>
          </div>

          {/* Column 2: GujRERA Registered Projects */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#C5A059]" />
              <h4 className="font-serif font-bold text-sm text-white tracking-wide">
                GujRERA Certified Projects
              </h4>
            </div>

            <p className="text-[11px] text-gray-500">
              Registered under the Real Estate (Regulation and Development) Act 2016. Promotional claims strictly limited to sanctioned AUDA approvals.
            </p>

            <div className="space-y-2">
              {/* Project 1 */}
              <div className="p-2.5 rounded-xl bg-[#14181F] border border-[#222831] flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <strong className="text-white text-xs truncate">{project1.commercialName}</strong>
                    <span className="text-[9px] text-[#C5A059] bg-[#C5A059]/10 px-1.5 py-0.2 rounded-sm font-mono shrink-0">
                      3 BHK
                    </span>
                  </div>
                  <code className="text-[10px] text-gray-400 font-mono block truncate mt-0.5">
                    {project1.reraNumber}
                  </code>
                </div>
                <button
                  onClick={() => handleCopyRera(project1.reraNumber)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-[#C5A059] hover:bg-white/5 transition-colors shrink-0"
                  title="Copy RERA Number"
                  aria-label="Copy Project 1 RERA Number"
                >
                  {copiedRera === project1.reraNumber ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Project 2 */}
              <div className="p-2.5 rounded-xl bg-[#14181F] border border-[#222831] flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <strong className="text-white text-xs truncate">{project2.commercialName}</strong>
                    <span className="text-[9px] text-[#3E54AC] bg-[#3E54AC]/10 px-1.5 py-0.2 rounded-sm font-mono shrink-0">
                      2 &amp; 3 BHK
                    </span>
                  </div>
                  <code className="text-[10px] text-gray-400 font-mono block truncate mt-0.5">
                    {project2.reraNumber}
                  </code>
                </div>
                <button
                  onClick={() => handleCopyRera(project2.reraNumber)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-[#C5A059] hover:bg-white/5 transition-colors shrink-0"
                  title="Copy RERA Number"
                  aria-label="Copy Project 2 RERA Number"
                >
                  {copiedRera === project2.reraNumber ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Direct CMS link */}
            <button
              onClick={() => {
                onViewChange('factsheet-cms');
                scrollToTop();
              }}
              className="text-[11px] text-[#C5A059] hover:underline flex items-center gap-1 font-semibold pt-0.5"
            >
              <FileText className="w-3 h-3" />
              <span>View Published Fact Sheet &amp; Limits CMS →</span>
            </button>
          </div>

          {/* Column 3: Operational SLA & Statutory DPDP Governance */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="font-serif font-bold text-sm text-white tracking-wide">
                Operational SLA &amp; Privacy
              </h4>
            </div>

            {/* SLA KPI Pill */}
            <div className="p-2.5 bg-[#14181F] rounded-xl border border-[#222831] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" /> Response Benchmark
                </span>
                <span className="font-mono text-xs font-bold text-emerald-400">18s (SLA &lt; 2m ✓)</span>
              </div>
              <p className="text-[10px] text-gray-500">
                Reduced cold lead drop-off from 35% down to 2.8%, rescuing ₹9.45 Lakh/mo of ad spend.
              </p>
            </div>

            {/* Statutory Privacy & Concurrency */}
            <div className="space-y-1.5 text-[11px] text-gray-400 leading-relaxed">
              <div className="flex items-start gap-1.5">
                <Lock className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-gray-300">DPDP Act 2023:</strong> Contact only with explicit consent. Replying <code className="text-[#C5A059] font-mono">STOP</code> suspends messaging immediately.
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <Zap className="w-3 h-3 text-[#C5A059] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-gray-300">Two-Phase Mutex:</strong> Atomic 180s slot lock prevents double booking.
                </span>
              </div>
            </div>

            {/* Concurrency test button */}
            {onOpenStressTest && (
              <button
                onClick={onOpenStressTest}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#14181F] hover:bg-[#1C222C] text-[#C5A059] border border-[#C5A059]/30 text-[11px] font-bold transition-all shadow-xs hover:scale-[1.01] active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Run 5-Buyer Concurrency Stress Test</span>
              </button>
            )}
          </div>

        </div>

        {/* Bottom Sub-Footer: Clean & Minimal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
          <div className="flex items-center gap-2 flex-wrap text-center sm:text-left">
            <span>© 2026 Company A (Ahmedabad). All rights reserved.</span>
            <span className="hidden sm:inline">·</span>
            <span>Software Engineering Prototype authored by <strong>Aditya Raj</strong>.</span>
          </div>

          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-gray-400">GujRERA Reg: RAA09876 &amp; RAA09877</span>
            <span>·</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              DPDP Act 2023 Compliant
            </span>
            <span>·</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
              title="Back to top"
              aria-label="Scroll back to top"
            >
              <span>Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
