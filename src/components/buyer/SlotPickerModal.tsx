import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, CheckCircle2, AlertTriangle, User, Phone } from 'lucide-react';
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

  // Distinct dates available
  const availableDates = Array.from(new Set(slots.map((s) => s.date))).slice(0, 5);
  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0] || '');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [holdCountdown, setHoldCountdown] = useState<number>(180);
  const [isHolding, setIsHolding] = useState<boolean>(false);

  // Form inputs
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [configuration, setConfiguration] = useState<'2 BHK' | '3 BHK'>('3 BHK');
  const [dpdpConsent, setDpdpConsent] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Synchronize initial date
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  // Countdown timer for active hold
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isHolding && holdCountdown > 0) {
      interval = setInterval(() => {
        setHoldCountdown((prev) => prev - 1);
      }, 1000);
    } else if (holdCountdown === 0) {
      setIsHolding(false);
      setSelectedSlotId('');
      setErrorMessage('Hold expired. Please select a slot again to re-reserve.');
    }
    return () => clearInterval(interval);
  }, [isHolding, holdCountdown]);

  if (!isOpen) return null;

  // Filter slots for active date and project
  const daySlots = slots.filter((s) => s.projectId === projectId && s.date === selectedDate);

  const handleSelectSlot = (slot: SiteVisitSlot) => {
    setErrorMessage('');
    const remainingCap = slot.maxCapacity - slot.confirmedCount - slot.activeHoldCount;
    if (remainingCap <= 0 && slot.slotId !== selectedSlotId) {
      setErrorMessage('This slot is fully reserved. Please pick another time slot.');
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('Please enter your phone number first to temporarily hold this slot.');
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

    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!selectedSlotId) {
      setErrorMessage('Please select an available appointment slot.');
      return;
    }
    if (!dpdpConsent) {
      setErrorMessage('DPDP consent is required to confirm your visit pass.');
      return;
    }

    const tempLeadId = `LD-${Math.floor(58300 + Math.random() * 1000)}`;
    const result = onConfirmBooking(
      selectedSlotId,
      tempLeadId,
      name,
      phone,
      projectId,
      configuration
    );

    if (result.success) {
      onBookingSuccess();
      onClose();
    } else {
      setErrorMessage(result.error || 'Failed to book slot.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92dvh] flex flex-col shadow-2xl border border-[#E6E4DF] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#111418] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#2A3038] flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#C5A059] text-[10px] sm:text-xs font-mono uppercase tracking-widest font-semibold">
                Atomic Free Slot Booking
              </span>
              <span className="bg-emerald-950 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-800">
                Zero Double-Booking
              </span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold mt-1 text-white">
              {projectFact.commercialName}
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-400 truncate max-w-xs sm:max-w-md">
              {projectFact.location.address}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 transition-colors cursor-pointer flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleBookingSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 flex-1 overflow-y-auto">
          {/* Active Hold Alert Banner */}
          {isHolding && (
            <div className="bg-[#FBF7EE] border border-[#C5A059]/40 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-[#735722]">
                <Clock className="w-4 h-4 text-[#C5A059] animate-spin" />
                <span>Slot reserved for you: Complete details in</span>
              </div>
              <span className="font-mono font-bold text-sm bg-white px-2.5 py-1 rounded-md text-[#A37F38] border border-[#C5A059]/30">
                {Math.floor(holdCountdown / 60)}:{(holdCountdown % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}

          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Buyer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Your Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Hardik Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#E6E4DF] rounded-xl focus:ring-1 focus:ring-[#C5A059] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Mobile Number (for Pass & Maps Pin)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98250 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#E6E4DF] rounded-xl focus:ring-1 focus:ring-[#C5A059] focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Unit Preference */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Apartment Configuration Wanted
            </label>
            <div className="grid grid-cols-2 gap-3">
              {projectFact.configurations.map((c) => (
                <button
                  type="button"
                  key={c.type}
                  onClick={() => setConfiguration(c.type)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    configuration === c.type
                      ? 'border-[#C5A059] bg-[#FBF7EE] shadow-xs'
                      : 'border-[#E6E4DF] bg-white hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs text-[#111418] block">{c.type} Luxury</span>
                    <span className="text-[11px] text-gray-500">{c.carpetAreaSqFt}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#A37F38]">{c.priceRange.split('to')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
              Select Visit Date
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {availableDates.map((dateStr) => {
                const dateObj = new Date(dateStr);
                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = dateObj.getDate();
                const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
                const isSelected = selectedDate === dateStr;

                return (
                  <button
                    type="button"
                    key={dateStr}
                    onClick={() => {
                      setSelectedDate(dateStr);
                      setSelectedSlotId('');
                      setIsHolding(false);
                    }}
                    className={`flex-1 min-w-[70px] p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-[#111418] bg-[#111418] text-white shadow-md'
                        : 'border-[#E6E4DF] bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="block text-[10px] uppercase font-bold tracking-wider opacity-80">
                      {dayName}
                    </span>
                    <span className="block text-base font-bold my-0.5">{dayNum}</span>
                    <span className="block text-[10px] opacity-80">{monthName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slot Grid */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                Available Free Slots (Capacity: 2 simultaneous visits)
              </span>
              <span className="text-[10px] text-gray-500 font-normal">
                45 mins per tour + 15m buffer
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {daySlots.map((slot) => {
                const freeCapacity = slot.maxCapacity - slot.confirmedCount - slot.activeHoldCount;
                const isSelected = selectedSlotId === slot.slotId;
                const isExhausted = freeCapacity <= 0 && !isSelected;

                return (
                  <button
                    type="button"
                    key={slot.slotId}
                    disabled={isExhausted}
                    onClick={() => handleSelectSlot(slot)}
                    className={`p-2.5 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-[#C5A059] bg-[#FBF7EE] ring-2 ring-[#C5A059]'
                        : isExhausted
                        ? 'border-gray-200 bg-gray-100/70 text-gray-400 cursor-not-allowed'
                        : 'border-[#E6E4DF] bg-white hover:border-gray-400 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{slot.timeString}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
                      ) : (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${
                            isExhausted
                              ? 'bg-gray-200 text-gray-500'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isExhausted ? 'Full' : `${freeCapacity} Left`}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 block mt-0.5">{slot.displayTime}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DPDP Act 2023 Consent Checkbox */}
          <div className="bg-[#F8F7F4] rounded-xl p-3 border border-[#E6E4DF]">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={dpdpConsent}
                onChange={(e) => setDpdpConsent(e.target.checked)}
                className="mt-0.5 rounded text-[#C5A059] focus:ring-[#C5A059] w-4 h-4"
              />
              <span className="text-[11px] text-gray-600 leading-relaxed">
                <strong>DPDP Act 2023 Consent:</strong> I agree to receive site visit confirmations,
                location pins, and 24h &amp; 2h pre-visit reminders from Company A. I understand I can
                opt out anytime by replying STOP.
              </span>
            </label>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedSlotId}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all ${
                selectedSlotId
                  ? 'bg-[#111418] hover:bg-[#2A3038] text-white hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
              {t.confirmBookingButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
