import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';

export const FlaggedChatAudit: React.FC = () => {
  const { flaggedConversations } = useChatStore();

  return (
    <div className="space-y-4">
      <div className="bg-[#FBF7EE] border border-[#C5A059]/40 p-4 rounded-2xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-[#735722] uppercase tracking-wider">
            Daily Triage Console for Sales Head
          </h4>
          <p className="text-xs text-[#523E17] leading-relaxed mt-0.5">
            Under company governance rules, the Sales Head reviews all conversations flagged by the AI
            assistant. Chats are flagged when: (1) a customer inquires about unverified details off the
            Fact Sheet, or (2) a buyer explicitly requests a senior human sales advisor.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E6E4DF] shadow-sm overflow-hidden">
        <div className="p-4 bg-[#F8F7F4] border-b border-[#E6E4DF] flex items-center justify-between">
          <span className="text-xs font-bold text-gray-800">
            Pending Flagged Reviews ({flaggedConversations.length})
          </span>
          <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
            Mandatory Daily Audit
          </span>
        </div>

        <div className="divide-y divide-[#E6E4DF]">
          {flaggedConversations.map((conv) => (
            <div key={conv.conversationId} className="p-6 space-y-3 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#111418]">{conv.leadName || 'Website Inquirer'}</span>
                    <span className="text-xs font-mono text-gray-400">({conv.leadId})</span>
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {conv.status}
                    </span>
                  </div>
                  <p className="text-xs text-rose-700 font-medium mt-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <strong>Flag Reason:</strong> {conv.flagNotes}
                  </p>
                </div>

                <div className="text-right text-xs text-gray-500">
                  <div className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(conv.updatedAt).toLocaleTimeString()}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">Assigned: {conv.assignedExecutiveId || 'Senior Advisor'}</span>
                </div>
              </div>

              {/* Transcript Preview */}
              <div className="bg-[#F8F7F4] rounded-xl p-3 border border-[#E6E4DF] space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                  Flagged Chat Transcript
                </span>
                {conv.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-2 rounded-lg ${
                      m.sender === 'user'
                        ? 'bg-white text-gray-800 border border-gray-200'
                        : 'bg-[#111418] text-[#C5A059]'
                    }`}
                  >
                    <span className="font-bold text-[10px] uppercase tracking-wider block opacity-70">
                      {m.sender === 'user' ? 'Buyer Question' : 'AI Safe Deferral Response'}
                    </span>
                    <p className="mt-0.5">{m.text}</p>
                  </div>
                ))}
              </div>

              {/* Action */}
              <div className="flex justify-end gap-2 pt-1">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#111418] text-white hover:bg-[#2A3038] transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mark Resolved &amp; Update Fact Sheet</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
