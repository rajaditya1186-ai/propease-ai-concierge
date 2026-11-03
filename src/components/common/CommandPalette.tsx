import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MessageSquare,
  Users,
  CalendarCheck,
  BarChart3,
  FileEdit,
  Smartphone,
  Zap,
  Calculator,
  Compass,
  ShieldAlert,
  Volume2,
  VolumeX,
  Building2,
  Globe,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { AppView } from '../layout/Header';
import { ProjectId } from '../../types/booking';
import { LanguageCode } from '../../types/lead';
import { useLeadStore } from '../../store/useLeadStore';
import { sounds } from '../../utils/soundEffects';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onViewChange: (view: AppView) => void;
  onProjectChange: (project: ProjectId) => void;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenStressTest: () => void;
  onOpenLimitsModal: () => void;
  onOpenEmiModal: () => void;
  onOpenFloorPlans: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

interface CommandItem {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onViewChange,
  onProjectChange,
  onLanguageChange,
  onOpenStressTest,
  onOpenLimitsModal,
  onOpenEmiModal,
  onOpenFloorPlans,
  soundEnabled,
  onToggleSound,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { leads, resetToSeeds } = useLeadStore();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build command list
  const baseCommands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-buyer',
      category: 'Navigate Views',
      title: 'Buyer Concierge (AI Chat Stream)',
      subtitle: 'Multilingual chat & instant site-visit booking',
      icon: <MessageSquare className="w-4 h-4 text-[#C5A059]" />,
      action: () => onViewChange('buyer-chat'),
    },
    {
      id: 'nav-leads',
      category: 'Navigate Views',
      title: 'Lead Hub (Ingestion & Deduplication)',
      subtitle: 'Portals, Social Ads, Hoardings, Website leads',
      icon: <Users className="w-4 h-4 text-[#3E54AC]" />,
      action: () => onViewChange('lead-hub'),
    },
    {
      id: 'nav-sales',
      category: 'Navigate Views',
      title: 'Sales Advisors Cockpit',
      subtitle: '11 named advisors, dossiers, show-up logger',
      icon: <CalendarCheck className="w-4 h-4 text-[#1B7A4D]" />,
      action: () => onViewChange('sales-workspace'),
    },
    {
      id: 'nav-roi',
      category: 'Navigate Views',
      title: 'Executive ROI & Attribution Dashboard',
      subtitle: '₹10.5L spend recovery & cost-per-visit breakdown',
      icon: <BarChart3 className="w-4 h-4 text-[#B84233]" />,
      action: () => onViewChange('executive-dashboard'),
    },
    {
      id: 'nav-cms',
      category: 'Navigate Views',
      title: 'Fact Sheet CMS & Governance',
      subtitle: 'Sales Head master property facts & slot capacity',
      icon: <FileEdit className="w-4 h-4 text-[#D9822B]" />,
      action: () => onViewChange('factsheet-cms'),
    },
    {
      id: 'nav-wa',
      category: 'Navigate Views',
      title: 'WhatsApp Simulator Sandbox',
      subtitle: 'High-fidelity mobile RERA & DPDP simulator',
      icon: <Smartphone className="w-4 h-4 text-emerald-600" />,
      action: () => onViewChange('whatsapp-simulator'),
    },

    // Interactive Tools & Modals
    {
      id: 'tool-stress',
      category: 'Interactive Tools',
      title: 'Stress Test Atomic Concurrency Mutex',
      subtitle: '5 parallel buyers compete for 1 slot (Zero Double-Booking)',
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      action: onOpenStressTest,
    },
    {
      id: 'tool-emi',
      category: 'Interactive Tools',
      title: 'Ahmedabad Home Loan & Gujarat Stamp Duty Estimator',
      subtitle: 'Calculate monthly EMI and 0% female stamp duty concession',
      icon: <Calculator className="w-4 h-4 text-[#3E54AC]" />,
      action: onOpenEmiModal,
    },
    {
      id: 'tool-floorplan',
      category: 'Interactive Tools',
      title: 'Architectural Blueprints & Unit Floor Plans',
      subtitle: '2 BHK & 3 BHK Vastu-compliant layouts & specs',
      icon: <Compass className="w-4 h-4 text-[#C5A059]" />,
      action: onOpenFloorPlans,
    },
    {
      id: 'tool-limits',
      category: 'Compliance & Safety',
      title: 'System Limits & Operational Boundaries Note',
      subtitle: 'Statutory GujRERA, DPDP Act, and AI guardrails disclosure',
      icon: <ShieldAlert className="w-4 h-4 text-rose-500" />,
      action: onOpenLimitsModal,
    },
    {
      id: 'tool-sound',
      category: 'Preferences',
      title: soundEnabled ? 'Mute Web Audio Sound Effects' : 'Enable Web Audio Sound Effects',
      subtitle: 'Subtle synthesized acoustic feedback for interactions',
      icon: soundEnabled ? <VolumeX className="w-4 h-4 text-gray-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />,
      action: onToggleSound,
    },

    // Switch Projects
    {
      id: 'proj-1',
      category: 'Active Project',
      title: 'Switch to The Grand Orchid (S.G. Highway)',
      subtitle: '3 BHK Luxury Residences • ₹95L – ₹1.2 Cr',
      icon: <Building2 className="w-4 h-4 text-[#C5A059]" />,
      action: () => onProjectChange('Project 1'),
    },
    {
      id: 'proj-2',
      category: 'Active Project',
      title: 'Switch to Orchid Heights (Shela / S. Bopal)',
      subtitle: '2 & 3 BHK Premium Units • ₹65L – ₹88L',
      icon: <Building2 className="w-4 h-4 text-[#3E54AC]" />,
      action: () => onProjectChange('Project 2'),
    },

    // Switch Languages
    {
      id: 'lang-en',
      category: 'Language Switcher',
      title: 'English (Default)',
      subtitle: 'Conversational AI & interface in English',
      icon: <Globe className="w-4 h-4 text-gray-700" />,
      action: () => onLanguageChange('en'),
    },
    {
      id: 'lang-hi',
      category: 'Language Switcher',
      title: 'हिंदी (Hindi)',
      subtitle: 'बातचीत और त्वरित बटन हिंदी में',
      icon: <Globe className="w-4 h-4 text-gray-700" />,
      action: () => onLanguageChange('hi'),
    },
    {
      id: 'lang-gu',
      category: 'Language Switcher',
      title: 'ગુજરાતી (Gujarati)',
      subtitle: 'અમદાવાદ સ્થાનિક ભાષામાં વાર્તાલાપ',
      icon: <Globe className="w-4 h-4 text-gray-700" />,
      action: () => onLanguageChange('gu'),
    },

    // Reset Data
    {
      id: 'reset-seeds',
      category: 'Demo Controls',
      title: 'Reset Demo to Ground-Truth Seeds',
      subtitle: 'Restores initial 3 brief leads and standard slots',
      icon: <RotateCcw className="w-4 h-4 text-rose-500" />,
      action: () => {
        resetToSeeds();
        sounds.playAlert();
      },
    },
  ];

  // Lead search matching
  const leadCommands: CommandItem[] = leads.map((lead) => ({
    id: `lead-${lead.id}`,
    category: 'Leads Directory',
    title: `${lead.name} (${lead.id})`,
    subtitle: `${lead.phone} • ${lead.source} • ${lead.status}`,
    icon: <Users className="w-4 h-4 text-[#3E54AC]" />,
    action: () => {
      onViewChange('lead-hub');
    },
  }));

  const allCommands = [...baseCommands, ...leadCommands];

  const filtered = query.trim()
    ? allCommands.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          (c.subtitle && c.subtitle.toLowerCase().includes(query.toLowerCase())) ||
          c.category.toLowerCase().includes(query.toLowerCase())
      )
    : baseCommands;

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        sounds.playClick();
        filtered[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-3 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E6E4DF] overflow-hidden flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Search input bar */}
        <div className="p-4 border-b border-[#E6E4DF] bg-[#F8F7F4] flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, screen, tool, or lead name... (e.g. 'EMI', 'Stress', 'Hardik')"
            className="w-full bg-transparent text-sm font-medium text-[#111418] placeholder:text-gray-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-white border border-gray-300 rounded shadow-xs text-gray-500">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-xs">
              No matching actions found for &quot;<strong className="text-gray-700">{query}</strong>&quot;.
            </div>
          ) : (
            filtered.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sounds.playClick();
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between gap-3 ${
                    isSelected ? 'bg-[#FBF7EE] border border-[#C5A059]/40 text-[#111418]' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white shadow-xs' : 'bg-gray-100'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#111418] truncate">{item.title}</span>
                        <span className="text-[9px] font-mono uppercase bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                          {item.category}
                        </span>
                      </div>
                      {item.subtitle && (
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">{item.subtitle}</p>
                      )}
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                      isSelected ? 'text-[#C5A059] translate-x-0.5' : 'text-gray-300'
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Palette Footer */}
        <div className="p-2.5 bg-[#F8F7F4] border-t border-[#E6E4DF] flex items-center justify-between text-[11px] text-gray-500 px-4">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono bg-white border px-1 rounded">↑↓</kbd> Navigate</span>
            <span><kbd className="font-mono bg-white border px-1 rounded">↵</kbd> Select</span>
          </div>
          <span className="font-mono text-[10px] text-gray-400">PropEase Quick Actions</span>
        </div>
      </div>
    </div>
  );
};
