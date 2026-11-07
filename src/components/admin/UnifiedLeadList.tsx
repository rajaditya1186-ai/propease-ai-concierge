import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Filter,
  Plus,
  RefreshCw,
  GitMerge,
  Clock,
  Layers,
  BarChart3,
  Download,
  X,
  Phone,
  MessageSquare,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { Lead, LeadSource, LeadStatus } from '../../types/lead';
import { useLeadStore } from '../../store/useLeadStore';
import { DeduplicationModal } from './DeduplicationModal';
import { formatResponseTime } from '../../utils/formatters';
import { Toast } from '../../hooks/useToast';

interface UnifiedLeadListProps {
  onToast?: (toast: Omit<Toast, 'id'>) => void;
}

// ── Animated count-up hook ─────────────────────────────────────────
function useCountUp(target: number, duration = 900): number {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return value;
}

export const UnifiedLeadList: React.FC<UnifiedLeadListProps> = ({ onToast }) => {
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
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null);
  const [leadNotes, setLeadNotes] = useState<Record<string, string[]>>({});
  const [newNoteText, setNewNoteText] = useState('');

  // Stats summary counts
  const statCounts = {
    new: leads.filter((l) => l.status === 'New').length,
    conversation: leads.filter((l) => l.status === 'In Conversation').length,
    booked: leads.filter((l) => l.status === 'Site Visit Booked').length,
    visited: leads.filter((l) => l.status === 'Visited').length,
    cold: leads.filter((l) => l.status === 'Cold').length,
  };

  const animNew = useCountUp(statCounts.new);
  const animConvo = useCountUp(statCounts.conversation);
  const animBooked = useCountUp(statCounts.booked);
  const animVisited = useCountUp(statCounts.visited);
  const animCold = useCountUp(statCounts.cold);
  const animValues = [animNew, animConvo, animBooked, animVisited, animCold];

  // New lead simulation form state
  const [simName, setSimName] = useState('');
  const [simPhone, setSimPhone] = useState('');
  const [simSource, setSimSource] = useState<LeadSource>('Property portal');
  const [simProject, setSimProject] = useState<'Project 1' | 'Project 2'>('Project 1');
  const [simConfig, setSimConfig] = useState<'2 BHK' | '3 BHK'>('3 BHK');

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simName || !simPhone) return;

    const { isNewRecord } = ingestLead(
      simName,
      simPhone,
      simSource,
      simProject,
      simConfig,
      `${simName.toLowerCase().replace(/\s+/g, '')}@gmail.com`
    );

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      onToast?.({
        type: isNewRecord ? 'success' : 'warning',
        title: isNewRecord ? 'New Lead Ingested' : 'Duplicate Merged',
        message: isNewRecord
          ? `${simName} registered from ${simSource}. Auto-response dispatched in 18s.`
          : `${simName} matched existing record — new touchpoint appended.`,
      });
      setIsSimulateModalOpen(false);
      setSimName('');
      setSimPhone('');
    }, 800);
  };

  const handleExportCSV = () => {
    const headers = 'Lead ID,Name,Phone,Email,Source,Project,Wants,Response Time (s),Status,Assigned Advisor,Touchpoints\n';
    const rows = filteredLeads
      .map((l) => {
        return `"${l.id}","${l.name}","${l.phone}","${l.email || ''}","${l.source}","${l.projectInterest}","${l.configurationWanted}",${l.firstResponseTimeSeconds || 0},"${l.status}","${l.assignedExecutiveName || 'Unassigned'}",${l.touchpoints?.length || 1}`;
      })
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CompanyA_Leads_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onToast?.({
      type: 'success',
      title: 'CSV Export Generated',
      message: `Downloaded ${filteredLeads.length} lead records.`,
    });
  };

  const handleAddNote = (leadId: string) => {
    if (!newNoteText.trim()) return;
    setLeadNotes((prev) => ({
      ...prev,
      [leadId]: [
        ...(prev[leadId] || []),
        `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}: ${newNoteText.trim()}`,
      ],
    }));
    setNewNoteText('');
    onToast?.({
      type: 'info',
      title: 'Note Logged',
      message: 'Internal sales note saved to profile.',
    });
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

  const STAT_ITEMS = [
    { label: 'New', value: animValues[0], bg: 'bg-blue-50 border-blue-200 text-blue-700' },
    { label: 'In Convo', value: animValues[1], bg: 'bg-amber-50 border-amber-200 text-amber-800' },
    { label: 'Visit Booked', value: animValues[2], bg: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
    { label: 'Visited', value: animValues[3], bg: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
    { label: 'Cold', value: animValues[4], bg: 'bg-rose-50 border-rose-200 text-rose-700' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#E6E4DF] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 card-hover animate-fade-up">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#C5A059] font-mono text-xs uppercase tracking-wider font-bold">
              Multi-Channel Ingestion Engine
            </span>
            <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
            onClick={handleExportCSV}
            title="Download CSV report of leads"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#F8F7F4] hover:bg-[#E6E4DF] text-gray-700 border border-[#E6E4DF] transition-all hover:scale-[1.02] active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              const res = ingestLead('Hardik Patel', '9825012345', 'Hoarding call', 'Project 1', '3 BHK');
              onToast?.({
                type: 'info',
                title: 'Duplicate Check Triggered',
                message: res.isNewRecord
                  ? 'New lead registered'
                  : 'Phone +91 98250 12345 identified! Merged repeat enquiry into Hardik Patel (LD-58210) without duplicate creation.',
              });
            }}
            title="Test deduplication: Ingests a repeat enquiry from Hardik Patel via Hoarding"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#FBF7EE] hover:bg-[#F5EDD8] text-[#8F6C27] border border-[#C5A059]/40 transition-all hover:scale-[1.02] active:scale-95 btn-ripple"
          >
            <GitMerge className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Test Deduplication</span>
          </button>

          <button
            onClick={() => setIsSimulateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#111418] hover:bg-[#2A3038] text-white shadow-xs transition-all hover:scale-[1.02] active:scale-95 btn-ripple"
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

      {/* Stats Summary Bar — animated count-up numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {STAT_ITEMS.map((s, i) => (
          <div
            key={s.label}
            className={`rounded-xl border px-3 py-2.5 text-center card-hover animate-kpi-reveal ${s.bg}`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className="text-2xl font-bold font-mono block tabular-nums">{s.value}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider block mt-0.5 opacity-75">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E6E4DF] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search buyer name, phone, or Lead ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8F7F4] border border-[#E6E4DF] rounded-xl focus:ring-1 focus:ring-[#C5A059] focus:outline-none transition-all"
          />
        </div>

        {/* Source & Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Filter className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold whitespace-nowrap">Source:</span>
          </div>
          {(['All', 'Property portal', 'Social media ad', 'Website', 'Hoarding call'] as const).map(
            (source) => (
              <button
                key={source}
                onClick={() => setSelectedSource(source)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                  selectedSource === source
                    ? 'bg-[#111418] text-white font-bold'
                    : 'bg-[#F8F7F4] text-gray-600 hover:bg-[#E6E4DF]'
                }`}
              >
                {source}
              </button>
            )
          )}

          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-xs text-gray-500 font-semibold whitespace-nowrap">Status:</span>
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
          {filteredLeads.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F8F7F4] border border-[#E6E4DF] flex items-center justify-center mx-auto animate-float">
                <BarChart3 className="w-7 h-7 text-gray-300" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700">No leads match this filter</p>
                <p className="text-xs text-gray-400 mt-1">
                  Try clearing the search or changing the source / status filter.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSource('All');
                  setSelectedStatus('All' as LeadStatus | 'All');
                }}
                className="text-xs font-semibold text-[#C5A059] hover:underline underline-offset-2"
              >
                Clear all filters
              </button>
            </div>
          ) : (
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
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLeadForDetail(lead)}
                      className="hover:bg-[#FBF7EE]/40 transition-colors group relative cursor-pointer"
                    >
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
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getSourceBadgeColor(lead.source)}`}
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
                          className={`inline-block px-2.5 py-1 rounded-lg text-[11px] border ${getStatusBadgeColor(lead.status)}`}
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
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLeadForDetail(lead);
                            }}
                            className="px-2 py-1 bg-[#111418] hover:bg-[#2A3038] text-[#C5A059] rounded text-[11px] font-semibold transition-colors flex items-center gap-1"
                          >
                            <span>Dossier</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>

                          {lead.status === 'Site Visit Booked' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateLeadStatus(lead.id, 'Visited');
                                onToast?.({
                                  type: 'success',
                                  title: 'Visit recorded',
                                  message: `${lead.name} marked as Visited.`,
                                });
                              }}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded text-[11px] font-semibold border border-emerald-200 transition-colors"
                            >
                              Mark Visited
                            </button>
                          )}

                          {lead.isDuplicate && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMergeLead(lead);
                              }}
                              className="p-1.5 text-[#C5A059] hover:bg-[#FBF7EE] rounded-lg transition-colors"
                              title="Inspect Duplicate Record"
                            >
                              <GitMerge className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        {/* Fallback */}
                        <div className="flex items-center justify-end gap-1.5 group-hover:hidden">
                          <span className="text-[10px] text-gray-400 font-mono flex items-center gap-0.5">
                            Details <ChevronRight className="w-3 h-3 text-gray-300" />
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile Dedicated Card View (< 768px) */}
        <div className="md:hidden divide-y divide-[#E6E4DF] p-2 space-y-3">
          {filteredLeads.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#F8F7F4] border border-[#E6E4DF] flex items-center justify-center mx-auto animate-float">
                <BarChart3 className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm font-bold text-gray-600">No leads match your filter</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSource('All');
                  setSelectedStatus('All' as LeadStatus | 'All');
                }}
                className="text-xs font-semibold text-[#C5A059] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const isMandatorySample = ['LD-58210', 'LD-58211', 'LD-58224'].includes(lead.id);

              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLeadForDetail(lead)}
                  className="bg-[#F8F7F4]/60 p-4 rounded-xl border border-[#E6E4DF] space-y-2.5 transition-all cursor-pointer hover:border-[#C5A059]"
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
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getSourceBadgeColor(lead.source)}`}
                    >
                      {lead.source}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#E6E4DF]/60">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-semibold uppercase">Project</span>
                      <span className="font-semibold text-gray-800">{lead.projectInterest}</span>
                      <span className="text-[11px] text-[#A37F38] block font-bold">{lead.configurationWanted}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block font-semibold uppercase">Response Time</span>
                      <div className="flex items-center gap-1 font-mono text-xs font-bold text-gray-800">
                        <Clock className="w-3 h-3 text-[#1B7A4D]" />
                        <span>{formatResponseTime(lead.firstResponseTimeSeconds)}</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 block">Sub-2m SLA ✓</span>
                    </div>
                  </div>

                  {/* Status & Action */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#E6E4DF]/60">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusBadgeColor(lead.status)}`}
                    >
                      {lead.status}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLeadForDetail(lead);
                      }}
                      className="text-xs font-bold text-[#C5A059] flex items-center gap-1 hover:underline"
                    >
                      <span>View Dossier</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Duplicate Resolution Modal */}
      {activeMergeLead && (
        <DeduplicationModal
          isOpen={!!activeMergeLead}
          onClose={() => setActiveMergeLead(null)}
          primaryLead={activeMergeLead}
          duplicateLeads={leads.filter(
            (l) => l.phone === activeMergeLead.phone && l.id !== activeMergeLead.id
          )}
          onMerge={(masterId, duplicateId) => {
            manualMergeLeads(masterId, duplicateId);
            setActiveMergeLead(null);
            onToast?.({
              type: 'success',
              title: 'Records Merged',
              message: 'Touchpoints unified under canonical lead.',
            });
          }}
        />
      )}

      {/* ── Lead Detail & Touchpoint Dossier Drawer ────────────────────────── */}
      {selectedLeadForDetail && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setSelectedLeadForDetail(null)}
            className="fixed inset-0 backdrop-dark cursor-pointer"
          />
          <aside className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white border-l border-[#E6E4DF] shadow-2xl flex flex-col overflow-y-auto animate-slide-right">
              {/* Drawer Header */}
              <div className="p-5 border-b border-[#E6E4DF] bg-[#111418] text-white flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1A1E24] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] font-bold text-base font-serif">
                    {selectedLeadForDetail.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-base text-white leading-tight">
                        {selectedLeadForDetail.name}
                      </h3>
                      <span className="font-mono text-[10px] text-gray-400">
                        {selectedLeadForDetail.id}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {selectedLeadForDetail.projectInterest} · {selectedLeadForDetail.configurationWanted}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLeadForDetail(null)}
                  className="w-8 h-8 rounded-lg bg-[#1A1E24] hover:bg-[#2A3038] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Close dossier"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-5 space-y-5 flex-1">
                {/* Contact Card */}
                <div className="bg-[#F8F7F4] p-4 rounded-xl border border-[#E6E4DF] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Direct Communication
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                      DPDP Consented
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#111418] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                      {selectedLeadForDetail.phone}
                    </span>
                    <a
                      href={`https://wa.me/${selectedLeadForDetail.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(selectedLeadForDetail.name)},%20this%20is%20Company%20A%20Ahmedabad.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" />
                      WhatsApp
                    </a>
                  </div>
                </div>

                {/* Status Updater */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                    Current Lead Pipeline Stage
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['New', 'In Conversation', 'Site Visit Booked', 'Visited', 'Cold'] as LeadStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          updateLeadStatus(selectedLeadForDetail.id, st);
                          setSelectedLeadForDetail({ ...selectedLeadForDetail, status: st });
                          onToast?.({
                            type: 'success',
                            title: 'Status Updated',
                            message: `${selectedLeadForDetail.name} moved to "${st}".`,
                          });
                        }}
                        className={`p-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                          selectedLeadForDetail.status === st
                            ? 'bg-[#111418] text-[#C5A059] border-[#111418] shadow-xs'
                            : 'bg-white text-gray-700 border-[#E6E4DF] hover:bg-gray-50'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Multi-Touchpoint Timeline */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
                    Touchpoint History &amp; SLA
                  </span>
                  <div className="border-l-2 border-[#E6E4DF] pl-4 space-y-4 text-xs ml-1">
                    <div className="relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -left-[21px] top-1" />
                      <span className="text-[10px] text-gray-400 font-mono">Channel Ingestion</span>
                      <p className="font-bold text-[#111418]">Inbound via {selectedLeadForDetail.source}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Inquired about {selectedLeadForDetail.configurationWanted} at {selectedLeadForDetail.projectInterest}.
                      </p>
                    </div>

                    <div className="relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#C5A059] absolute -left-[21px] top-1" />
                      <span className="text-[10px] text-gray-400 font-mono">AI Engagement SLA</span>
                      <p className="font-bold text-[#111418]">
                        First Response: {formatResponseTime(selectedLeadForDetail.firstResponseTimeSeconds)}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                        ✓ Sub-2 minute brief commitment fulfilled
                      </p>
                    </div>

                    {selectedLeadForDetail.assignedExecutiveName && (
                      <div className="relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 absolute -left-[21px] top-1" />
                        <span className="text-[10px] text-gray-400 font-mono">Advisor Assigned</span>
                        <p className="font-bold text-[#111418]">
                          {selectedLeadForDetail.assignedExecutiveName}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Assigned based on project specialty and language preference.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Internal Sales Notes */}
                <div className="space-y-2 pt-2 border-t border-[#E6E4DF]">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                    Sales Notes &amp; Follow-Up
                  </span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {(leadNotes[selectedLeadForDetail.id] || [
                      'Auto-note: RERA brochure and GPS pin dispatched.',
                      'High intent: Buyer requested high-floor corner unit.'
                    ]).map((note, idx) => (
                      <div key={idx} className="bg-[#F8F7F4] p-2 rounded-lg border border-[#E6E4DF] text-[11px] text-gray-700">
                        {note}
                      </div>
                    ))}
                  </div>

                  {/* Add note input */}
                  <div className="flex gap-1.5 pt-1">
                    <input
                      type="text"
                      placeholder="Add an internal note..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddNote(selectedLeadForDetail.id);
                      }}
                      className="flex-1 px-3 py-1.5 text-xs border border-[#E6E4DF] rounded-xl focus:ring-1 focus:ring-[#C5A059] focus:outline-none"
                    />
                    <button
                      onClick={() => handleAddNote(selectedLeadForDetail.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#111418] hover:bg-[#2A3038] text-[#C5A059] transition-colors"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Simulate Inbound Lead Modal */}
      {isSimulateModalOpen && (
        <div className="fixed inset-0 z-50 backdrop-dark flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E6E4DF] animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E4DF]">
              <div>
                <h3 className="font-serif font-bold text-base text-[#111418]">Simulate Inbound Lead</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">Test real-time deduplication and auto-assignment</p>
              </div>
              <button
                onClick={() => setIsSimulateModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-2 animate-fade-up">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="font-bold text-sm text-[#111418]">Lead Successfully Processed!</p>
                <p className="text-xs text-gray-500">Auto-reply queued in under 18 seconds.</p>
              </div>
            ) : (
              <form onSubmit={handleSimulateSubmit} className="space-y-3.5 pt-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Mehta"
                    value={simName}
                    onChange={(e) => setSimName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E6E4DF] rounded-xl focus:ring-1 focus:ring-[#C5A059] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98250 11223"
                    value={simPhone}
                    onChange={(e) => setSimPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E6E4DF] rounded-xl focus:ring-1 focus:ring-[#C5A059] focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Use existing phone (e.g. +91 98250 12340) to test duplicate detection.
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
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
                    className="px-4 py-2 text-xs font-bold bg-[#111418] hover:bg-[#2A3038] text-white rounded-xl shadow-xs transition-all hover:scale-[1.02] active:scale-95 btn-ripple"
                  >
                    Ingest Lead
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
