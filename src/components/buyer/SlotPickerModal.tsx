import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, CheckCircle2, AlertTriangle, User, Phone, Lock } from 'lucide-react';
import { SiteVisitSlot, ProjectId } from '../../types/booking';
import { LanguageCode } from '../../types/lead';
import { MASTER_FACT_SHEET } from '../../data/factSheetData';
import { TRANSLATIONS } from '../../data/translations';

interface SlotPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: ProjectId;
  slots: SiteVisitSlot[];
  language: LanguageCode;
  onHoldSlot: (slotId: string, phone: string) => { success: boolean; reason?: string };
  onConfirmBooking: (
    slotId: string,
    leadId: string,
    leadName: string,
    leadPhone: string,
    projectId: ProjectId,
    configuration: '2 BHK' | '3 BHK'
  ) => { success: boolean; error?: string };
  onBookingSuccess: () => void;
}

export const SlotPickerModal: React.FC<SlotPickerModalProps> = ({
  isOpen,
  onClose,
  projectId,
  slots,
  language,
  onHoldSlot,
  onConfirmBooking,
  onBookingSuccess,
}) => {
  const t = TRANSLATIONS[language];
  const projectFact = MASTER_FACT_SHEET[projectId];

  const availableDates = Array.from(new Set(slots.map((s) => s.date))).slice(0, 5);
  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0] || '');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [holdCountdown, setHoldCountdown] = useState<number>(180);
  const [isHolding, setIsHolding] = useState<boolean>(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [configuration, setConfiguration] = useState<'2 BHK' | '3 BHK'>('3 BHK');
  const [dpdpConsent, setDpdpConsent] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  // urgent flag change serves as the shake re-trigger mechanism via React key prop

  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  // Hold countdown timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isHolding && holdCountdown > 0) {
      interval = setInterval(() => setHoldCountdown((p) => p - 1), 1000);
    } else if (holdCountdown === 0) {
      setIsHolding(false);
      setSelectedSlotId('');
      setErrorMessage('Hold expired. Please select a slot again to re-reserve.');
    }
    return () => clearInterval(interval);
  }, [isHolding, holdCountdown]);

  // Keyboard accessibility: Escape to dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const daySlots = slots.filter((s) => s.projectId === projectId && s.date === selectedDate);

  const handleSelectSlot = (slot: SiteVisitSlot) => {
    setErrorMessage('');
    const remaining = slot.maxCapacity - slot.confirmedCount - slot.activeHoldCount;
    if (remaining <= 0 && slot.slotId !== selectedSlotId) {
      setErrorMessage('This slot is fully reserved. Please pick another time.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please enter your phone number first to hold this slot.');
      return;
    }
    const holdResult = onHoldSlot(slot.slotId, phone);
    if (holdResult.success) {
      setSelectedSlotId(slot.slotId);
      setIsHolding(true);
      setHoldCountdown(180);
    } else {
      setErrorMessage(holdResult.reason || 'Could not hold slot. Please try another time.');
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!name.trim()) { setErrorMessage('Please enter your full name.'); return; }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) { setErrorMessage('Please enter a valid 10-digit mobile number.'); return; }
    if (!selectedSlotId) { setErrorMessage('Please select an available appointment slot.'); return; }
    if (!dpdpConsent) { setErrorMessage('DPDP consent is required to confirm your visit.'); return; }

    const tempLeadId = `LD-${Math.floor(58300 + Math.random() * 1000)}`;
    const result = onConfirmBooking(selectedSlotId, tempLeadId, name, phone, projectId, configuration);
    if (result.success) { onBookingSuccess(); onClose(); }
    else { setErrorMessage(result.error || 'Failed to confirm booking. Please try again.'); }
  };

  const urgent = holdCountdown < 30;
  const totalSecs = 180;
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = circ * (holdCountdown / totalSecs);

  return (
    <div className="fixed inset-0 z-50 backdrop-dark flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[94dvh] flex flex-col shadow-2xl border border-[#E6E4DF] overflow-hidden animate-scale-in">

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#111418] to-[#1A1E24] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#2A3038] flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#C5A059] text-[10px] font-mono uppercase tracking-widest font-semibold">
                Atomic Slot Booking
              </span>
              <span className="bg-emerald-950 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-800 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Zero Double-Booking
              </span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-white">{projectFact.commercialName}</h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{projectFact.location.address}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors flex-shrink-0"
            aria-label="Close booking modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleBookingSubmit} className="p-4 sm:p-5 space-y-4 flex-1 overflow-y-auto">

          {/* Active Hold Banner */}
          {isHolding && (
            <div
              className={`border-2 rounded-xl p-3 flex items-center gap-4 transition-all ${
                urgent
                  ? 'bg-rose-50 border-rose-300 animate-shake'
                  : 'bg-[#FBF7EE] border-[#C5A059]/50 bronze-glow'
              }`}
              key={urgent ? 'urgent' : 'normal'}
            >
              {/* SVG countdown ring */}
              <div className="relative flex-shrink-0 w-14 h-14 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r={r} fill="none" stroke={urgent ? '#FEE2E2' : '#E6E4DF'} strokeWidth="4" />
                  <circle
                    cx="25" cy="25" r={r} fill="none"
                    stroke={urgent ? '#B84233' : '#C5A059'}
                    strokeWidth="4"
                    strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 1s linear, stroke 0.5s' }}
                  />
                </svg>
                <span className={`font-mono font-bold text-xs relative z-10 tabular-nums ${urgent ? 'text-rose-600' : 'text-[#A37F38]'}`}>
                  {Math.floor(holdCountdown / 60)}:{(holdCountdown % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div>
                <p className={`text-xs font-bold ${urgent ? 'text-rose-700' : 'text-[#735722]'}`}>
                  {urgent ? '⚠ Slot expiring — confirm now!' : 'Slot held exclusively for you'}
                </p>
                <p className={`text-[11px] mt-0.5 ${urgent ? 'text-rose-600' : 'text-[#9A7030]'}`}>
                  {urgent ? 'Under 30 seconds remaining' : 'Complete the form below to lock your visit'}
                </p>
              </div>
            </div>
          )}

          {/* Error banner */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-xs flex items-center gap-2 animate-fade-up">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Buyer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Hardik Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-[#E6E4DF] rounded-xl focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059] focus:outline-none transition-all bg-white hover:border-gray-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Mobile Number <span className="text-gray-400 font-normal">(for pass & maps pin)</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98250 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-[#E6E4DF] rounded-xl focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059] focus:outline-none transition-all bg-white hover:border-gray-300 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Configuration selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Apartment Configuration</label>
            <div className="grid grid-cols-2 gap-2">
              {projectFact.configurations.map((c) => (
                <button
                  type="button"
                  key={c.type}
                  onClick={() => setConfiguration(c.type)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    configuration === c.type
                      ? 'border-[#C5A059] bg-[#FBF7EE] bronze-glow'
                      : 'border-[#E6E4DF] bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#111418]">{c.type} Luxury</span>
                    {configuration === c.type && (
                      <CheckCircle2 className="w-4 h-4 text-[#C5A059] animate-scale-in" />
                    )}
                  </div>
                  <span className="text-[11px] text-gray-500 block mt-0.5">{c.carpetAreaSqFt}</span>
                  <span className="text-[11px] text-[#A37F38] font-semibold block">{c.priceRange.split('to')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
              Select Visit Date
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {availableDates.map((dateStr) => {
                const d = new Date(dateStr);
                const isSelected = selectedDate === dateStr;
                return (
                  <button
                    type="button"
                    key={dateStr}
                    onClick={() => { setSelectedDate(dateStr); setSelectedSlotId(''); setIsHolding(false); }}
                    className={`flex-1 min-w-[68px] p-2.5 rounded-xl border text-center transition-all flex-shrink-0 ${
                      isSelected
                        ? 'border-[#111418] bg-[#111418] text-white shadow-md scale-105'
                        : 'border-[#E6E4DF] bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="block text-[10px] uppercase font-bold tracking-wider opacity-80">
                      {d.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className="block text-lg font-bold my-0.5 tabular-nums">{d.getDate()}</span>
                    <span className="block text-[10px] opacity-70">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time slot grid */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                Available Slots
              </span>
              <span className="text-[10px] text-gray-400 font-normal">45 min tour · 15 min buffer</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {daySlots.map((slot) => {
                const free = slot.maxCapacity - slot.confirmedCount - slot.activeHoldCount;
                const isSelected = selectedSlotId === slot.slotId;
                const isExhausted = free <= 0 && !isSelected;
                const fillPct = Math.round(((slot.confirmedCount + slot.activeHoldCount) / slot.maxCapacity) * 100);
                const isLast = free === 1;

                return (
                  <button
                    type="button"
                    key={slot.slotId}
                    disabled={isExhausted}
                    onClick={() => handleSelectSlot(slot)}
                    className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? 'border-[#C5A059] bg-[#FBF7EE] ring-2 ring-[#C5A059]/60'
                        : isExhausted
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60'
                        : isLast
                        ? 'border-amber-300 bg-amber-50 hover:border-amber-400'
                        : 'border-[#E6E4DF] bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">{slot.timeString}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
                      ) : (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                          isExhausted ? 'bg-gray-200 text-gray-500'
                          : isLast ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {isExhausted ? 'Full' : isLast ? '⚡ Last' : `${free} free`}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 block">{slot.displayTime}</span>

                    {/* Capacity fill bar */}
                    {!isExhausted && (
                      <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            fillPct > 75 ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DPDP Consent */}
          <div className="bg-[#F8F7F4] rounded-xl p-3.5 border border-[#E6E4DF]">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={dpdpConsent}
                onChange={(e) => setDpdpConsent(e.target.checked)}
                className="mt-0.5 rounded w-4 h-4 cursor-pointer flex-shrink-0"
              />
              <span className="text-[11px] text-gray-600 leading-relaxed">
                <strong className="text-gray-800">DPDP Act 2023 Consent:</strong> I agree to receive site visit confirmations, location pins, and pre-visit reminders from Company A. I can opt out anytime by replying <code className="bg-gray-200 px-1 rounded text-[10px]">STOP</code>.
              </span>
            </label>
          </div>

          {/* Submit actions */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedSlotId}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm btn-ripple ${
                selectedSlotId
                  ? 'bg-gradient-to-r from-[#C5A059] to-[#A37F38] text-[#111418] hover:brightness-105 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {selectedSlotId ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  🔒 Lock My Slot
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t.confirmBookingButton}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Limit note */}
        <div className="px-5 py-2 bg-[#F8F7F4] border-t border-[#E6E4DF] text-[10px] text-gray-400 text-center flex-shrink-0">
          💡 Slots are held for 3 minutes. Unconfirmed holds are auto-released.
        </div>
      </div>
    </div>
  );
};
