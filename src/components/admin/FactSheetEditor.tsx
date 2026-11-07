import React, { useState } from 'react';
import {
  Save,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Trash2,
  Lock,
  ShieldAlert,
  Cpu,
  FileText,
  Zap,
} from 'lucide-react';
import { ProjectId } from '../../types/booking';
import { ProjectFactSheet } from '../../types/factSheet';
import { useFactSheetStore } from '../../store/useFactSheetStore';
import { FlaggedChatAudit } from './FlaggedChatAudit';
import { useBookingStore } from '../../store/useBookingStore';

export const FactSheetEditor: React.FC = () => {
  const { factSheets, activeProject, setActiveProject, updateProjectFactSheet } =
    useFactSheetStore();

  const currentFact = factSheets[activeProject];
  const { slots, removeSlot, blockSlot } = useBookingStore();

  // Local editing copy
  const [formData, setFormData] = useState<ProjectFactSheet>(currentFact);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'factsheet' | 'slot-manager' | 'flagged-audit' | 'system-limits'
  >('factsheet');

  // Sync if project changes
  const handleProjectSelect = (proj: ProjectId) => {
    setActiveProject(proj);
    setFormData(factSheets[proj]);
    setSaveSuccess(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProjectFactSheet(activeProject, formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#E6E4DF] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#C5A059] font-mono text-xs uppercase tracking-wider font-bold">
              Sales Head CMS &amp; Governance
            </span>
            <span className="bg-emerald-50 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
              Live AI Knowledge Base
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#111418] mt-1">
            Master Property Fact Sheet &amp; Audit Editor
          </h2>
          <p className="text-xs text-gray-500">
            Updates here reflect instantly in the AI Concierge&apos;s answers. Governed strictly under GujRERA.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('factsheet')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'factsheet'
                ? 'bg-[#111418] text-white shadow-xs'
                : 'bg-[#F8F7F4] text-gray-700 hover:bg-[#E6E4DF]'
            }`}
          >
            Fact Sheet CMS
          </button>

          <button
            onClick={() => setActiveTab('slot-manager')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'slot-manager'
                ? 'bg-[#111418] text-white shadow-xs'
                : 'bg-[#F8F7F4] text-gray-700 hover:bg-[#E6E4DF]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
            Slot Manager
          </button>

          <button
            onClick={() => setActiveTab('flagged-audit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'flagged-audit'
                ? 'bg-[#111418] text-white shadow-xs'
                : 'bg-[#F8F7F4] text-gray-700 hover:bg-[#E6E4DF]'
            }`}
          >
            Daily Audit
          </button>

          <button
            onClick={() => setActiveTab('system-limits')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'system-limits'
                ? 'bg-[#111418] text-[#C5A059] shadow-xs border border-[#C5A059]/40'
                : 'bg-[#F8F7F4] text-gray-700 hover:bg-[#E6E4DF]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Platform Limits</span>
          </button>
        </div>
      </div>

      {activeTab === 'flagged-audit' ? (
        <FlaggedChatAudit />
      ) : activeTab === 'slot-manager' ? (
        <div className="space-y-4">
          <div className="bg-[#FBF7EE] border border-[#C5A059]/40 p-4 rounded-2xl flex items-start gap-3">
            <Calendar className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-[#735722] uppercase tracking-wider">
                Visit Slot Calendar Manager
              </h4>
              <p className="text-xs text-[#523E17] leading-relaxed mt-0.5">
                All available visit slots for both projects. Slots with 2/2 confirmed bookings are full. Block a slot to prevent new bookings (e.g., for maintenance or holidays).
              </p>
            </div>
          </div>

          {(['Project 1', 'Project 2'] as const).map((proj) => {
            const projSlots = slots.filter((s) => s.projectId === proj);
            const projFact = factSheets[proj];
            return (
              <div key={proj} className="bg-white rounded-2xl border border-[#E6E4DF] shadow-sm overflow-hidden">
                <div className="bg-[#F8F7F4] px-5 py-3 border-b border-[#E6E4DF] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#111418] text-sm">{projFact.commercialName}</span>
                    <span className="text-xs text-gray-500 ml-2 font-mono">{projFact.reraNumber}</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-600">{projSlots.length} slots</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#F8F7F4] text-[10px] uppercase tracking-wider font-bold text-gray-600 border-b border-[#E6E4DF]">
                      <tr>
                        <th className="px-4 py-2.5">Date</th>
                        <th className="px-4 py-2.5">Time</th>
                        <th className="px-4 py-2.5">Capacity</th>
                        <th className="px-4 py-2.5">Status</th>
                        <th className="px-4 py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6E4DF]">
                      {projSlots.slice(0, 14).map((slot) => {
                        const isFull = slot.confirmedCount >= slot.maxCapacity;
                        const isBlocked = slot.isBlocked;
                        return (
                          <tr key={slot.slotId} className={`hover:bg-gray-50/60 transition-colors ${isBlocked ? 'opacity-50' : ''}`}>
                            <td className="px-4 py-2.5 font-mono font-semibold text-[#111418]">{slot.date}</td>
                            <td className="px-4 py-2.5 font-mono">{slot.timeString}</td>
                            <td className="px-4 py-2.5">
                              <span className={`font-mono font-bold ${isFull ? 'text-rose-600' : 'text-emerald-700'}`}>
                                {slot.confirmedCount}/{slot.maxCapacity}
                              </span>
                              <div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${isFull ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                  style={{ width: `${(slot.confirmedCount / slot.maxCapacity) * 100}%` }}
                                />
                              </div>
                            </td>
                            <td className="px-4 py-2.5">
                              {isBlocked ? (
                                <span className="bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded text-[10px]">Blocked</span>
                              ) : isFull ? (
                                <span className="bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded text-[10px] border border-rose-200">Full</span>
                              ) : (
                                <span className="bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded text-[10px] border border-emerald-200">Available</span>
                              )}
                            </td>
                            <td className="px-4 py-2.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {!isBlocked && !isFull && (
                                  <button
                                    onClick={() => blockSlot && blockSlot(slot.slotId)}
                                    className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                    title="Block this slot"
                                  >
                                    <Lock className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {!isFull && slot.confirmedCount === 0 && (
                                  <button
                                    onClick={() => removeSlot && removeSlot(slot.slotId)}
                                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                    title="Remove slot"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      ) : activeTab === 'system-limits' ? (
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="bg-[#111418] text-white p-6 rounded-2xl border border-[#2A3038] shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#C5A059] font-mono text-xs uppercase tracking-wider font-bold">
                Technical Governance &amp; Statutory Compliance
              </span>
              <span className="bg-[#C5A059]/20 text-[#C5A059] text-[10px] px-2 py-0.5 rounded-full font-mono">
                Honest Limits Disclosure
              </span>
            </div>
            <h3 className="font-serif text-xl font-bold text-white">
              Platform Operational Boundaries, AI Constraints &amp; Legal Framework
            </h3>
            <p className="text-xs text-gray-400 mt-1 max-w-3xl leading-relaxed">
              Transparent, verified notes regarding architectural limits, statutory boundaries under GujRERA and the Digital Personal Data Protection (DPDP) Act 2023, and concurrency safety guarantees.
            </p>
          </div>

          {/* 5 Boundaries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Limit 1: RAG Fact Sheet Grounding */}
            <div className="bg-white p-5 rounded-2xl border border-[#E6E4DF] shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#111418]">
                    1. RAG Fact Grounding &amp; Missing Info Boundary
                  </h4>
                  <span className="text-[10px] font-mono text-gray-400">Strict Knowledge Base Anchor</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>What the AI Does:</strong> Answers queries strictly from the Sales Head&apos;s verified fact sheet (carpet areas, base price bands, clubhouse specifications, and GujRERA registration numbers).
              </p>
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 leading-relaxed">
                <strong>Hard Limitation:</strong> The AI cannot speculate, guess future metro expansions, promise customized floor modifications, or fabricate unannounced phases. When a fact is absent, it responds: <em>&ldquo;That detail is not confirmed in our official fact sheet. I have flagged this for your designated sales advisor who will clarify directly.&rdquo;</em> and automatically creates a review ticket in the Daily Audit.
              </div>
            </div>

            {/* Limit 2: Anti-Negotiation & Pricing */}
            <div className="bg-white p-5 rounded-2xl border border-[#E6E4DF] shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#111418]">
                    2. Anti-Negotiation &amp; Statutory Pricing Limits
                  </h4>
                  <span className="text-[10px] font-mono text-gray-400">GujRERA Section 11(4) Enforcement</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>What the AI Does:</strong> Quotes approved indicative base price bands (e.g., ₹65L – ₹1.2 Cr).
              </p>
              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/60 text-xs text-rose-900 leading-relaxed">
                <strong>Hard Limitation:</strong> The AI cannot and will never negotiate discounts, promise stamp duty waivers, or quote off-book token amounts. Under GujRERA, making price promises beyond registered schedules incurs severe statutory penalties. Custom terms require an in-person consultation with the Sales Head.
              </div>
            </div>

            {/* Limit 3: Concurrency Engine */}
            <div className="bg-white p-5 rounded-2xl border border-[#E6E4DF] shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#111418]">
                    3. Concurrency Lock: Client Mutex vs Distributed Redlock
                  </h4>
                  <span className="text-[10px] font-mono text-gray-400">Zero Double-Booking Guarantee</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>What the AI Does:</strong> Enforces an atomic 180-second reservation lease preventing two buyers from claiming the exact same site-visit slot simultaneously.
              </p>
              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200/60 text-xs text-indigo-900 leading-relaxed">
                <strong>Engineering Limit:</strong> In this interactive demo client, the Two-Phase Optimistic Mutex operates in memory/local store. In high-traffic distributed multi-server production, this pattern translates to Redis Redlock with distributed TTL leases and PostgreSQL transaction row locks (<code>SELECT FOR UPDATE</code>).
              </div>
            </div>

            {/* Limit 4: DPDP Act 2023 & Consent */}
            <div className="bg-white p-5 rounded-2xl border border-[#E6E4DF] shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#111418]">
                    4. DPDP Act 2023 Consent &amp; Opt-Out Boundaries
                  </h4>
                  <span className="text-[10px] font-mono text-gray-400">Digital Personal Data Protection</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>What the AI Does:</strong> Normalizes phone numbers (+91 E.164), captures explicit consent timestamps, and honors statutory opt-out requests instantly.
              </p>
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-900 leading-relaxed">
                <strong>Hard Limitation:</strong> Replying &ldquo;STOP&rdquo; on WhatsApp immediately revokes consent and locks outbound messaging. Outbound voice robocalls and unsolicited data scraping are strictly prohibited and outside the system scope.
              </div>
            </div>

            {/* Limit 5: WhatsApp Cloud API Quotas */}
            <div className="bg-white p-5 rounded-2xl border border-[#E6E4DF] shadow-xs space-y-3 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#111418]">
                    5. Meta WhatsApp Cloud API Throughput &amp; Template Constraints
                  </h4>
                  <span className="text-[10px] font-mono text-gray-400">Meta Business Messaging Policy</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>What the AI Does:</strong> Dispatches automated pre-tour directions 24 hours prior and parking gate access 2 hours prior using registered GujRERA HSM templates.
              </p>
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs text-blue-900 leading-relaxed">
                <strong>Technical Limits:</strong> All business-initiated notifications outside the 24-hour service window require pre-approved Meta templates. Production accounts operate on messaging tiers (Tier 1: 1,000 unique users/24h, Tier 2: 10,000/24h, Tier 3: 100,000/24h) with an 80 messages/second gateway ceiling.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Project Switcher Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#E6E4DF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-700">Select Project to Edit:</span>
              <div className="flex gap-1.5">
                {(['Project 1', 'Project 2'] as const).map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => handleProjectSelect(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeProject === p
                        ? 'bg-[#111418] text-[#C5A059] shadow-xs'
                        : 'bg-[#F8F7F4] text-gray-600 hover:bg-[#E6E4DF]'
                    }`}
                  >
                    {p} ({factSheets[p].commercialName})
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {saveSuccess && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" /> Changes Applied Live to AI
                </span>
              )}
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#111418] hover:bg-[#2A3038] text-white shadow-xs"
              >
                <Save className="w-4 h-4 text-[#C5A059]" />
                <span>Save Fact Sheet</span>
              </button>
            </div>
          </div>

          {/* Form Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Specs & RERA */}
            <div className="bg-white p-6 rounded-2xl border border-[#E6E4DF] shadow-xs space-y-4">
              <h3 className="font-serif text-base font-bold text-[#111418] pb-2 border-b border-[#E6E4DF] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                Project Identity &amp; GujRERA Registration
              </h3>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Commercial Name
                </label>
                <input
                  type="text"
                  value={formData.commercialName}
                  onChange={(e) => setFormData({ ...formData, commercialName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E6E4DF] rounded-xl focus:ring-1 focus:ring-[#C5A059] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  GujRERA Registration Number (Mandatory under RERA)
                </label>
                <input
                  type="text"
                  value={formData.reraNumber}
                  onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E6E4DF] rounded-xl focus:ring-1 focus:ring-[#C5A059] focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Locality &amp; Area
                  </label>
                  <input
                    type="text"
                    value={formData.location.locality}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, locality: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-[#E6E4DF] rounded-xl focus:ring-1 focus:ring-[#C5A059] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Possession Date
                  </label>
                  <input
                    type="text"
                    value={formData.possessionDate}
                    onChange={(e) => setFormData({ ...formData, possessionDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E6E4DF] rounded-xl focus:ring-1 focus:ring-[#C5A059] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Project Address
                </label>
                <textarea
                  rows={2}
                  value={formData.location.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, address: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-[#E6E4DF] rounded-xl focus:ring-1 focus:ring-[#C5A059] focus:outline-none"
                />
              </div>
            </div>

            {/* Pricing Guardrails & Strict Developer Policies */}
            <div className="bg-white p-6 rounded-2xl border border-[#E6E4DF] shadow-xs space-y-4">
              <h3 className="font-serif text-base font-bold text-[#111418] pb-2 border-b border-[#E6E4DF] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#D9822B]" />
                Pricing Guardrails &amp; Anti-Negotiation Boundary
              </h3>

              <div className="bg-[#FBF7EE] border border-[#C5A059]/30 p-3 rounded-xl text-xs text-[#735722]">
                <strong>AI Operational Boundary:</strong> The AI assistant is strictly barred from
                quoting customized discounts or negotiating prices. It quotes only the approved range
                below.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Base Price (From)
                  </label>
                  <input
                    type="text"
                    value={formData.pricingGuardrails.minPriceOverall}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricingGuardrails: {
                          ...formData.pricingGuardrails,
                          minPriceOverall: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-[#E6E4DF] rounded-xl focus:ring-1 focus:ring-[#C5A059] focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Max Price (To)
                  </label>
                  <input
                    type="text"
                    value={formData.pricingGuardrails.maxPriceOverall}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricingGuardrails: {
                          ...formData.pricingGuardrails,
                          maxPriceOverall: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-[#E6E4DF] rounded-xl focus:ring-1 focus:ring-[#C5A059] focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Developer Anti-Discount Rule
                </label>
                <textarea
                  rows={2}
                  value={formData.pricingGuardrails.authorizedDiscountPolicy}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pricingGuardrails: {
                        ...formData.pricingGuardrails,
                        authorizedDiscountPolicy: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-[#E6E4DF] rounded-xl focus:ring-1 focus:ring-[#C5A059] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Sales Head Private Strategy Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.salesHeadNotes}
                  onChange={(e) => setFormData({ ...formData, salesHeadNotes: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E6E4DF] rounded-xl focus:ring-1 focus:ring-[#C5A059] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
