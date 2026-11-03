import React from 'react';
import {
  Phone,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  MessageSquare,
} from 'lucide-react';
import { SiteVisitBooking, BookingStatus } from '../../types/booking';
import { Lead } from '../../types/lead';
import { sounds } from '../../utils/soundEffects';

interface HandoverDossierProps {
  booking: SiteVisitBooking;
  lead?: Lead;
  onUpdateStatus: (bookingId: string, status: BookingStatus) => void;
  onOpenWhatsAppSim?: () => void;
}

export const HandoverDossier: React.FC<HandoverDossierProps> = ({
  booking,
  lead,
  onUpdateStatus,
  onOpenWhatsAppSim,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E6E4DF] shadow-sm overflow-hidden space-y-5 p-4 sm:p-6">
      {/* Dossier Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6E4DF] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider bg-[#C5A059]/20 text-[#8F6C27] px-2 py-0.5 rounded-full font-mono">
              Warm Lead Handover Dossier
            </span>
            <span className="text-xs text-gray-400 font-mono">Pass #{booking.bookingId}</span>
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#111418] mt-1">{booking.leadName}</h3>
          <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500 font-mono mt-0.5 flex-wrap">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#C5A059]" />
              {booking.leadPhone}
            </span>
            <span>•</span>
            <span>Project: <strong>{booking.projectName}</strong></span>
          </div>
        </div>

        {/* Visit Outcome Controller */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1.5 bg-[#F8F7F4] p-1.5 rounded-xl border border-[#E6E4DF] w-full sm:w-auto">
          <button
            onClick={() => {
              sounds.playSuccess();
              onUpdateStatus(booking.bookingId, 'Visited');
            }}
            className={`flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              booking.status === 'Visited'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">Mark Show (Visited)</span>
            <span className="sm:hidden">Show</span>
          </button>

          <button
            onClick={() => {
              sounds.playAlert();
              onUpdateStatus(booking.bookingId, 'No-Show');
            }}
            className={`flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              booking.status === 'No-Show'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-rose-50 hover:text-rose-800'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">No-Show</span>
            <span className="sm:hidden">No-Show</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onUpdateStatus(booking.bookingId, 'Rescheduled');
            }}
            className={`flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              booking.status === 'Rescheduled'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-amber-50 hover:text-amber-800'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">Reschedule</span>
            <span className="sm:hidden">Reschedule</span>
          </button>
        </div>
      </div>

      {/* AI-Generated Qualification Summary (3-Bullet Executive Digest) */}
      <div className="bg-[#FBF7EE] border border-[#C5A059]/40 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#735722] uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span>AI Lead Qualification Summary</span>
        </div>
        <ul className="space-y-1.5 text-xs text-[#523E17] leading-relaxed list-disc list-inside">
          <li>
            <strong>High Intent Buyer:</strong> Inquired about <strong>{booking.configurationWanted}</strong> flat layout, confirmed budget alignment, and requested morning walkthrough.
          </li>
          <li>
            <strong>SLA &amp; Engagement:</strong> Engaged via {lead?.source || 'Property portal'} with first response under 20 seconds. Zero drop-off during slot selection.
          </li>
          <li>
            <strong>Pre-Tour Note:</strong> Client emphasized interest in balcony facing and covered car parking allotment.
          </li>
        </ul>
      </div>

      {/* Appointment & Staff Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-[#F8F7F4] p-3 rounded-xl border border-[#E6E4DF]">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Appointment Slot</span>
          <div className="flex items-center gap-1.5 font-bold text-[#111418] mt-1">
            <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{booking.date}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 mt-0.5">
            <Clock className="w-3 h-3" />
            <span>{booking.timeString} (45 mins)</span>
          </div>
        </div>

        <div className="bg-[#F8F7F4] p-3 rounded-xl border border-[#E6E4DF]">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Assigned Advisor</span>
          <span className="font-bold text-[#111418] block mt-1">{booking.assignedExecutiveName}</span>
          <span className="text-[10px] text-gray-500">Company A Senior Advisory</span>
        </div>

        <div className="bg-[#F8F7F4] p-3 rounded-xl border border-[#E6E4DF]">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Current Status</span>
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mt-1 ${
              booking.status === 'Visited'
                ? 'bg-emerald-100 text-emerald-800'
                : booking.status === 'No-Show'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {booking.status}
          </span>
          <span className="text-[10px] text-gray-500 block mt-0.5">
            Attendance Logged in Central CRM
          </span>
        </div>
      </div>

      {/* WhatsApp Template Communication Button */}
      {onOpenWhatsAppSim && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={onOpenWhatsAppSim}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#111418] text-[#C5A059] hover:bg-[#2A3038] transition-colors shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>View Simulated WhatsApp Pre-Visit Reminder</span>
          </button>
        </div>
      )}
    </div>
  );
};
