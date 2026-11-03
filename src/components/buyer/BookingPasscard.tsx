import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Download,
  CheckCircle2,
  BellRing,
  UserCheck,
  QrCode,
  PartyPopper,
  Sun,
  Smartphone,
} from 'lucide-react';
import { SiteVisitBooking } from '../../types/booking';
import { LanguageCode } from '../../types/lead';
import { MASTER_FACT_SHEET } from '../../data/factSheetData';
import { downloadCalendarInvite } from '../../utils/calendarExport';
import { TRANSLATIONS } from '../../data/translations';
import { sounds } from '../../utils/soundEffects';

interface BookingPasscardProps {
  booking: SiteVisitBooking;
  language: LanguageCode;
  onDismiss?: () => void;
  onOpenWhatsAppSim?: () => void;
}

// CSS confetti — 12 pieces burst from bottom of header
const ConfettiBurst: React.FC = () => (
  <div className="absolute bottom-0 left-0 right-0 h-0 overflow-visible pointer-events-none z-20">
    {Array.from({ length: 12 }).map((_, i) => (
      <span key={i} className="confetti-piece" style={{ animationDelay: `${i * 10}ms` }} />
    ))}
  </div>
);

export const BookingPasscard: React.FC<BookingPasscardProps> = ({
  booking,
  language,
  onDismiss,
  onOpenWhatsAppSim,
}) => {
  const t = TRANSLATIONS[language];
  const projectFact = MASTER_FACT_SHEET[booking.projectId];
  const [showCelebration, setShowCelebration] = useState(true);
  const [celebrationRing, setCelebrationRing] = useState(true);

  // Auto-hide confetti after 1.5s
  useEffect(() => {
    sounds.playSuccess();
    const t1 = setTimeout(() => setShowCelebration(false), 1500);
    const t2 = setTimeout(() => setCelebrationRing(false), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="animate-passcard-in max-w-xl mx-auto my-4">
      {/* Celebration Ring */}
      {celebrationRing && (
        <div className="flex justify-center mb-2">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-[#C5A059] animate-celebration-ring" />
            <PartyPopper className="w-6 h-6 text-[#C5A059] animate-bounce" />
          </div>
        </div>
      )}

      {/* Outer glow wrapper — dark luxury card */}
      <div className="rounded-2xl shadow-2xl overflow-hidden border-2 border-[#C5A059]/50 bronze-glow">
        {/* Boarding Pass Header — dark gradient with shimmer + QR-code-like dot pattern */}
        <div className="relative bg-gradient-to-br from-[#111418] via-[#1A1E24] to-[#0D1117] text-white p-5 flex items-center justify-between border-b border-[#2A3038] overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#C5A059 1px, transparent 1px)',
              backgroundSize: '8px 8px',
            }}
          />
          <div className="absolute inset-0 animate-shimmer pointer-events-none" />

          {/* Confetti burst */}
          {showCelebration && <ConfettiBurst />}

          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-[#C5A059] font-mono text-[10px] uppercase tracking-widest font-bold">
                {t.passcardTitle}
              </span>
              <span className="bg-[#1B7A4D]/20 text-[#25D366] text-[10px] px-2 py-0.5 rounded-full border border-[#1B7A4D]/50 font-semibold flex items-center gap-1 animate-badge-pop">
                <CheckCircle2 className="w-3 h-3" /> Confirmed
              </span>
            </div>
            <h3 className="font-serif text-xl font-bold mt-1 text-white">{booking.projectName}</h3>
            <p className="text-xs text-gray-400 font-mono mt-0.5">Pass #{booking.bookingId}</p>
          </div>

          <div className="relative z-10 text-right">
            <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">
              GujRERA Number
            </span>
            <span className="text-xs font-mono text-[#C5A059] font-bold block max-w-[150px] truncate">
              {projectFact.reraNumber}
            </span>
            <div className="mt-2 w-14 h-14 rounded-xl bg-[#2A3038] border border-[#C5A059]/30 flex flex-col items-center justify-center ml-auto gap-1">
              <QrCode className="w-7 h-7 text-[#C5A059]/70" />
              <span className="text-[8px] text-gray-500 font-mono leading-none">Security Pass</span>
            </div>
          </div>
        </div>

        {/* Decorative Cut-Out Circles — boarding pass tear line */}
        <div className="relative flex items-center bg-[#111418] px-4 py-1.5">
          <div className="absolute -left-3 w-6 h-6 rounded-full bg-[#F8F7F4]" />
          <div className="flex-1 border-t-2 border-dashed border-[#C5A059]/30 mx-4" />
          <div className="absolute -right-3 w-6 h-6 rounded-full bg-[#F8F7F4]" />
        </div>

        {/* Body Details — white card */}
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
              <span className="text-xs font-bold text-[#A37F38] block mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] inline-block" />
                {booking.configurationWanted} Luxury
              </span>
              <span className="text-[10px] text-gray-500 block">Reserved Tour</span>
            </div>
          </div>

          {/* Dedicated Sales Advisor Row */}
          <div className="bg-gradient-to-r from-[#F8F7F4] to-[#FBF7EE] p-3.5 rounded-xl border border-[#E6E4DF] flex items-center justify-between card-glow-hover">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#111418] text-[#C5A059] flex items-center justify-center font-bold text-sm shadow-md">
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
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-1 rounded-md border border-emerald-200">
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

          {/* Automated Reminders Schedule & Weather Pill */}
          <div className="bg-[#FBF7EE] border border-[#C5A059]/30 rounded-xl p-3 text-xs text-[#735722] space-y-2">
            <div className="flex items-start gap-2.5">
              <BellRing className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong>Automated Reminders Scheduled:</strong> You will receive directions 24 hours prior
                and parking gate access 2 hours before your visit on WhatsApp.
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-[#C5A059]/20 text-[10px]">
              <span className="flex items-center gap-1 text-amber-900 font-medium">
                <Sun className="w-3 h-3 text-amber-500" />
                Ahmedabad Forecast: 34°C · Clear &amp; Sunny for walkthrough
              </span>
              {onOpenWhatsAppSim && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenWhatsAppSim();
                  }}
                  className="text-xs font-bold text-[#8F6C27] hover:underline flex items-center gap-1"
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Preview in WA Simulator</span>
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <a
              href={booking.locationPin.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.playClick()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#111418] hover:bg-[#2A3038] text-white shadow-xs transition-all hover:scale-[1.02] active:scale-95 btn-ripple"
            >
              <MapPin className="w-4 h-4 text-[#C5A059]" />
              {t.getDirections}
              <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
            </a>

            <button
              onClick={() => {
                sounds.playClick();
                downloadCalendarInvite(booking);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-gray-50 text-[#111418] border border-[#E6E4DF] shadow-xs transition-all hover:scale-[1.02] active:scale-95 btn-ripple"
            >
              <Download className="w-4 h-4 text-[#C5A059]" />
              {t.addToCalendar}
            </button>
          </div>

          {onDismiss && (
            <div className="text-center pt-1">
              <button
                onClick={() => {
                  sounds.playClick();
                  onDismiss();
                }}
                className="text-xs text-gray-500 hover:text-gray-800 underline underline-offset-2 transition-colors"
              >
                Back to Chat Concierge
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
