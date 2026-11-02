import React from 'react';
import { X, GitMerge, Phone, Mail, Layers, ArrowRight } from 'lucide-react';
import { Lead } from '../../types/lead';

interface DeduplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryLead: Lead;
  duplicateLeads: Lead[];
  onMerge: (primaryId: string, secondaryId: string) => void;
}

export const DeduplicationModal: React.FC<DeduplicationModalProps> = ({
  isOpen,
  onClose,
  primaryLead,
  duplicateLeads,
  onMerge,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#E6E4DF] overflow-hidden">
        {/* Header */}
        <div className="bg-[#111418] text-white p-5 flex items-center justify-between border-b border-[#2A3038]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center">
              <GitMerge className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Cross-Channel Lead Deduplication</h3>
              <p className="text-xs text-gray-400">
                Identify and merge inquiries from multiple touchpoints under one unified profile.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Primary Lead Card */}
          <div className="bg-[#F8F7F4] rounded-xl p-4 border border-[#E6E4DF]">
            <span className="text-[10px] font-bold text-[#8F6C27] bg-[#C5A059]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Primary Master Record
            </span>
            <div className="flex items-center justify-between mt-2">
              <div>
                <h4 className="font-bold text-sm text-[#111418]">{primaryLead.name}</h4>
                <div className="flex items-center gap-3 text-xs text-gray-600 mt-1 font-mono">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-gray-400" />
                    {primaryLead.phone}
                  </span>
                  {primaryLead.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-gray-400" />
                      {primaryLead.email}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-[#E6E4DF]">
                {primaryLead.source}
              </span>
            </div>
          </div>

          {/* Duplicate Matches */}
          <div>
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#C5A059]" />
              Matching Secondary Inquiries ({duplicateLeads.length})
            </h4>

            <div className="space-y-2.5">
              {duplicateLeads.map((dup) => (
                <div
                  key={dup.id}
                  className="bg-white border border-amber-200 rounded-xl p-4 flex items-center justify-between hover:bg-amber-50/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#111418]">{dup.name}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-mono">
                        {dup.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span>Source: <strong>{dup.source}</strong></span>
                      <span>•</span>
                      <span>Interest: {dup.configurationWanted}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Inquired: {new Date(dup.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onMerge(primaryLead.id, dup.id);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#111418] hover:bg-[#2A3038] text-[#C5A059] shadow-xs transition-colors"
                  >
                    <span>Merge Touchpoint</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <strong>Deduplication Protocol:</strong> Merging combines the multi-channel touchpoint
            history, preserves the earliest creation timestamp, and prevents telecallers from double-calling.
          </p>
        </div>
      </div>
    </div>
  );
};
