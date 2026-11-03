import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  ShieldAlert,
  Users,
  Compass,
  Calculator,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Sun,
  Search,
} from 'lucide-react';
import { AppView } from '../layout/Header';
import { useChatStore } from '../../store/useChatStore';
import { useFactSheetStore } from '../../store/useFactSheetStore';
import { useLeadStore } from '../../store/useLeadStore';
import { sounds } from '../../utils/soundEffects';
import { Toast } from '../../hooks/useToast';

interface ClientDemoBarProps {
  onViewChange: (view: AppView) => void;
  onOpenStressTest: () => void;
  onOpenLimitsModal: () => void;
  onOpenEmiModal: () => void;
  onOpenFloorPlans: () => void;
  onOpenCommandPalette: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onToast?: (toast: Omit<Toast, 'id'>) => void;
}

export const ClientDemoBar: React.FC<ClientDemoBarProps> = ({
  onViewChange,
  onOpenStressTest,
  onOpenLimitsModal,
  onOpenEmiModal,
  onOpenFloorPlans,
  onOpenCommandPalette,
  soundEnabled,
  onToggleSound,
  onToast,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { sendMessage } = useChatStore();
  const { factSheets, activeProject } = useFactSheetStore();
  const { ingestLead } = useLeadStore();

  const runScenario1_Deduplication = () => {
    sounds.playClick();
    onViewChange('lead-hub');
    // Ingest duplicate of Hardik Patel
    ingestLead(
      'Hardik Patel',
      '09825058210',
      'Property portal',
      'Project 1',
      '3 BHK',
      'hardik.patel@gmail.com'
    );
    sounds.playSuccess();
    onToast?.({
      type: 'warning',
      title: 'Deduplication Mutex Fired',
      message: 'Incoming lead matched Hardik Patel (+919825058210) — touchpoints merged without creating orphan lead!',
      duration: 5000,
    });
  };

  const runScenario2_DiscountGuardrail = async () => {
    sounds.playClick();
    onViewChange('buyer-chat');
    const currentFact = factSheets[activeProject];
    sounds.playSent();
    onToast?.({
      type: 'info',
      title: 'Testing Negotiation Guardrail',
      message: 'Simulating discount request: "Can you give me ₹5L discount on 3 BHK?"',
      duration: 3500,
    });
    await sendMessage('Can you give me ₹5L discount or best price on 3 BHK?', currentFact);
    sounds.playReceived();
  };

  const runScenario4_GujaratiInquiry = async () => {
    sounds.playClick();
    onViewChange('buyer-chat');
    const currentFact = factSheets[activeProject];
    sounds.playSent();
    onToast?.({
      type: 'info',
      title: 'Testing Gujarati Local Parsing',
      message: 'Simulating Gujarati query: "3 BHK ફ્લેટની કિંમત અને AUDA મંજૂરી શું છે?"',
      duration: 3500,
    });
    await sendMessage('3 BHK ફ્લેટની કિંમત અને AUDA મંજૂરી શું છે?', currentFact);
    sounds.playReceived();
  };

  return (
    <div className="bg-[#111418] text-white border-b border-[#2A3038] text-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2">
        {/* Bar Header / Summary row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 bg-[#C5A059]/20 text-[#C5A059] px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider border border-[#C5A059]/30">
              <Sparkles className="w-3 h-3 animate-pulse" />
              Client Interactive Tour
            </span>
            <span className="text-gray-300 text-xs hidden sm:inline">
              Company A Director Demo Mode · Try live scenarios:
            </span>

            {/* Quick Ahmedabad Weather Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 text-gray-400 bg-[#1A1E24] px-2.5 py-0.5 rounded-full border border-[#2A3038] text-[11px]">
              <Sun className="w-3 h-3 text-amber-400" />
              <span>Ahmedabad 34°C · Sunny</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Command Palette Trigger */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenCommandPalette();
              }}
              className="flex items-center gap-1.5 bg-[#1A1E24] hover:bg-[#2A3038] text-gray-300 hover:text-white px-2.5 py-1 rounded-lg border border-[#2A3038] text-[11px] font-medium transition-colors"
              title="Command Palette (Ctrl+K)"
            >
              <Search className="w-3 h-3 text-[#C5A059]" />
              <span className="hidden md:inline">Command</span>
              <kbd className="hidden sm:inline-block px-1 py-0.2 font-mono text-[9px] bg-black/40 rounded border border-gray-700">
                Ctrl+K
              </kbd>
            </button>

            {/* Sound Effects Toggle */}
            <button
              onClick={() => {
                onToggleSound();
                sounds.playClick();
              }}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                soundEnabled
                  ? 'bg-emerald-950/60 border-emerald-700/50 text-emerald-400'
                  : 'bg-[#1A1E24] border-[#2A3038] text-gray-400'
              }`}
              title={soundEnabled ? 'Web Audio Sound Effects ON' : 'Sound Effects OFF'}
              aria-label="Toggle Sound Effects"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Collapse/Expand Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg bg-[#1A1E24] hover:bg-[#2A3038] text-gray-400 hover:text-white transition-colors"
              aria-label={isExpanded ? 'Collapse Demo Bar' : 'Expand Demo Bar'}
            >
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Demo Scenario Actions */}
        {isExpanded && (
          <div className="mt-2 pt-2 border-t border-[#2A3038] flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {/* Scenario 1: Deduplication */}
            <button
              onClick={runScenario1_Deduplication}
              className="flex items-center gap-1.5 bg-[#1A1E24] hover:bg-[#2A3038] hover:border-[#3E54AC] text-gray-200 px-3 py-1.5 rounded-xl border border-[#2A3038] whitespace-nowrap text-xs transition-all hover:scale-[1.02] active:scale-95 shrink-0 group"
            >
              <Users className="w-3.5 h-3.5 text-[#3E54AC] group-hover:scale-110 transition-transform" />
              <span>Simulate Duplicate Ingestion</span>
            </button>

            {/* Scenario 2: Discount Guardrail */}
            <button
              onClick={runScenario2_DiscountGuardrail}
              className="flex items-center gap-1.5 bg-[#1A1E24] hover:bg-[#2A3038] hover:border-amber-500 text-gray-200 px-3 py-1.5 rounded-xl border border-[#2A3038] whitespace-nowrap text-xs transition-all hover:scale-[1.02] active:scale-95 shrink-0 group"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
              <span>Test ₹5L Discount Guardrail</span>
            </button>

            {/* Scenario 3: Concurrency Mutex */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenStressTest();
              }}
              className="flex items-center gap-1.5 bg-[#1A1E24] hover:bg-[#2A3038] hover:border-[#C5A059] text-gray-200 px-3 py-1.5 rounded-xl border border-[#2A3038] whitespace-nowrap text-xs transition-all hover:scale-[1.02] active:scale-95 shrink-0 group"
            >
              <Zap className="w-3.5 h-3.5 text-[#C5A059] group-hover:scale-110 transition-transform" />
              <span>5-Buyer Mutex Stress Test</span>
            </button>

            {/* Scenario 4: Gujarati Inquiry */}
            <button
              onClick={runScenario4_GujaratiInquiry}
              className="flex items-center gap-1.5 bg-[#1A1E24] hover:bg-[#2A3038] hover:border-emerald-500 text-gray-200 px-3 py-1.5 rounded-xl border border-[#2A3038] whitespace-nowrap text-xs transition-all hover:scale-[1.02] active:scale-95 shrink-0 group"
            >
              <span className="text-emerald-400 font-bold font-mono text-xs">ગુ</span>
              <span>Test Gujarati Local Dialect</span>
            </button>

            {/* Scenario 5: Gujarat Stamp Duty & EMI */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenEmiModal();
              }}
              className="flex items-center gap-1.5 bg-[#1A1E24] hover:bg-[#2A3038] hover:border-indigo-400 text-gray-200 px-3 py-1.5 rounded-xl border border-[#2A3038] whitespace-nowrap text-xs transition-all hover:scale-[1.02] active:scale-95 shrink-0 group"
            >
              <Calculator className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>Gujarat Stamp Duty &amp; EMI</span>
            </button>

            {/* Scenario 6: Architectural Floor Plans */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenFloorPlans();
              }}
              className="flex items-center gap-1.5 bg-[#1A1E24] hover:bg-[#2A3038] hover:border-[#C5A059] text-gray-200 px-3 py-1.5 rounded-xl border border-[#2A3038] whitespace-nowrap text-xs transition-all hover:scale-[1.02] active:scale-95 shrink-0 group"
            >
              <Compass className="w-3.5 h-3.5 text-[#C5A059] group-hover:scale-110 transition-transform" />
              <span>Unit Floor Plans</span>
            </button>

            {/* Scenario 7: Limits & Boundaries */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenLimitsModal();
              }}
              className="flex items-center gap-1.5 bg-[#1A1E24] hover:bg-[#2A3038] hover:border-rose-400 text-gray-200 px-3 py-1.5 rounded-xl border border-[#2A3038] whitespace-nowrap text-xs transition-all hover:scale-[1.02] active:scale-95 shrink-0 group"
            >
              <HelpCircle className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
              <span>System Limits &amp; Boundaries</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
