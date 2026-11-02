import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  UserCheck,
  Phone,
  ChevronRight,
} from 'lucide-react';
import { SALES_EXECUTIVES } from '../../data/executivesData';
import { useBookingStore } from '../../store/useBookingStore';
import { useLeadStore } from '../../store/useLeadStore';
import { HandoverDossier } from './HandoverDossier';
import { SiteVisitBooking } from '../../types/booking';

interface ExecutiveWorkspaceProps {
  onOpenWhatsAppSim?: () => void;
}

export const ExecutiveWorkspace: React.FC<ExecutiveWorkspaceProps> = ({ onOpenWhatsAppSim }) => {
  const { bookings, updateBookingStatus } = useBookingStore();
  const { leads } = useLeadStore();

  const [selectedExecutiveId, setSelectedExecutiveId] = useState<string>('EXEC-01');
  const [selectedBooking, setSelectedBooking] = useState<SiteVisitBooking | null>(
    bookings.find((b) => b.assignedExecutiveId === 'EXEC-01') || bookings[0] || null
  );

  const activeExecutive =
    SALES_EXECUTIVES.find((e) => e.id === selectedExecutiveId) || SALES_EXECUTIVES[0];

  // Bookings assigned to this specific executive
  const executiveBookings = bookings.filter((b) => b.assignedExecutiveId === activeExecutive.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Workspace Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E6E4DF] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#C5A059] font-mono text-xs uppercase tracking-wider font-bold">
              Sales Staff Cockpit
            </span>
            <span className="bg-emerald-50 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
              11 Named Advisors
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#111418] mt-1">
            Executive Site Visit &amp; Handover Desk
          </h2>
          <p className="text-xs text-gray-500">
            Dedicated queues, automated AI qualification summaries, and verified show-up tracking.
          </p>
        </div>

        {/* Advisor Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">
            Active Sales Advisor:
          </label>
          <select
            value={selectedExecutiveId}
            onChange={(e) => {
              setSelectedExecutiveId(e.target.value);
              const firstBooking = bookings.find((b) => b.assignedExecutiveId === e.target.value);
              setSelectedBooking(firstBooking || null);
            }}
            className="text-xs font-bold bg-[#F8F7F4] border border-[#E6E4DF] rounded-xl px-3 py-2 text-[#111418] focus:ring-1 focus:ring-[#C5A059] focus:outline-none"
          >
            {SALES_EXECUTIVES.map((exec) => (
              <option key={exec.id} value={exec.id}>
                {exec.name} ({exec.role.split('&')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Advisor Profile Summary */}
      <div className="bg-[#111418] text-white rounded-2xl p-6 shadow-md border border-[#2A3038] grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div className="flex items-center gap-4 md:col-span-2">
          <img
            src={activeExecutive.avatar}
            alt={activeExecutive.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#C5A059]"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg font-bold text-white">{activeExecutive.name}</h3>
              <span className="bg-[#C5A059]/20 text-[#C5A059] text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold">
                {activeExecutive.id}
              </span>
            </div>
            <p className="text-xs text-gray-400">{activeExecutive.role}</p>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1 font-mono">
              <Phone className="w-3 h-3 text-[#C5A059]" />
              <span>{activeExecutive.phone}</span>
              <span>•</span>
              <span className="uppercase text-[10px] font-sans bg-white/10 px-1.5 py-0.5 rounded">
                {activeExecutive.languages.join(' / ')}
              </span>
            </div>
          </div>
        </div>

        {/* Advisor KPI 1: Show-Up Rate */}
        <div className="bg-[#1A1E24] p-4 rounded-xl border border-[#2A3038]">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
            Tour Show-Up Rate
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-[#25D366]">
              {activeExecutive.showUpRate}%
            </span>
            <span className="text-[10px] text-gray-400">({activeExecutive.totalVisited} visited)</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-medium block mt-0.5">
            ↑ +18% vs unrecorded baseline
          </span>
        </div>

        {/* Advisor KPI 2: Active Assigned Leads */}
        <div className="bg-[#1A1E24] p-4 rounded-xl border border-[#2A3038]">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
            Upcoming Site Tours
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-[#C5A059]">
              {executiveBookings.length}
            </span>
            <span className="text-[10px] text-gray-400">tours booked</span>
          </div>
          <span className="text-[10px] text-gray-400 block mt-0.5">
            Zero double-booking guarantee
          </span>
        </div>
      </div>

      {/* Main Content Layout: Left Queue vs Right Handover Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Assigned Appointments Queue (4 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#C5A059]" />
              Scheduled Tours for {activeExecutive.name} ({executiveBookings.length})
            </h3>
          </div>

          {executiveBookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-[#E6E4DF] text-gray-400">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold">No visits currently booked for this advisor.</p>
              <p className="text-[11px] text-gray-400 mt-1">
                New inquiries assigned via round-robin will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {executiveBookings.map((b) => {
                const isSelected = selectedBooking?.bookingId === b.bookingId;

                return (
                  <div
                    key={b.bookingId}
                    onClick={() => setSelectedBooking(b)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-white border-[#C5A059] shadow-md ring-1 ring-[#C5A059]'
                        : 'bg-white border-[#E6E4DF] hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#111418]">{b.leadName}</span>
                          <span className="text-[10px] font-mono text-gray-400">#{b.bookingId}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                          <span className="font-semibold text-[#A37F38]">{b.projectName}</span>
                          <span>•</span>
                          <span>{b.configurationWanted}</span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          b.status === 'Visited'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : b.status === 'No-Show'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-mono">
                      <span className="flex items-center gap-1 font-bold text-[#111418]">
                        <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                        {b.date} • {b.timeString}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Full Handover Dossier (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedBooking ? (
            <HandoverDossier
              booking={selectedBooking}
              lead={leads.find((l) => l.phone === selectedBooking.leadPhone)}
              onUpdateStatus={updateBookingStatus}
              onOpenWhatsAppSim={onOpenWhatsAppSim}
            />
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#E6E4DF] text-gray-400">
              <UserCheck className="w-10 h-10 mx-auto mb-2 text-[#C5A059] opacity-70" />
              <h4 className="font-serif text-base font-bold text-[#111418]">
                Select an Appointment Slot
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Choose any site tour from the left column to view the complete client transcript and
                AI dossier.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
