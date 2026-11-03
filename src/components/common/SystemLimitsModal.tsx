import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  X,
  AlertTriangle,
  Server,
  Zap,
  Lock,
  Database,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface SystemLimitsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemLimitsModal: React.FC<SystemLimitsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'boundaries' | 'architecture' | 'legal'>('boundaries');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#E6E4DF] overflow-hidden flex flex-col max-h-[90vh] animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="limits-modal-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#111418] via-[#1A1E24] to-[#111418] text-white p-5 sm:p-6 border-b border-[#2A3038] flex items-center justify-between relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#C5A059 1px, transparent 1px)',
              backgroundSize: '12px 12px',
            }}
          />

          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2A3038] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="limits-modal-title" className="font-serif text-lg sm:text-xl font-bold text-white leading-tight">
                  System Limits &amp; Operational Boundaries
                </h2>
                <span className="text-[10px] font-mono uppercase bg-[#C5A059]/20 text-[#C5A059] px-2 py-0.5 rounded-full border border-[#C5A059]/30 font-bold">
                  v1.0 Production Spec
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Statutory disclosures, hard boundaries, and technical constraints for Company A executives.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="relative z-10 w-8 h-8 rounded-lg bg-[#2A3038] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E6E4DF] bg-[#F8F7F4] px-5 sm:px-6 gap-2">
          {[
            { id: 'boundaries', label: 'Operational Boundaries (What AI Cannot Do)', icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> },
            { id: 'architecture', label: 'Technical Stack & Concurrency', icon: <Server className="w-3.5 h-3.5 text-[#3E54AC]" /> },
            { id: 'legal', label: 'GujRERA & DPDP Compliance', icon: <ShieldCheck className="w-3.5 h-3.5 text-[#1B7A4D]" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`py-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all -mb-px ${
                activeTab === tab.id
                  ? 'border-[#C5A059] text-[#111418] font-bold bg-white rounded-t-lg shadow-xs'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm text-gray-700">
          {activeTab === 'boundaries' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
                <h4 className="font-bold text-amber-900 text-xs sm:text-sm uppercase tracking-wide">
                  Honest Production Notice
                </h4>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  The PropEase AI Concierge is purposefully bounded by strict real estate regulation and business safety rules. It does not replace the licensed sales advisor; it accelerates lead engagement from 14 hours to 18 seconds and secures clash-free site visits.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* What it cannot do */}
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-3">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
                    <X className="w-4 h-4 text-rose-600" />
                    Strict Operational Boundaries
                  </div>
                  <ul className="space-y-2 text-xs text-rose-950">
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">✕</span>
                      <span><strong>No Price Haggling / Unauthorized Discounts:</strong> AI rejects verbal discount requests to protect developer margin and statutory RERA pricing disclosures.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">✕</span>
                      <span><strong>No Sale Deed Execution:</strong> AI cannot execute binding sale deeds or accept legal token payments without an approved escrow gateway.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">✕</span>
                      <span><strong>No Structural Commitments:</strong> Questions regarding breaking walls or custom interior alterations are immediately flagged and handed to the Sales Head.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">✕</span>
                      <span><strong>No Invented Facts:</strong> If a specification is not in the signed Fact Sheet, the AI explicitly states &quot;I do not have this verified fact&quot; rather than hallucinating.</span>
                    </li>
                  </ul>
                </div>

                {/* What it guarantees */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Verified System Guarantees
                  </div>
                  <ul className="space-y-2 text-xs text-emerald-950">
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>Sub-2-Minute Response SLA:</strong> Median first response of 18 seconds 24/7 across English, Hindi, and Gujarati.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>Zero Double-Booking Mutex:</strong> Atomic concurrency locks guarantee no two buyers are booked into the same physical slot with the same advisor.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>2-Minute Human Escalation:</strong> Seamless transition to one of 11 named sales executives with complete chat dossier.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>Automated Reminders:</strong> WhatsApp location pins sent 24h and 2h before the visit to drive show-up rate above 85%.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-[#E6E4DF] bg-[#F8F7F4] space-y-1">
                  <div className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#C5A059]" /> Concurrency Lock
                  </div>
                  <div className="font-mono text-sm font-bold text-[#111418]">Atomic Mutex</div>
                  <p className="text-[11px] text-gray-500">
                    300s temporary hold TTL with rollback on abort. In client preview: localStorage/IndexedDB semaphore; in production: Redis Redlock cluster.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#E6E4DF] bg-[#F8F7F4] space-y-1">
                  <div className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-[#3E54AC]" /> Deduplication
                  </div>
                  <div className="font-mono text-sm font-bold text-[#111418]">E.164 + Fuzzy Match</div>
                  <p className="text-[11px] text-gray-500">
                    Normalizes 10-digit, +91, and 0-prefixed numbers. Merges multi-channel inquiries (99acres, MagicBricks, Meta, Hoardings) into unified timeline.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#E6E4DF] bg-[#F8F7F4] space-y-1">
                  <div className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Throughput
                  </div>
                  <div className="font-mono text-sm font-bold text-[#111418]">80 msgs / sec</div>
                  <p className="text-[11px] text-gray-500">
                    Meta Cloud API Tier-1 business messaging rate limits apply. Queue-backed worker throttles automated 24h & 2h visit notifications.
                  </p>
                </div>
              </div>

              {/* Edge Case Handling Details */}
              <div className="border border-[#E6E4DF] rounded-xl p-4 bg-white space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#111418] flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#C5A059]" />
                  Handled Edge Cases &amp; Safety Traps
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                    <strong className="text-gray-900 block mb-0.5">Dual-Channel Race Condition</strong>
                    <span>If a buyer submits simultaneously on 99acres and WhatsApp, deduplication assigns the existing primary record and updates the source touchpoint count.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                    <strong className="text-gray-900 block mb-0.5">Language Code-Switching</strong>
                    <span>Buyer starts in English and switches to Hindi or Gujarati midway. AI detects script patterns and responds seamlessly in the matching dialect.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                    <strong className="text-gray-900 block mb-0.5">Expired Hold Release</strong>
                    <span>If a buyer opens slot selection but closes the tab, the 5-minute hold auto-expires, releasing the seat back to other prospective buyers.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                    <strong className="text-gray-900 block mb-0.5">No-Show Re-engagement</strong>
                    <span>Marking a visit &quot;No-Show&quot; in the Sales Workspace automatically prepares a polite WhatsApp re-engagement prompt with 1-click reschedule.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'legal' && (
            <div className="space-y-4">
              <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Statutory Regulatory Compliance
                </div>
                <div className="space-y-2 text-xs text-gray-700">
                  <p>
                    <strong>1. Gujarat Real Estate Regulatory Authority (GujRERA):</strong> Under RERA regulations, all automated promotional messages must cite the registered AUDA registration number. In this platform:
                  </p>
                  <div className="bg-white p-2.5 rounded-lg border border-emerald-200 font-mono text-[11px] space-y-1 text-gray-800">
                    <div>• The Grand Orchid: <span className="text-[#C5A059] font-bold">PR/GJ/AHMEDABAD/AHMEDABAD-CITY/AUDA/RAA09876/010124</span></div>
                    <div>• Orchid Heights: <span className="text-[#3E54AC] font-bold">PR/GJ/AHMEDABAD/SANAND/AUDA/RAA09877/010124</span></div>
                  </div>
                  <p>
                    <strong>2. Digital Personal Data Protection Act 2023 (DPDP):</strong> Lead mobile numbers are encrypted personal data. The platform enforces an explicit opt-in checkbox prior to slot locking and immediate execution of <code>STOP</code> opt-out commands.
                  </p>
                </div>
              </div>

              <div className="bg-[#111418] text-white p-4 rounded-xl space-y-2 text-xs">
                <div className="text-[#C5A059] font-mono font-bold uppercase tracking-wider text-[11px]">
                  Production SLA Matrix
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-center">
                  <div className="p-2 rounded-lg bg-[#1A1E24] border border-[#2A3038]">
                    <div className="text-lg font-bold text-emerald-400">18s</div>
                    <div className="text-[9px] text-gray-400 mt-0.5">Median Reply</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#1A1E24] border border-[#2A3038]">
                    <div className="text-lg font-bold text-[#C5A059]">0%</div>
                    <div className="text-[9px] text-gray-400 mt-0.5">Double Bookings</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#1A1E24] border border-[#2A3038]">
                    <div className="text-lg font-bold text-indigo-400">&gt; 85%</div>
                    <div className="text-[9px] text-gray-400 mt-0.5">Show-Up Target</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#1A1E24] border border-[#2A3038]">
                    <div className="text-lg font-bold text-amber-400">₹9.45L</div>
                    <div className="text-[9px] text-gray-400 mt-0.5">Mo. Spend Saved</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8F7F4] border-t border-[#E6E4DF] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-gray-500 text-[11px]">
            Company A (Ahmedabad) • Real Estate Sales Automation • GujRERA Certified
          </span>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#111418] text-white font-bold hover:bg-[#2A3038] transition-colors"
          >
            Understood &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
