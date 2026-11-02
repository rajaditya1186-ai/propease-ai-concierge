import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Download,
  CheckCircle2,
  BellRing,
  UserCheck,
} from 'lucide-react';
import { SiteVisitBooking } from '../../types/booking';
import { LanguageCode } from '../../types/lead';
import { MASTER_FACT_SHEET } from '../../data/factSheetData';
import { downloadCalendarInvite } from '../../utils/calendarExport';
import { TRANSLATIONS } from '../../data/translations';

interface BookingPasscardProps {
  booking: SiteVisitBooking;
  language: LanguageCode;
  onDismiss?: () => void;
}

export const BookingPasscard: React.FC<BookingPasscardProps> = ({
  booking,
  language,
  onDismiss,
}) => {
  const t = TRANSLATIONS[language];
  const projectFact = MASTER_FACT_SHEET[booking.projectId];

  return (
    <div className="bg-white rounded-2xl border-2 border-[#C5A059]/40 shadow-xl overflow-hidden max-w-xl mx-auto my-4 transition-all">
      {/* Boarding Pass Header */}
      <div className="bg-[#111418] text-white p-5 flex items-center justify-between border-b border-[#2A3038]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#C5A059] font-mono text-[10px] uppercase tracking-widest font-bold">
              {t.passcardTitle}
            </span>
            <span className="bg-[#1B7A4D]/20 text-[#25D366] text-[10px] px-2 py-0.5 rounded-full border border-[#1B7A4D]/50 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Confirmed
            </span>
          </div>
          <h3 className="font-serif text-xl font-bold mt-1 text-white">{booking.projectName}</h3>
          <p className="text-xs text-gray-400 font-mono">Pass #{booking.bookingId}</p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">
            GujRERA Number
          </span>
          <span className="text-xs font-mono text-[#C5A059] font-bold block max-w-[140px] truncate">
            {projectFact.reraNumber}
          </span>
        </div>
      </div>

      {/* Decorative Cut-Out Circles for Boarding Pass Aesthetic */}
      <div className="relative flex items-center justify-between px-4 py-1 bg-[#111418]">
        <div className="w-4 h-4 rounded-full bg-[#F8F7F4] -ml-6 border-r border-[#C5A059]/40"></div>
        <div className="w-full border-t border-dashed border-[#C5A059]/40 mx-2"></div>
        <div className="w-4 h-4 rounded-full bg-[#F8F7F4] -mr-6 border-l border-[#C5A059]/40"></div>
      </div>

      {/* Body Details */}
      <div className="p-6 space-y-5 bg-white">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4 border-b border-[#E6E4DF]">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
              Guest Name
            </span>
            <span className="text-sm font-bold text-[#111418] block mt-0.5">{booking.leadName}</span>
            <span className="text-xs text-gray-500 font-mono">{booking.leadPhone}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
              Date &amp; Slot
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#111418] mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{booking.date}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600 font-medium mt-0.5">
              <Clock className="w-3 h-3 text-gray-400" />
              <span>{booking.timeString}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
              Unit Configuration
            </span>
            <span className="text-xs font-bold text-[#A37F38] block mt-0.5">
              {booking.configurationWanted} Luxury
            </span>
            <span className="text-[10px] text-gray-500 block">Reserved Tour</span>
          </div>
        </div>

        {/* Dedicated Sales Advisor Row */}
        <div className="bg-[#F8F7F4] p-3.5 rounded-xl border border-[#E6E4DF] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#111418] text-[#C5A059] flex items-center justify-center font-bold text-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                {t.assignedAdvisor}
              </span>
              <span className="text-xs font-bold text-[#111418] block">
                {booking.assignedExecutiveName}
              </span>
              <span className="text-[10px] text-gray-500">
                Company A Senior Real Estate Advisor
              </span>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-1 rounded-md">
            Assigned
          </span>
        </div>

        {/* Location & Google Maps Pin */}
        <div className="space-y-1">
          <div className="flex items-start gap-2 text-xs text-gray-700">
            <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#111418]">{booking.locationPin.landmark}</strong>: {booking.locationPin.address}
            </div>
          </div>
        </div>

        {/* Automated Reminders Schedule */}
        <div className="bg-[#FBF7EE] border border-[#C5A059]/30 rounded-xl p-3 text-xs text-[#735722] flex items-start gap-2.5">
          <BellRing className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong>Automated Reminders Scheduled:</strong> You will receive directions 24 hours prior
            and parking gate access 2 hours before your visit on WhatsApp.
          </div>
        </div>

        {/* Action Buttons: Google Maps & Calendar Download */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <a
            href={booking.locationPin.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#111418] hover:bg-[#2A3038] text-white shadow-xs transition-colors"
          >
            <MapPin className="w-4 h-4 text-[#C5A059]" />
            {t.getDirections}
            <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
          </a>

          <button
            onClick={() => downloadCalendarInvite(booking)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-gray-50 text-[#111418] border border-[#E6E4DF] shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-[#C5A059]" />
            {t.addToCalendar}
          </button>
        </div>

        {onDismiss && (
          <div className="text-center pt-1">
            <button
              onClick={onDismiss}
              className="text-xs text-gray-500 hover:text-gray-800 underline underline-offset-2"
            >
              Back to Chat Concierge
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
