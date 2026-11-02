import React, { useState } from 'react';
import {
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { useBookingStore } from '../../store/useBookingStore';
import { MASTER_FACT_SHEET } from '../../data/factSheetData';

export const WhatsAppSimulatorModal: React.FC = () => {
  const { bookings } = useBookingStore();
  const activeBooking = bookings[0];
  const projectFact = activeBooking ? MASTER_FACT_SHEET[activeBooking.projectId] : MASTER_FACT_SHEET['Project 1'];

  const [optedOut, setOptedOut] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      id: 'WA-01',
      sender: 'business',
      time: '10:00 AM',
      body: `Namaste ${activeBooking?.leadName || 'Valued Buyer'}! 🙏\n\nThank you for connecting with Company A (Ahmedabad). Looking forward to welcoming you for your scheduled site tour at ${projectFact.commercialName} on ${activeBooking?.date || 'Tomorrow'} at ${activeBooking?.timeString || '11:00 AM'}.\n\nYour assigned advisor ${activeBooking?.assignedExecutiveName || 'Rajesh Mehta'} will personally guide you through the sample residence.\n\n📍 Location Pin: ${projectFact.location.coordinates.lat}, ${projectFact.location.coordinates.lng}\n📄 GujRERA Registration: ${projectFact.reraNumber}\n\nReply STOP to opt-out under DPDP Act 2023.`,
    },
    {
      id: 'WA-02',
      sender: 'business',
      time: '09:00 AM',
      body: `Reminder: Your site tour at ${projectFact.commercialName} begins in 2 hours (${activeBooking?.timeString || '11:00 AM'}). Reserved parking is open for your vehicle at the main gate. See you soon!`,
    },
  ]);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const userText = replyText.trim();
    const newMsg = {
      id: `WA-${Date.now()}`,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      body: userText,
    };

    setChatLog((prev) => [...prev, newMsg]);
    setReplyText('');

    if (userText.toUpperCase() === 'STOP') {
      setOptedOut(true);
      setTimeout(() => {
        setChatLog((prev) => [
          ...prev,
          {
            id: `WA-${Date.now()}-SYS`,
            sender: 'business',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            body: `You have successfully opted out under DPDP Act 2023. You will receive no further automated notifications from Company A. Reply START anytime to re-enable.`,
          },
        ]);
      }, 500);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto my-2 sm:my-6 bg-white rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-[#111418] shadow-2xl overflow-hidden font-sans">
      {/* WhatsApp Header */}
      <div className="bg-[#075E54] text-white px-3 sm:px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-[#075E54] flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
            CA
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs sm:text-sm truncate max-w-[170px] sm:max-w-none">Company A Verified Concierge</span>
              <span className="w-2 h-2 rounded-full bg-[#25D366] flex-shrink-0"></span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-white/80 truncate max-w-[200px] sm:max-w-none">Official Business Account • GujRERA Certified</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-white/80">
          <Video className="w-4 h-4 cursor-pointer hover:text-white" />
          <Phone className="w-4 h-4 cursor-pointer hover:text-white" />
          <MoreVertical className="w-4 h-4 cursor-pointer hover:text-white" />
        </div>
      </div>

      {/* DPDP Compliance Notice */}
      <div className="bg-[#ECE5DD] px-4 py-2 border-b border-[#D4CBBF] text-center">
        <span className="text-[10px] bg-white/90 text-gray-600 px-3 py-1 rounded-full shadow-xs inline-flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          DPDP Act 2023 Verified Opt-In Template
        </span>
      </div>

      {/* Chat Messages Body */}
      <div className="bg-[#EFEAE2] p-4 space-y-3.5 min-h-[380px] max-h-[460px] overflow-y-auto">
        {chatLog.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed shadow-xs relative ${
                  isUser ? 'bg-[#DCF8C6] text-gray-900 rounded-tr-xs' : 'bg-white text-gray-900 rounded-tl-xs'
                }`}
              >
                <p className="whitespace-pre-line text-xs">{msg.body}</p>
                <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-gray-500">
                  <span>{msg.time}</span>
                  <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                </div>
              </div>
            </div>
          );
        })}

        {optedOut && (
          <div className="text-center my-2">
            <span className="text-[11px] bg-rose-100 text-rose-800 px-3 py-1 rounded-full font-semibold border border-rose-200">
              Opt-Out Active: Communication Suspended
            </span>
          </div>
        )}
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSendReply} className="bg-[#F0F0F0] p-3 flex items-center gap-2 border-t border-gray-200">
        <input
          type="text"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder={optedOut ? 'Reply START to opt back in...' : 'Type a message (or type STOP to test opt-out)...'}
          className="flex-1 bg-white px-4 py-2 text-xs rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#075E54]"
        />
        <button
          type="submit"
          disabled={!replyText.trim()}
          className="w-9 h-9 rounded-full bg-[#075E54] hover:bg-[#128C7E] text-white flex items-center justify-center transition-colors shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
