import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  RefreshCw,
  GitMerge,
  Clock,
  Layers,
} from 'lucide-react';
import { Lead, LeadSource, LeadStatus } from '../../types/lead';
import { useLeadStore } from '../../store/useLeadStore';
import { DeduplicationModal } from './DeduplicationModal';
import { formatResponseTime } from '../../utils/formatters';

export const UnifiedLeadList: React.FC = () => {
  const {
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
  } = useLeadStore();

  const [activeMergeLead, setActiveMergeLead] = useState<Lead | null>(null);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);

  // New lead simulation form state
  const [simName, setSimName] = useState('');
  const [simPhone, setSimPhone] = useState('');
  const [simSource, setSimSource] = useState<LeadSource>('Property portal');
  const [simProject, setSimProject] = useState<'Project 1' | 'Project 2'>('Project 1');
  const [simConfig, setSimConfig] = useState<'2 BHK' | '3 BHK'>('3 BHK');

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simName || !simPhone) return;

    ingestLead(simName, simPhone, simSource, simProject, simConfig, `${simName.toLowerCase().replace(/\s+/g, '')}@gmail.com`);
    setIsSimulateModalOpen(false);
    setSimName('');
    setSimPhone('');
  };

  const getSourceBadgeColor = (source: LeadSource) => {
    switch (source) {
      case 'Property portal':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Social media ad':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'Hoarding call':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Website':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status: LeadStatus) => {
    switch (status) {
      case 'Site Visit Booked':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Visited':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      case 'In Conversation':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Cold':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'No-Show':
        return 'bg-gray-100 text-gray-600 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#E6E4DF] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#C5A059] font-mono text-xs uppercase tracking-wider font-bold">
              Multi-Channel Ingestion Engine
            </span>
            <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
              Real-Time Duplicate Checks
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#111418] mt-1">
            Unified Lead Hub &amp; Touchpoint Tracker
          </h2>
          <p className="text-xs text-gray-500">
            Consolidated stream from 99acres/MagicBricks, Meta Social Ads, Hoarding QR Calls, and Website Inbound.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsSimulateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#111418] hover:bg-[#2A3038] text-white shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 text-[#C5A059]" />
            <span>Simulate Inbound Lead</span>
          </button>

          <button
            onClick={resetToSeeds}
            title="Reset to official seed data"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#F8F7F4] hover:bg-[#E6E4DF] text-gray-700 border border-[#E6E4DF] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
            <span>Reset Seeds</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E6E4DF] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone (+91), or lead ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#E6E4DF] rounded-xl focus:ring-1 focus:ring-[#C5A059] focus:outline-none"
          />
        </div>

        {/* Source & Status Filter */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Source:
            </span>
            {(['All', 'Property portal', 'Social media ad', 'Website', 'Hoarding call'] as const).map(
              (src) => (
                <button
                  key={src}
                  onClick={() => setSelectedSource(src)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedSource === src
                      ? 'bg-[#111418] text-white font-bold'
                      : 'bg-[#F8F7F4] text-gray-700 hover:bg-[#E6E4DF]'
                  }`}
                >
                  {src}
                </button>
              )
            )}
          </div>

          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-xs text-gray-500 font-semibold">Status:</span>
            {(['All', 'Site Visit Booked', 'Visited', 'In Conversation', 'Cold'] as const).map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st as LeadStatus | 'All')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                    selectedStatus === st
                      ? 'bg-[#C5A059] text-[#111418] font-bold'
                      : 'bg-[#F8F7F4] text-gray-600 hover:bg-[#E6E4DF]'
                  }`}
                >
                  {st}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Lead Table (Desktop & Tablet) and Responsive Cards (Mobile) */}
      <div className="bg-white rounded-2xl border border-[#E6E4DF] shadow-sm overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-[#F8F7F4] text-[#111418] uppercase text-[10px] tracking-wider font-bold border-b border-[#E6E4DF]">
              <tr>
                <th className="px-5 py-3.5">Lead Profile</th>
                <th className="px-4 py-3.5">Source &amp; Touchpoints</th>
                <th className="px-4 py-3.5">Project &amp; Wants</th>
                <th className="px-4 py-3.5">Response Time</th>
                <th className="px-4 py-3.5">Visit Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E4DF]">
              {filteredLeads.map((lead) => {
                const isMandatorySample = ['LD-58210', 'LD-58211', 'LD-58224'].includes(lead.id);

                return (
                  <tr key={lead.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Profile */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#111418] text-[#C5A059] flex items-center justify-center font-bold text-xs shrink-0">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#111418] text-sm">{lead.name}</span>
                            {isMandatorySample && (
                              <span className="bg-[#C5A059]/20 text-[#8F6C27] font-semibold text-[9px] px-1.5 py-0.2 rounded-sm border border-[#C5A059]/40">
                                Official Seed
                              </span>
                            )}
                            {lead.isDuplicate && (
                              <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.2 rounded-sm font-semibold flex items-center gap-0.5">
                                <GitMerge className="w-2.5 h-2.5" /> Duplicate Touchpoint
                              </span>
                            )}
                          </div>
                          <div className="text-gray-500 font-mono text-[11px] flex items-center gap-2 mt-0.5">
                            <span>{lead.phone}</span>
                            <span>•</span>
                            <span className="text-gray-400 font-sans text-[10px]">{lead.id}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Source & Touchpoints */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getSourceBadgeColor(
                          lead.source
                        )}`}
                      >
                        {lead.source}
                      </span>
                      {lead.touchpoints && lead.touchpoints.length > 1 && (
                        <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                          <Layers className="w-3 h-3 text-[#C5A059]" />
                          <span>{lead.touchpoints.length} touchpoints merged</span>
                        </div>
                      )}
                    </td>

                    {/* Project & Wants */}
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-gray-900 block">{lead.projectInterest}</span>
                      <span className="text-[11px] text-[#A37F38] font-bold block">
                        {lead.configurationWanted}
                      </span>
                    </td>

                    {/* Response Time SLA */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Clock
                          className={`w-3.5 h-3.5 ${
                            (lead.firstResponseTimeSeconds || 0) < 120
                              ? 'text-emerald-500'
                              : 'text-rose-500'
                          }`}
                        />
                        <span className="font-mono font-bold text-xs">
                          {formatResponseTime(lead.firstResponseTimeSeconds)}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        {(lead.firstResponseTimeSeconds || 0) < 120 ? 'Sub-2m SLA Passed' : 'Cold Lag'}
                      </span>
                    </td>

                    {/* Visit Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-[11px] border ${getStatusBadgeColor(
                          lead.status
                        )}`}
                      >
                        {lead.status}
                      </span>
                      {lead.assignedExecutiveName && (
                        <span className="text-[10px] text-gray-500 block mt-0.5 truncate max-w-[120px]">
                          Advisor: {lead.assignedExecutiveName}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {lead.status === 'Site Visit Booked' && (
                          <button
                            onClick={() => updateLeadStatus(lead.id, 'Visited')}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded text-[11px] font-semibold border border-emerald-200 transition-colors"
                          >
                            Mark Visited
                          </button>
                        )}

                        {lead.isDuplicate && (
                          <button
                            onClick={() => setActiveMergeLead(lead)}
                            className="p-1.5 text-[#C5A059] hover:bg-[#FBF7EE] rounded-lg transition-colors"
                            title="Inspect Duplicate Record"
                          >
                            <GitMerge className="w-4 h-4" />
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

        {/* Mobile Dedicated Card View (< 768px) */}
        <div className="md:hidden divide-y divide-[#E6E4DF] p-2 space-y-3">
          {filteredLeads.map((lead) => {
            const isMandatorySample = ['LD-58210', 'LD-58211', 'LD-58224'].includes(lead.id);

            return (
              <div
                key={lead.id}
                className="bg-[#F8F7F4]/60 p-4 rounded-xl border border-[#E6E4DF] space-y-2.5 transition-all"
              >
                {/* Header: Name, Avatar, ID, Official Seed */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#111418] text-[#C5A059] flex items-center justify-center font-bold text-xs shrink-0">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#111418] text-sm">{lead.name}</span>
                        {isMandatorySample && (
                          <span className="bg-[#C5A059]/20 text-[#8F6C27] font-semibold text-[9px] px-1.5 py-0.2 rounded-sm border border-[#C5A059]/40">
                            Seed
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500 font-mono text-[11px] block">{lead.phone}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${getStatusBadgeColor(
                      lead.status
                    )}`}
                  >
                    {lead.status}
                  </span>
                </div>

                {/* Sub details: Source badge & Project interest */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E6E4DF]/60">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getSourceBadgeColor(
                      lead.source
                    )}`}
                  >
                    {lead.source}
                  </span>

                  <span className="text-[11px] font-medium text-gray-700">
                    <strong className="text-[#111418]">{lead.projectInterest}</strong> • {lead.configurationWanted}
                  </span>
                </div>

                {/* SLA and Touchpoint counts */}
                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5">
                  <div className="flex items-center gap-1">
                    <Clock
                      className={`w-3 h-3 ${
                        (lead.firstResponseTimeSeconds || 0) < 120
                          ? 'text-emerald-500'
                          : 'text-rose-500'
                      }`}
                    />
                    <span className="font-mono font-semibold">
                      {formatResponseTime(lead.firstResponseTimeSeconds)}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      ({(lead.firstResponseTimeSeconds || 0) < 120 ? 'Sub-2m' : 'Cold'})
                    </span>
                  </div>

                  {lead.touchpoints && lead.touchpoints.length > 1 && (
                    <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded-sm font-semibold flex items-center gap-1">
                      <GitMerge className="w-2.5 h-2.5" /> {lead.touchpoints.length} merged
                    </span>
                  )}
                </div>

                {/* Mobile Actions Button Row */}
                {(lead.status === 'Site Visit Booked' || lead.isDuplicate) && (
                  <div className="pt-2 border-t border-[#E6E4DF] flex items-center justify-end gap-2">
                    {lead.status === 'Site Visit Booked' && (
                      <button
                        onClick={() => updateLeadStatus(lead.id, 'Visited')}
                        className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors text-center"
                      >
                        Mark Visited
                      </button>
                    )}

                    {lead.isDuplicate && (
                      <button
                        onClick={() => setActiveMergeLead(lead)}
                        className="py-1.5 px-3 bg-[#111418] text-[#C5A059] rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0"
                      >
                        <GitMerge className="w-3.5 h-3.5" />
                        <span>Inspect Duplicate</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Merge Modal */}
      {activeMergeLead && (
        <DeduplicationModal
          isOpen={Boolean(activeMergeLead)}
          onClose={() => setActiveMergeLead(null)}
          primaryLead={activeMergeLead}
          duplicateLeads={leads.filter((l) => l.phone === activeMergeLead.phone && l.id !== activeMergeLead.id)}
          onMerge={manualMergeLeads}
        />
      )}

      {/* Simulate Lead Ingestion Modal */}
      {isSimulateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E6E4DF]">
            <h3 className="font-serif text-lg font-bold text-[#111418] mb-1">
              Simulate Multi-Channel Lead Inbound
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Enter details to test automatic phone normalization and duplicate merging.
            </p>

            <form onSubmit={handleSimulateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Buyer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hardik Patel"
                  value={simName}
                  onChange={(e) => setSimName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E6E4DF] rounded-xl focus:ring-1 focus:ring-[#C5A059] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone (Try +919825058210 to test duplicate trigger)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 098250 58210"
                  value={simPhone}
                  onChange={(e) => setSimPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E6E4DF] rounded-xl focus:ring-1 focus:ring-[#C5A059] focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Acquisition Source</label>
                  <select
                    value={simSource}
                    onChange={(e) => setSimSource(e.target.value as LeadSource)}
                    className="w-full px-2.5 py-2 text-xs border border-[#E6E4DF] rounded-xl focus:ring-1 focus:ring-[#C5A059] focus:outline-none"
                  >
                    <option value="Property portal">Property portal</option>
                    <option value="Social media ad">Social media ad</option>
                    <option value="Website">Website</option>
                    <option value="Hoarding call">Hoarding call</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Project Interest</label>
                  <select
                    value={simProject}
                    onChange={(e) => setSimProject(e.target.value as 'Project 1' | 'Project 2')}
                    className="w-full px-2.5 py-2 text-xs border border-[#E6E4DF] rounded-xl focus:ring-1 focus:ring-[#C5A059] focus:outline-none"
                  >
                    <option value="Project 1">Project 1 (Grand Orchid)</option>
                    <option value="Project 2">Project 2 (Orchid Heights)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Configuration</label>
                <select
                  value={simConfig}
                  onChange={(e) => setSimConfig(e.target.value as '2 BHK' | '3 BHK')}
                  className="w-full px-2.5 py-2 text-xs border border-[#E6E4DF] rounded-xl focus:ring-1 focus:ring-[#C5A059] focus:outline-none"
                >
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSimulateModalOpen(false)}
                  className="px-4 py-2 text-xs text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#111418] hover:bg-[#2A3038] text-white rounded-xl shadow-xs"
                >
                  Ingest Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
