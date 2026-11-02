import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Calendar,
  AlertCircle,
  ArrowRight,
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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim()) return;

    const query = inputQuery;
    setInputQuery('');
    const res = await sendMessage(query, currentFact);

    if (res?.shouldPromptBookingModal && !latestBooking) {
      // Suggest opening slot modal
    }
  };

  const handleQuickChip = async (chipText: string) => {
    if (chipText === t.quickQuestions.bookVisit) {
      setIsSlotModalOpen(true);
      return;
    }
    await sendMessage(chipText, currentFact);
  };

  const handlePersonaSelect = async (name: string, sampleId: string, query: string) => {
    await sendMessage(`Hi, this is ${name} (${sampleId}). ${query}`, currentFact);
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-7.8rem)] sm:h-[calc(100vh-8.5rem)] max-w-4xl mx-auto bg-white rounded-xl sm:rounded-2xl border border-[#E6E4DF] shadow-lg overflow-hidden my-1 sm:my-4 transition-all">
      {/* Official Sample Lead Persona Quick-Tester */}
      <div className="bg-[#1A1E24] text-gray-300 px-3 sm:px-4 py-2 text-xs border-b border-[#2A3038]">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setShowPersonas(!showPersonas)}
            className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider flex items-center gap-1.5 hover:underline cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sample Persona Tester {showPersonas ? '▴' : '▾'}</span>
          </button>
          <span className="text-[10px] text-gray-400 hidden sm:inline">Ground truth records from problem statement</span>
        </div>

        {/* Collapsible / responsive persona chips */}
        {(showPersonas || typeof window !== 'undefined' && window.innerWidth >= 640) && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-0.5 no-scrollbar">
            <button
              onClick={() => handlePersonaSelect('Hardik Patel', 'LD-58210', 'Looking for 3 BHK flat on S.G. Highway.')}
              className="px-2.5 py-1 rounded-lg bg-[#2A3038] hover:bg-[#C5A059] hover:text-[#111418] text-white text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              Hardik Patel (LD-58210 • Portal)
            </button>
            <button
              onClick={() => handlePersonaSelect('Nidhi Shah', 'LD-58211', 'Can I know 2 BHK price in Shela and amenities?')}
              className="px-2.5 py-1 rounded-lg bg-[#2A3038] hover:bg-[#C5A059] hover:text-[#111418] text-white text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              Nidhi Shah (LD-58211 • Social Ad)
            </button>
            <button
              onClick={() => handlePersonaSelect('Kavita Joshi', 'LD-58224', 'Saw the hoarding on SP Ring Road. Tell me location.')}
              className="px-2.5 py-1 rounded-lg bg-[#2A3038] hover:bg-[#C5A059] hover:text-[#111418] text-white text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              Kavita Joshi (LD-58224 • Hoarding)
            </button>
          </div>
        )}
      </div>

      {/* Concierge Status Bar */}
      <div className="bg-[#111418] text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-[#2A3038]">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1A1E24] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h2 className="font-serif font-bold text-sm sm:text-base text-white leading-tight">
                {currentFact.commercialName}
              </h2>
              <span className="text-[9px] sm:text-[10px] bg-[#C5A059]/20 text-[#C5A059] font-mono px-2 py-0.5 rounded-full border border-[#C5A059]/30">
                AI Concierge
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-400 truncate max-w-[200px] sm:max-w-md">
              {currentFact.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSlotModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#C5A059] hover:bg-[#A37F38] text-[#111418] font-bold text-xs px-3 sm:px-3.5 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">Book Visit</span>
            <span className="sm:hidden">Book</span>
          </button>

          <button
            onClick={resetChat}
            className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded transition-colors cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#F8F7F4]/60">
        {/* Active Booking Passcard if created */}
        {latestBooking && (
          <BookingPasscard
            booking={latestBooking}
            language={language}
            onDismiss={() => setLatestBooking(null)}
          />
        )}

        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 animate-msg-in ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-[#111418] text-[#C5A059] flex items-center justify-center shrink-0 mb-1 font-bold text-xs shadow-xs">
                  A
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#111418] text-white rounded-br-xs shadow-md'
                    : 'bg-white text-[#181A1D] border border-[#E6E4DF] rounded-bl-xs shadow-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Flagged Note Indicator (for transparency in demo) */}
                {msg.isFlaggedForAudit && (
                  <div className="mt-2.5 pt-2 border-t border-amber-200 text-[11px] text-amber-800 flex items-center gap-1.5 bg-amber-50 p-2 rounded-lg">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>
                      <strong>Handover Triggered:</strong> A senior sales advisor has been notified with
                      this chat transcript.
                    </span>
                  </div>
                )}

                {/* Quick Booking CTA Button inside assistant bubble */}
                {!isUser && msg.detectedIntent === 'ASK_PRICE' && (
                  <div className="mt-3 pt-2 border-t border-[#E6E4DF] flex justify-end">
                    <button
                      onClick={() => setIsSlotModalOpen(true)}
                      className="inline-flex items-center gap-1.5 bg-[#FBF7EE] border border-[#C5A059]/40 text-[#735722] hover:bg-[#C5A059] hover:text-[#111418] text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Reserve Site Visit Slot</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div
                  className={`text-[10px] mt-1 text-right ${
                    isUser ? 'text-gray-400' : 'text-gray-400'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Real-time Typing Bubble */}
        {isTyping && (
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <div className="w-8 h-8 rounded-full bg-[#111418] text-[#C5A059] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-[#E6E4DF] px-4 py-2.5 rounded-2xl rounded-bl-xs flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Chips Bar */}
      <div className="p-2 sm:px-4 bg-white border-t border-[#E6E4DF] overflow-x-auto flex gap-2 no-scrollbar">
        <button
          onClick={() => handleQuickChip(t.quickQuestions.bookVisit)}
          className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold bg-[#111418] text-white hover:bg-[#2A3038] flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>{t.quickQuestions.bookVisit}</span>
        </button>

        <button
          onClick={() => handleQuickChip('Compare Project 1 vs Project 2')}
          className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FBF7EE] text-[#735722] hover:bg-[#C5A059] hover:text-[#111418] border border-[#C5A059]/40 transition-colors shrink-0 flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3 text-[#C5A059]" />
          <span>Compare Both Projects</span>
        </button>

        <button
          onClick={() => handleQuickChip(t.quickQuestions.price)}
          className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium bg-[#F8F7F4] hover:bg-[#F1EFEA] text-gray-800 border border-[#E6E4DF] transition-colors shrink-0"
        >
          {t.quickQuestions.price}
        </button>

        <button
          onClick={() => handleQuickChip(t.quickQuestions.amenities)}
          className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium bg-[#F8F7F4] hover:bg-[#F1EFEA] text-gray-800 border border-[#E6E4DF] transition-colors shrink-0"
        >
          {t.quickQuestions.amenities}
        </button>

        <button
          onClick={() => handleQuickChip(t.quickQuestions.location)}
          className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium bg-[#F8F7F4] hover:bg-[#F1EFEA] text-gray-800 border border-[#E6E4DF] transition-colors shrink-0"
        >
          {t.quickQuestions.location}
        </button>

        <button
          onClick={() => handleQuickChip(t.quickQuestions.possession)}
          className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium bg-[#F8F7F4] hover:bg-[#F1EFEA] text-gray-800 border border-[#E6E4DF] transition-colors shrink-0"
        >
          {t.quickQuestions.possession}
        </button>

        <button
          onClick={() => handleQuickChip(t.quickQuestions.talkHuman)}
          className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors shrink-0"
        >
          {t.quickQuestions.talkHuman}
        </button>
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-[#E6E4DF] flex items-center gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={t.inputPlaceholder}
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-[#F8F7F4] border border-[#E6E4DF] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C5A059] focus:bg-white transition-all text-[#181A1D]"
        />

        <button
          type="submit"
          disabled={!inputQuery.trim() || isTyping}
          className={`p-2.5 rounded-xl font-bold transition-all shadow-xs ${
            inputQuery.trim() && !isTyping
              ? 'bg-[#111418] hover:bg-[#2A3038] text-[#C5A059] hover:scale-105 active:scale-95'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Slot Selection Modal */}
      <SlotPickerModal
        isOpen={isSlotModalOpen}
        onClose={() => setIsSlotModalOpen(false)}
        projectId={currentProject}
        slots={slots}
        language={language}
        onHoldSlot={holdSlot}
        onConfirmBooking={(slotId, leadId, name, phone, proj, config) => {
          const res = bookSiteVisit(slotId, leadId, name, phone, proj, config);
          if (res.success && res.booking) {
            setLatestBooking(res.booking);
          }
          return res;
        }}
        onBookingSuccess={() => {
          setIsSlotModalOpen(false);
        }}
      />
    </div>
  );
};
