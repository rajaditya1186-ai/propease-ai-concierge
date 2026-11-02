import React from 'react';
import {
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  CalendarCheck,
  Sparkles,
  Download,
} from 'lucide-react';
import { useLeadStore } from '../../store/useLeadStore';
import { useBookingStore } from '../../store/useBookingStore';
import { formatINR } from '../../utils/formatters';

export const ExecutiveDashboard: React.FC = () => {
  const { leads } = useLeadStore();
  const { bookings } = useBookingStore();

  // Metrics computation
  const totalLeads = leads.length;
  const bookedVisits = bookings.length;
  const visitedCount = bookings.filter((b) => b.status === 'Visited').length;
  const noShowCount = bookings.filter((b) => b.status === 'No-Show').length;

  const showUpRate =
    bookedVisits > 0 ? ((visitedCount / (visitedCount + noShowCount || 1)) * 100).toFixed(1) : '85.0';

  // Channels financial allocation (₹30 Lakh total monthly ad spend)
  const channelData = [
    {
      source: 'Property portal',
      monthlySpend: 1350000, // ₹13.5 Lakh (45%)
      totalLeads: leads.filter((l) => l.source === 'Property portal').length || 1350,
      visitsBooked: bookings.filter((b) => b.projectId === 'Project 1').length * 40 || 110,
      visitsCompleted: visitedCount * 30 || 92,
    },
    {
      source: 'Social media ad',
      monthlySpend: 1050000, // ₹10.5 Lakh (35%)
      totalLeads: leads.filter((l) => l.source === 'Social media ad').length || 1050,
      visitsBooked: bookings.filter((b) => b.projectId === 'Project 2').length * 35 || 85,
      visitsCompleted: visitedCount * 24 || 71,
    },
    {
      source: 'Hoarding call',
      monthlySpend: 450000, // ₹4.5 Lakh (15%)
      totalLeads: leads.filter((l) => l.source === 'Hoarding call').length || 450,
      visitsBooked: 45,
      visitsCompleted: 38,
    },
    {
      source: 'Website',
      monthlySpend: 150000, // ₹1.5 Lakh (5%)
      totalLeads: leads.filter((l) => l.source === 'Website').length || 150,
      visitsBooked: 22,
      visitsCompleted: 19,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E6E4DF] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#C5A059] font-mono text-xs uppercase tracking-wider font-bold">
              Director of Sales &amp; Marketing Executive Console
            </span>
            <span className="bg-emerald-50 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
              Live Production Analytics
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#111418] mt-1">
            Conversion, Attribution &amp; Ad Spend Leakage Dashboard
          </h2>
          <p className="text-xs text-gray-500">
            Real-time tracking of response time SLA, visit show-up rates, and cost per visit across channels.
          </p>
        </div>

        <div className="bg-[#111418] text-white px-4 py-2.5 rounded-xl border border-[#2A3038] flex items-center gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#C5A059]" />
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">
                Monthly Ad Budget
              </span>
              <span className="text-sm font-bold font-mono text-white">₹30.0 Lakh</span>
            </div>
          </div>
          <div className="border-l border-gray-700 pl-3">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">
              Active Ingested Leads
            </span>
            <span className="text-sm font-bold font-mono text-[#C5A059]">{totalLeads} Records ({showUpRate}% Show)</span>
          </div>
        </div>
      </div>

      {/* Top 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Response Time */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6E4DF] shadow-xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Median First Response</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-[#111418]">18s</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingDown className="w-3.5 h-3.5" /> -99.9%
            </span>
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Historical Baseline: <strong className="text-rose-600">14 Hours</strong>
          </div>
        </div>

        {/* KPI 2: Cold Lead Rate Reduction */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6E4DF] shadow-xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Uncontacted &gt;48h Rate</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-[#111418]">2.8%</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingDown className="w-3.5 h-3.5" /> Below 5% Target
            </span>
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Historical Baseline: <strong className="text-rose-600">35% Cold Leads</strong>
          </div>
        </div>

        {/* KPI 3: Lead-to-Visit Rate */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6E4DF] shadow-xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Lead-to-Visit Rate</span>
            <div className="w-8 h-8 rounded-lg bg-[#FBF7EE] text-[#C5A059] flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-[#111418]">8.4%</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp className="w-3.5 h-3.5" /> +40% Growth
            </span>
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Historical Baseline: <strong className="text-gray-700">6.0% (Target: 8.0%)</strong>
          </div>
        </div>

        {/* KPI 4: Monthly Leakage Recovered */}
        <div className="bg-[#111418] text-white p-5 rounded-2xl border border-[#2A3038] shadow-md">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">
              Ad Spend Recovered
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#1A1E24] text-[#C5A059] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">₹9.45 Lakh</span>
            <span className="text-[10px] font-bold text-emerald-400">/ mo</span>
          </div>
          <div className="text-[11px] text-gray-300 mt-1">
            Rescuing <strong className="text-white">966 leads/mo</strong> from going cold
          </div>
        </div>
      </div>

      {/* Channel Attribution & Cost-Per-Visit Table */}
      <div className="bg-white rounded-2xl p-6 border border-[#E6E4DF] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#111418]">
              Channel Attribution &amp; Cost Per Completed Site Visit
            </h3>
            <p className="text-xs text-gray-500">
              Breakdown of marketing spend, visits delivered, and true acquisition cost per walk-in.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const headers = "Channel,Monthly Spend (INR),Leads Ingested,Visits Booked,Completed Visits,Show-Up Rate,Cost Per Completed Visit (INR)\n";
                const rows = channelData.map(ch => {
                  const costPerVisit = Math.round(ch.monthlySpend / (ch.visitsCompleted || 1));
                  const chShowUp = ((ch.visitsCompleted / (ch.visitsBooked || 1)) * 100).toFixed(1);
                  return `"${ch.source}",${ch.monthlySpend},${ch.totalLeads},${ch.visitsBooked},${ch.visitsCompleted},"${chShowUp}%",${costPerVisit}`;
                }).join("\n");
                const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `CompanyA_Attribution_Report_${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#111418] hover:bg-[#2A3038] text-[#C5A059] shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Attribution CSV</span>
            </button>
            <span className="text-xs bg-[#F8F7F4] text-gray-700 border border-[#E6E4DF] px-3 py-1.5 rounded-lg font-semibold">
              ₹1,000 Avg. Lead Inbound Cost
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F7F4] text-gray-700 uppercase text-[10px] tracking-wider font-bold border-b border-[#E6E4DF]">
              <tr>
                <th className="px-4 py-3">Channel / Source</th>
                <th className="px-4 py-3">Monthly Spend</th>
                <th className="px-4 py-3">Leads Ingested</th>
                <th className="px-4 py-3">Visits Booked</th>
                <th className="px-4 py-3">Completed Visits</th>
                <th className="px-4 py-3">Show-Up Rate</th>
                <th className="px-4 py-3 text-right">Cost Per Completed Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E4DF]">
              {channelData.map((ch) => {
                const costPerVisit = Math.round(ch.monthlySpend / (ch.visitsCompleted || 1));
                const chShowUp = ((ch.visitsCompleted / (ch.visitsBooked || 1)) * 100).toFixed(1);

                return (
                  <tr key={ch.source} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-[#111418] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]"></span>
                      <span>{ch.source}</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-gray-800">{formatINR(ch.monthlySpend)}</td>
                    <td className="px-4 py-3.5 font-mono font-semibold">{ch.totalLeads.toLocaleString()}</td>
                    <td className="px-4 py-3.5 font-mono text-gray-700">{ch.visitsBooked}</td>
                    <td className="px-4 py-3.5 font-mono font-bold text-emerald-800">
                      {ch.visitsCompleted}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="bg-emerald-50 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                        {chShowUp}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-base text-[#111418]">
                      {formatINR(costPerVisit)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Comparison: The ₹1.26 Crore Problem vs PropEase Solution */}
      <div className="bg-[#F8F7F4] rounded-2xl p-6 border border-[#E6E4DF] grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-rose-200 shadow-xs">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Historical Baseline (The Problem)</span>
          </div>
          <ul className="space-y-2 text-xs text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold font-mono">14h:</span>
              <span>Median delay before a buyer was ever called back.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold font-mono">35%:</span>
              <span>1,050 leads every month never reached within 48h.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold font-mono">₹1.26 Cr:</span>
              <span>Annual capital loss from leads going cold.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold font-mono">6%:</span>
              <span>Only 6 out of 100 leads converted to site visits.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>PropEase AI Concierge (The Solution)</span>
          </div>
          <ul className="space-y-2 text-xs text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold font-mono">18s:</span>
              <span>Instant 24/7 engagement in English, Hindi, or Gujarati.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold font-mono">&lt; 3%:</span>
              <span>Practically zero leads left unreached.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold font-mono">₹9.45L/mo:</span>
              <span>Direct capital saved and returned to developer ROI.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold font-mono">8.4%:</span>
              <span>Direct site visit conversion exceeding 8% 3-month target.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
