import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Calendar,
  AlertCircle,
  ArrowRight,
  Zap,
  Globe,
  Home,
  RotateCcw,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { ProjectId, SiteVisitBooking } from '../../types/booking';
import { LanguageCode } from '../../types/lead';
import { useChatStore } from '../../store/useChatStore';
import { useBookingStore } from '../../store/useBookingStore';
import { useFactSheetStore } from '../../store/useFactSheetStore';
import { SlotPickerModal } from './SlotPickerModal';
import { BookingPasscard } from './BookingPasscard';
import { TRANSLATIONS } from '../../data/translations';

interface BuyerChatWidgetProps {
  currentProject: ProjectId;
  language: LanguageCode;
}

// Persona demo data from official problem statement
const PERSONAS = [
  {
    name: 'Hardik Patel',
    id: 'LD-58210',
    source: 'Property portal',
    letter: 'H',
    query: 'Looking for 3 BHK flat on S.G. Highway.',
    avatarBg: 'bg-indigo-100 text-indigo-700',
    sourceBg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  },
  {
    name: 'Nidhi Shah',
    id: 'LD-58211',
    source: 'Social media ad',
    letter: 'N',
    query: 'Can I know 2 BHK price in Shela and amenities?',
    avatarBg: 'bg-pink-100 text-pink-700',
    sourceBg: 'bg-pink-50 text-pink-600 border-pink-200',
  },
  {
    name: 'Kavita Joshi',
    id: 'LD-58224',
    source: 'Hoarding call',
    letter: 'K',
    query: 'Saw the hoarding on SP Ring Road. Tell me location.',
    avatarBg: 'bg-amber-100 text-amber-700',
    sourceBg: 'bg-amber-50 text-amber-600 border-amber-200',
  },
];

// Formats AI message text: bolds **text** patterns
function formatMessageText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-[#111418]">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export const BuyerChatWidget: React.FC<BuyerChatWidgetProps> = ({
  currentProject,
  language,
}) => {
  const { messages, isTyping, sendMessage, resetChat } = useChatStore();
  const { slots, holdSlot, bookSiteVisit } = useBookingStore();
  const { factSheets } = useFactSheetStore();
  const currentFact = factSheets[currentProject];
  const t = TRANSLATIONS[language];

  const [inputQuery, setInputQuery] = useState('');
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [latestBooking, setLatestBooking] = useState<SiteVisitBooking | null>(null);
  const [showPersonas, setShowPersonas] = useState(false);
  const [activePersona, setActivePersona] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isTyping) return;
    const query = inputQuery;
    setInputQuery('');
    await sendMessage(query, currentFact);
  };

  const handleQuickChip = async (chipText: string) => {
    if (chipText === t.quickQuestions.bookVisit) {
      setIsSlotModalOpen(true);
      return;
    }
    await sendMessage(chipText, currentFact);
  };

  const handlePersonaSelect = async (persona: typeof PERSONAS[0]) => {
    setActivePersona(persona.id);
    setShowPersonas(false);
    await sendMessage(`Hi, this is ${persona.name} (${persona.id}). ${persona.query}`, currentFact);
    setTimeout(() => setActivePersona(null), 2000);
  };

  const isEmpty = messages.length === 0 && !latestBooking;

  return (
    <div className="flex flex-col h-[calc(100dvh-8rem)] sm:h-[calc(100vh-9rem)] max-w-4xl mx-auto bg-white rounded-2xl border border-[#E6E4DF] shadow-xl overflow-hidden my-1 sm:my-3 transition-all">

      {/* ── Demo Persona Tester ─────────────────────────────────────── */}
      <div className="bg-[#1A1E24] text-gray-300 border-b border-[#2A3038]">
        <div className="px-4 py-2 flex items-center justify-between">
          <button
            onClick={() => setShowPersonas(!showPersonas)}
            className="flex items-center gap-1.5 text-[11px] font-bold text-[#C5A059] uppercase tracking-wider hover:text-[#E0B96A] transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            Try a Ground Truth Persona
            <span className={`transition-transform duration-200 ${showPersonas ? 'rotate-180' : ''}`}>▾</span>
          </button>
          <span className="text-[10px] text-gray-500 hidden sm:block">Preloaded sample leads from developer brief</span>
        </div>

        {/* Collapsible persona chips */}
        <div className={`overflow-hidden transition-all duration-300 ease-out ${showPersonas ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="flex items-center gap-2 px-4 pb-2 overflow-x-auto no-scrollbar">
            {PERSONAS.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePersonaSelect(p)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap flex-shrink-0 group btn-ripple ${
                  activePersona === p.id
                    ? 'bg-[#C5A059]/20 border-[#C5A059]/50 text-[#C5A059]'
                    : 'bg-[#2A3038] border-[#3A4048] hover:border-[#C5A059]/40 hover:bg-[#C5A059]/10'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${p.avatarBg}`}>
                  {p.letter}
                </span>
                <span className="text-[11px] font-semibold text-white group-hover:text-[#C5A059] transition-colors">{p.name}</span>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${p.sourceBg}`}>{p.source}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Concierge Status Bar ───────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#111418] to-[#1A1E24] text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-[#2A3038] flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* AI Avatar */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#111418] border-2 border-[#C5A059]/50 flex items-center justify-center shrink-0 shadow-lg">
              <span className="shimmer-text text-sm font-serif font-bold">A</span>
            </div>
            {/* Online dot */}
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#111418]">
              <span className="absolute inset-0 rounded-full bg-emerald-400 status-ping" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-sm sm:text-base text-white leading-tight">
                {currentFact.commercialName}
              </h2>
              <span className="text-[9px] bg-[#C5A059]/20 text-[#C5A059] font-mono px-2 py-0.5 rounded-full border border-[#C5A059]/30">
                AI Concierge
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[180px] sm:max-w-sm">
              {currentFact.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Book Visit CTA */}
          <button
            onClick={() => setIsSlotModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#C5A059] hover:bg-[#B8904F] text-[#111418] font-bold text-xs px-3 py-2 rounded-xl shadow-xs transition-all hover:scale-[1.03] active:scale-95 glow-bronze btn-ripple"
          >
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">Book Visit</span>
            <span className="sm:hidden">Book</span>
          </button>

          {/* Reset chat */}
          <button
            onClick={resetChat}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-200 hover:bg-white/10 transition-colors"
            title="Reset conversation"
            aria-label="Reset chat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Messages Stream ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto bg-[#F8F7F4]/70 relative">

        {/* Empty State */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 py-10 space-y-6 relative">
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.035]"
              style={{ backgroundImage: 'radial-gradient(#111418 1px, transparent 1px)', backgroundSize: '22px 22px' }}
            />

            {/* Floating AI avatar */}
            <div className="relative animate-float z-10">
              <div className="absolute -inset-3 rounded-full border-2 border-[#C5A059]/30 animate-pulse-glow" />
              <div className="w-20 h-20 rounded-full bg-[#111418] border-2 border-[#C5A059]/60 flex items-center justify-center shadow-2xl">
                <span className="shimmer-text text-4xl font-serif font-bold">A</span>
              </div>
              <span className="absolute bottom-0.5 right-0.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#F8F7F4] flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse" />
              </span>
            </div>

            {/* Headline */}
            <div className="z-10 space-y-2">
              <h3 className="font-serif text-2xl font-bold text-[#111418]">Your property concierge</h3>
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                Ask anything about <strong className="text-[#111418]">{currentFact.commercialName}</strong> — pricing, amenities, availability, or book a site visit.
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap items-center gap-2 justify-center z-10">
              {[
                { icon: <Zap className="w-3 h-3" />, text: '18s response SLA' },
                { icon: <Home className="w-3 h-3" />, text: '420 Units · Ahmedabad' },
                { icon: <Globe className="w-3 h-3" />, text: 'EN · हिंदी · ગુજરાતી' },
              ].map((pill) => (
                <span
                  key={pill.text}
                  className="flex items-center gap-1.5 bg-white border border-[#E6E4DF] rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#111418] shadow-xs"
                >
                  <span className="text-[#C5A059]">{pill.icon}</span>
                  {pill.text}
                </span>
              ))}
            </div>

            <p className="text-[11px] text-gray-400 z-10 animate-pulse">
              ↓ Choose a quick question or type below
            </p>
          </div>
        )}

        {/* Message list */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Active Booking Passcard */}
          {latestBooking && (
            <BookingPasscard
              booking={latestBooking}
              language={language}
              onDismiss={() => setLatestBooking(null)}
            />
          )}

          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2.5 animate-msg-in ${isUser ? 'justify-end' : 'justify-start'}`}
                style={{ animationDelay: `${Math.min(idx * 20, 100)}ms` }}
              >
                {/* AI avatar */}
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-[#111418] text-[#C5A059] flex items-center justify-center shrink-0 mb-1 font-serif font-bold text-xs shadow-xs border border-[#C5A059]/30">
                    A
                  </div>
                )}

                <div className="group max-w-[88%] sm:max-w-[78%]">
                  {/* Message bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed relative ${
                      isUser
                        ? 'bg-gradient-to-br from-[#111418] to-[#1C2128] text-white rounded-br-sm shadow-md'
                        : 'bg-white text-[#181A1D] border border-[#E6E4DF] rounded-bl-sm shadow-xs border-l-[3px] border-l-[#C5A059]/50'
                    }`}
                  >
                    <p className="whitespace-pre-line">
                      {isUser ? msg.text : formatMessageText(msg.text)}
                    </p>

                    {/* Flagged / Handover alert */}
                    {msg.isFlaggedForAudit && (
                      <div className="mt-3 pt-2 border-t border-amber-200 text-[11px] text-amber-800 flex items-start gap-1.5 bg-amber-50 -mx-4 -mb-3 px-4 pb-3 rounded-b-2xl">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>Senior Advisor Notified.</strong> Handover ticket created for your designated sales advisor.
                        </span>
                      </div>
                    )}

                    {/* Action button inside AI bubble */}
                    {!isUser && (
                      <div className="mt-3 pt-2.5 border-t border-[#F0EDE8] flex flex-wrap items-center gap-2">
                        {/* Book Visit CTA for Price/Visit Intent */}
                        {(msg.detectedIntent === 'ASK_PRICE' || msg.detectedIntent === 'REQUEST_VISIT') && (
                          <button
                            onClick={() => setIsSlotModalOpen(true)}
                            className="flex items-center gap-1.5 bg-gradient-to-r from-[#C5A059] to-[#A37F38] hover:brightness-105 text-[#111418] text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs hover:scale-[1.01] active:scale-[0.99] btn-ripple"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Reserve Visit Slot</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                        {/* Map Directions Link */}
                        <a
                          href={`https://maps.google.com/?q=${currentFact.location.coordinates.lat},${currentFact.location.coordinates.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 transition-colors"
                        >
                          <MapPin className="w-3 h-3 text-red-500" />
                          <span>Ahmedabad GPS Pin</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Timestamp + read receipt */}
                  <div className={`flex items-center gap-1 mt-1 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] text-gray-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isUser && (
                      <span className="text-[10px] text-[#C5A059] font-bold tracking-tight">✓✓</span>
                    )}
                  </div>
                </div>

                {/* User avatar initial */}
                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-[#3E54AC] text-white flex items-center justify-center shrink-0 mb-1 font-bold text-xs shadow-xs flex-shrink-0">
                    U
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-end gap-2.5 animate-msg-in">
              <div className="w-8 h-8 rounded-full bg-[#111418] text-[#C5A059] flex items-center justify-center shrink-0 font-serif font-bold text-xs border border-[#C5A059]/30">
                A
              </div>
              <div className="bg-white border border-[#E6E4DF] border-l-[3px] border-l-[#C5A059]/50 px-5 py-3 rounded-2xl rounded-bl-sm shadow-xs relative overflow-hidden">
                <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-50" />
                <div className="flex items-center gap-1.5 relative z-10">
                  <span className="w-2 h-2 bg-[#C5A059] rounded-full typing-dot" />
                  <span className="w-2 h-2 bg-[#C5A059] rounded-full typing-dot" />
                  <span className="w-2 h-2 bg-[#C5A059] rounded-full typing-dot" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Quick Action Chip Bar ────────────────────────────────────── */}
      <div className="relative bg-white border-t border-[#E6E4DF] flex-shrink-0">
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

        <div className="px-2 sm:px-4 py-2 overflow-x-auto flex gap-2 no-scrollbar">
          {/* Primary CTA chip */}
          <button
            onClick={() => handleQuickChip(t.quickQuestions.bookVisit)}
            className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold bg-[#111418] text-white hover:bg-[#2A3038] flex items-center gap-1.5 shadow-xs transition-all shrink-0 btn-ripple"
          >
            <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
            {t.quickQuestions.bookVisit}
          </button>

          <button
            onClick={() => handleQuickChip('Compare Project 1 vs Project 2')}
            className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FBF7EE] text-[#735722] hover:bg-[#C5A059] hover:text-[#111418] border border-[#C5A059]/40 transition-all shrink-0 flex items-center gap-1 btn-ripple"
          >
            <Sparkles className="w-3 h-3" />
            Compare Projects
          </button>

          {[
            t.quickQuestions.price,
            t.quickQuestions.amenities,
            t.quickQuestions.location,
            t.quickQuestions.possession,
          ].map((chip) => (
            <button
              key={chip}
              onClick={() => handleQuickChip(chip)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium bg-[#F8F7F4] hover:bg-[#ECEAE5] text-gray-700 border border-[#E6E4DF] transition-all shrink-0"
            >
              {chip}
            </button>
          ))}

          <button
            onClick={() => handleQuickChip(t.quickQuestions.talkHuman)}
            className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-all shrink-0"
          >
            {t.quickQuestions.talkHuman}
          </button>

          <button
            onClick={() => handleQuickChip('Stop contacting me — DPDP opt-out')}
            className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-all shrink-0"
          >
            🚫 Opt-Out
          </button>
        </div>
      </div>

      {/* ── Input Form ──────────────────────────────────────────────── */}
      <form
        onSubmit={handleSend}
        className="px-3 sm:px-4 py-3 bg-white border-t border-[#E6E4DF] flex items-center gap-2 flex-shrink-0"
      >
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={t.inputPlaceholder}
            disabled={isTyping}
            className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#F8F7F4] border border-[#E6E4DF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 focus:border-[#C5A059] focus:bg-white transition-all text-[#181A1D] disabled:opacity-50 placeholder:text-gray-400"
          />
          {inputQuery.length > 100 && (
            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono tabular-nums ${inputQuery.length > 500 ? 'text-rose-500' : 'text-gray-400'}`}>
              {inputQuery.length}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={!inputQuery.trim() || isTyping}
          className={`p-2.5 sm:p-3 rounded-xl font-bold transition-all shadow-xs flex-shrink-0 ${
            inputQuery.trim() && !isTyping
              ? 'bg-[#111418] hover:bg-[#2A3038] text-[#C5A059] hover:scale-110 active:scale-95 shadow-md btn-ripple'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* ── Slot Selection Modal ─────────────────────────────────────── */}
      <SlotPickerModal
        isOpen={isSlotModalOpen}
        onClose={() => setIsSlotModalOpen(false)}
        projectId={currentProject}
        slots={slots}
        language={language}
        onHoldSlot={holdSlot}
        onConfirmBooking={(slotId, leadId, name, phone, proj, config) => {
          const res = bookSiteVisit(slotId, leadId, name, phone, proj, config);
          if (res.success && res.booking) setLatestBooking(res.booking);
          return res;
        }}
        onBookingSuccess={() => setIsSlotModalOpen(false)}
      />
    </div>
  );
};
