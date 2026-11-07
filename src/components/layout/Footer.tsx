import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Lock,
  Copy,
  Check,
  Zap,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { AppView } from './Header';
import { MASTER_FACT_SHEET } from '../../data/factSheetData';

interface FooterProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onOpenStressTest?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentView,
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

  return (
    <footer className="relative bg-[#0D1014] text-gray-400 border-t border-[#222831] text-xs mt-auto overflow-hidden">
      {/* Top subtle bronze accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C5A059]/60 to-transparent" />

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* Column 1: Brand & Enterprise Profile */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1A1E24] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shadow-lg">
                <span className="shimmer-text font-serif font-bold text-lg">A</span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-white leading-tight">
                  Company A
                </h3>
                <p className="text-[11px] text-[#C5A059] font-medium tracking-wider uppercase font-mono">
                  Ahmedabad Developer
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Premium residential developer with 2 active projects (420 apartments, 2 &amp; 3 BHK, ₹65L – ₹1.2 Cr). Annual bookings ₹180–₹220 Crore.
            </p>

            <div className="space-y-1.5 pt-1 text-[11px] text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>60 staff including 11 in sales advisory</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                <span>PropEase 24/7 AI Concierge Engine</span>
              </div>
            </div>

            {/* Live SLA Badge */}
            <div className="p-3 bg-[#14181F] rounded-xl border border-[#222831] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-semibold text-gray-300">Median Response</span>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-400">
                18s <span className="text-[10px] text-gray-500 font-normal">(SLA &lt; 2m ✓)</span>
              </span>
            </div>
          </div>

          {/* Column 2: GujRERA Certified Projects */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#C5A059]" />
              <h4 className="font-serif font-bold text-sm text-white">
                Active Projects &amp; RERA
              </h4>
            </div>

            <p className="text-[11px] text-gray-500">
              Sanctioned under the Real Estate (Regulation and Development) Act 2016.
            </p>

            {/* Project 1 Card */}
            <div className="p-3 rounded-xl bg-[#14181F] border border-[#222831] space-y-1.5">
              <div className="flex items-center justify-between">
                <strong className="text-white text-xs">{project1.commercialName}</strong>
                <span className="text-[9px] font-mono text-[#C5A059] bg-[#C5A059]/10 px-1.5 py-0.5 rounded-md">
                  3 BHK Luxury
                </span>
              </div>
              <p className="text-[11px] text-gray-400">S.G. Highway · Vaishnodevi Circle (₹95L – ₹1.2Cr)</p>
              <div className="flex items-center justify-between pt-1 border-t border-gray-800/80">
                <code className="text-[10px] font-mono text-gray-400 truncate max-w-[190px]" title={project1.reraNumber}>
                  {project1.reraNumber}
                </code>
                <button
                  onClick={() => handleCopyRera(project1.reraNumber)}
                  className="text-gray-400 hover:text-[#C5A059] transition-colors p-1"
                  title="Copy RERA Number"
                  aria-label="Copy Project 1 RERA Number"
                >
                  {copiedRera === project1.reraNumber ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Project 2 Card */}
            <div className="p-3 rounded-xl bg-[#14181F] border border-[#222831] space-y-1.5">
              <div className="flex items-center justify-between">
                <strong className="text-white text-xs">{project2.commercialName}</strong>
                <span className="text-[9px] font-mono text-[#3E54AC] bg-[#3E54AC]/10 px-1.5 py-0.5 rounded-md">
                  2 &amp; 3 BHK
                </span>
              </div>
              <p className="text-[11px] text-gray-400">Club O7 Road · Shela (₹65L – ₹88L)</p>
              <div className="flex items-center justify-between pt-1 border-t border-gray-800/80">
                <code className="text-[10px] font-mono text-gray-400 truncate max-w-[190px]" title={project2.reraNumber}>
                  {project2.reraNumber}
                </code>
                <button
                  onClick={() => handleCopyRera(project2.reraNumber)}
                  className="text-gray-400 hover:text-[#C5A059] transition-colors p-1"
                  title="Copy RERA Number"
                  aria-label="Copy Project 2 RERA Number"
                >
                  {copiedRera === project2.reraNumber ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Column 3: Platform Navigation Shortcuts */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-sm text-white">
              Platform Workspaces
            </h4>

            <ul className="space-y-2 text-xs">
              {[
                { view: 'buyer-chat' as AppView, label: 'Buyer AI Concierge', sub: 'Trilingual Chat & Passcard' },
                { view: 'lead-hub' as AppView, label: 'Unified Lead Hub', sub: 'Deduplication & Timeline' },
                { view: 'sales-workspace' as AppView, label: 'Sales Staff Cockpit', sub: '11 Named Advisors & Dossiers' },
                { view: 'executive-dashboard' as AppView, label: 'Director ROI Dashboard', sub: 'Attribution & Payback Sandbox' },
                { view: 'factsheet-cms' as AppView, label: 'Fact Sheet & Limits CMS', sub: 'RERA Knowledge & Slot Admin' },
                { view: 'whatsapp-simulator' as AppView, label: 'WhatsApp Simulator', sub: 'DPDP Opt-In/Opt-Out Test' },
              ].map((item) => (
                <li key={item.view}>
                  <button
                    onClick={() => {
                      onViewChange(item.view);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full text-left flex items-center justify-between py-1 transition-colors group ${
                      currentView === item.view ? 'text-[#C5A059] font-bold' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <div>
                      <span>{item.label}</span>
                      <span className="block text-[10px] text-gray-500 group-hover:text-gray-400">{item.sub}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Compliance & Limits Disclosure */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="font-serif font-bold text-sm text-white">
                Statutory Governance
              </h4>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-start gap-2 text-[11px] text-gray-400 leading-relaxed">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">DPDP Act 2023:</strong> Buyer phone numbers are personal data. Automated messaging operates solely on affirmative opt-in; replying <code className="text-[#C5A059]">STOP</code> halts communications immediately.
                </span>
              </div>

              <div className="flex items-start gap-2 text-[11px] text-gray-400 leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">GujRERA Non-Negotiation:</strong> Section 11(4) strictly prohibits unrecorded discounts or off-book verbal price claims over chat.
                </span>
              </div>

              <div className="flex items-start gap-2 text-[11px] text-gray-400 leading-relaxed">
                <Zap className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Zero Double-Booking:</strong> Two-Phase Optimistic Mutex lock guarantees that parallel visits cannot collide.
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  onViewChange('factsheet-cms');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#14181F] hover:bg-[#1A202A] text-gray-300 hover:text-white border border-[#222831] text-[11px] font-semibold transition-all group"
              >
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Platform Limits &amp; Boundaries</span>
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />
              </button>

              {onOpenStressTest && (
                <button
                  onClick={onOpenStressTest}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#14181F] hover:bg-[#1A202A] text-[#C5A059] border border-[#C5A059]/30 text-[11px] font-bold transition-all group"
                >
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Run Concurrency Stress Test</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#C5A059] group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance Notes */}
        <div className="mt-10 pt-6 border-t border-[#1C222B] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <div className="flex items-center gap-2 flex-wrap text-center sm:text-left">
            <span>© 2026 Company A (Ahmedabad). All rights reserved.</span>
            <span className="hidden sm:inline">·</span>
            <span>Software Engineering Prototype authored by <strong>Aditya Raj</strong>.</span>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-gray-400">
            <span className="hover:text-gray-300 transition-colors">
              RERA Reg: PR/GJ/.../RAA09876 &amp; RAA09877
            </span>
            <span>·</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              DPDP Act 2023 Compliant
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
