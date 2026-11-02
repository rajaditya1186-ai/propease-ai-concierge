import React, { useState } from 'react';
import {
  MessageSquare,
  Users,
  CalendarCheck,
  BarChart3,
  FileEdit,
  Smartphone,
  Building2,
  Zap,
  Menu,
  X,
  Globe,
  Clock,
  Sparkles,
} from 'lucide-react';
import { LanguageCode } from '../../types/lead';
import { ProjectId } from '../../types/booking';

export type AppView =
  | 'buyer-chat'
  | 'lead-hub'
  | 'sales-workspace'
  | 'executive-dashboard'
  | 'factsheet-cms'
  | 'whatsapp-simulator';

interface HeaderProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  currentProject: ProjectId;
  onProjectChange: (proj: ProjectId) => void;
  onOpenStressTest?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  language,
  onLanguageChange,
  currentProject,
  onProjectChange,
  onOpenStressTest,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-[#E6E4DF] sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-[#111418] flex items-center justify-center text-[#C5A059] shadow-inner flex-shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-base sm:text-lg tracking-tight text-[#111418] leading-none">
                    Company A
                  </span>
                  <span className="text-[10px] font-mono tracking-widest uppercase bg-[#C5A059]/15 text-[#8F6C27] font-bold px-2 py-0.5 rounded-full leading-none">
                    Ahmedabad
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5 leading-none">
                  PropEase AI Concierge Platform
                </p>
              </div>
            </div>

            {/* Active Navigation Tabs (Desktop / Wide Displays) */}
            <nav className="hidden lg:flex items-center space-x-1 bg-[#F8F7F4] p-1 rounded-xl border border-[#E6E4DF] flex-shrink-0">
              <button
                onClick={() => onViewChange('buyer-chat')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentView === 'buyer-chat'
                    ? 'bg-white text-[#111418] shadow-xs font-semibold'
                    : 'text-gray-600 hover:text-[#111418] hover:bg-white/60'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#C5A059]" />
                Buyer Concierge
              </button>

              <button
                onClick={() => onViewChange('lead-hub')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentView === 'lead-hub'
                    ? 'bg-white text-[#111418] shadow-xs font-semibold'
                    : 'text-gray-600 hover:text-[#111418] hover:bg-white/60'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-[#3E54AC]" />
                Lead Hub &amp; Dedup
              </button>

              <button
                onClick={() => onViewChange('sales-workspace')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentView === 'sales-workspace'
                    ? 'bg-white text-[#111418] shadow-xs font-semibold'
                    : 'text-gray-600 hover:text-[#111418] hover:bg-white/60'
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5 text-[#1B7A4D]" />
                Sales Advisors (11)
              </button>

              <button
                onClick={() => onViewChange('executive-dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentView === 'executive-dashboard'
                    ? 'bg-white text-[#111418] shadow-xs font-semibold'
                    : 'text-gray-600 hover:text-[#111418] hover:bg-white/60'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-[#B84233]" />
                ROI Dashboard
              </button>

              <button
                onClick={() => onViewChange('factsheet-cms')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentView === 'factsheet-cms'
                    ? 'bg-white text-[#111418] shadow-xs font-semibold'
                    : 'text-gray-600 hover:text-[#111418] hover:bg-white/60'
                }`}
              >
                <FileEdit className="w-3.5 h-3.5 text-[#D9822B]" />
                Fact Sheet CMS
              </button>

              <button
                onClick={() => onViewChange('whatsapp-simulator')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentView === 'whatsapp-simulator'
                    ? 'bg-white text-[#111418] shadow-xs font-semibold'
                    : 'text-gray-600 hover:text-[#111418] hover:bg-white/60'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp Sim
              </button>
            </nav>

            {/* Right Side: Triple Line (Hamburger) Button */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111418] text-[#C5A059] hover:bg-[#2A3038] border border-[#C5A059]/40 shadow-xs transition-all cursor-pointer group"
                title="Open Controls & Settings Sidebar"
                aria-label="Open Controls & Settings Sidebar"
              >
                <Menu className="w-5 h-5 text-[#C5A059] group-hover:scale-105 transition-transform" />
                <span className="text-xs font-bold text-white hidden sm:inline">Settings &amp; Tools</span>
              </button>
            </div>
          </div>

          {/* Medium and Mobile Navigation Bar */}
          <div className="lg:hidden flex items-center overflow-x-auto py-2 gap-1.5 border-t border-[#E6E4DF] no-scrollbar">
            <button
              onClick={() => onViewChange('buyer-chat')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
                currentView === 'buyer-chat'
                  ? 'bg-[#111418] text-white font-semibold shadow-xs'
                  : 'bg-[#F8F7F4] text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#C5A059]" />
              Buyer Concierge
            </button>
            <button
              onClick={() => onViewChange('lead-hub')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
                currentView === 'lead-hub'
                  ? 'bg-[#111418] text-white font-semibold shadow-xs'
                  : 'bg-[#F8F7F4] text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#3E54AC]" />
              Lead Hub &amp; Dedup
            </button>
            <button
              onClick={() => onViewChange('sales-workspace')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
                currentView === 'sales-workspace'
                  ? 'bg-[#111418] text-white font-semibold shadow-xs'
                  : 'bg-[#F8F7F4] text-gray-700 hover:bg-gray-200'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5 text-[#1B7A4D]" />
              Sales Advisors (11)
            </button>
            <button
              onClick={() => onViewChange('executive-dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
                currentView === 'executive-dashboard'
                  ? 'bg-[#111418] text-white font-semibold shadow-xs'
                  : 'bg-[#F8F7F4] text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#B84233]" />
              ROI Dashboard
            </button>
            <button
              onClick={() => onViewChange('factsheet-cms')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
                currentView === 'factsheet-cms'
                  ? 'bg-[#111418] text-white font-semibold shadow-xs'
                  : 'bg-[#F8F7F4] text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5 text-[#D9822B]" />
              Fact Sheet CMS
            </button>
            <button
              onClick={() => onViewChange('whatsapp-simulator')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
                currentView === 'whatsapp-simulator'
                  ? 'bg-[#111418] text-white font-semibold shadow-xs'
                  : 'bg-[#F8F7F4] text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
              WhatsApp Sim
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Sidebar Drawer triggered by Triple Line button */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
          {/* Semi-transparent Backdrop */}
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
          />

          {/* Slide-out Drawer Panel */}
          <aside className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm sm:max-w-md bg-white border-l border-[#E6E4DF] shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
              {/* Sidebar Header */}
              <div className="p-5 border-b border-[#E6E4DF] bg-[#111418] text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1A1E24] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-white leading-none">
                      Settings &amp; Tools
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-1">Platform controls &amp; parameters</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-8 h-8 rounded-lg bg-[#1A1E24] hover:bg-[#2A3038] text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close sidebar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sidebar Body Content */}
              <div className="p-5 space-y-6 flex-1">
                {/* 1. Real-Time SLA Monitor */}
                <div className="bg-[#F8F7F4] rounded-2xl p-4 border border-[#E6E4DF] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#1B7A4D]" />
                      Real-Time Response SLA
                    </span>
                    <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-glow"></span>
                      ACTIVE
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-2xl font-bold font-mono text-[#111418]">18 seconds</span>
                      <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                        Reply: 18s (SLA &lt; 2m)
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 font-medium text-right">
                      Baseline: <del className="text-rose-500">14 hours</del>
                    </span>
                  </div>
                </div>

                {/* 2. Project Property Selector */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#111418] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#C5A059]" />
                    Active Residential Project
                  </label>
                  <p className="text-[11px] text-gray-500">
                    Switch project context to update fact sheets, price bands, and site visit slot calendars.
                  </p>

                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => onProjectChange('Project 1')}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between cursor-pointer ${
                        currentProject === 'Project 1'
                          ? 'border-[#C5A059] bg-[#FBF7EE] shadow-xs'
                          : 'border-[#E6E4DF] hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-sm text-[#111418]">
                            The Grand Orchid
                          </span>
                          <span className="text-[10px] font-mono font-bold bg-[#C5A059]/15 text-[#8F6C27] px-2 py-0.5 rounded-full">
                            3 BHK Luxury
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">S.G. Highway, Gota • ₹95L – ₹1.2Cr</p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">RERA: PR/GJ/.../RAA09876</p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center ${
                          currentProject === 'Project 1'
                            ? 'border-[#C5A059] bg-[#C5A059]'
                            : 'border-gray-300'
                        }`}
                      >
                        {currentProject === 'Project 1' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </button>

                    <button
                      onClick={() => onProjectChange('Project 2')}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between cursor-pointer ${
                        currentProject === 'Project 2'
                          ? 'border-[#C5A059] bg-[#FBF7EE] shadow-xs'
                          : 'border-[#E6E4DF] hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-sm text-[#111418]">
                            Orchid Heights
                          </span>
                          <span className="text-[10px] font-mono font-bold bg-[#3E54AC]/10 text-[#3E54AC] px-2 py-0.5 rounded-full">
                            2 &amp; 3 BHK Modern
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Shela / South Bopal • ₹65L – ₹88L</p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">RERA: PR/GJ/.../RAA09877</p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center ${
                          currentProject === 'Project 2'
                            ? 'border-[#C5A059] bg-[#C5A059]'
                            : 'border-gray-300'
                        }`}
                      >
                        {currentProject === 'Project 2' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {/* 3. Language Selector */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#111418] flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#3E54AC]" />
                    Conversational Language
                  </label>
                  <p className="text-[11px] text-gray-500">
                    Switch language for AI buyer responses, translations, and interface labels.
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      onClick={() => onLanguageChange('en')}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        language === 'en'
                          ? 'bg-[#111418] text-white border-[#111418] shadow-xs'
                          : 'bg-white text-gray-700 border-[#E6E4DF] hover:bg-gray-50'
                      }`}
                    >
                      English
                      <span className="block text-[10px] font-normal opacity-70">EN</span>
                    </button>

                    <button
                      onClick={() => onLanguageChange('hi')}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        language === 'hi'
                          ? 'bg-[#111418] text-white border-[#111418] shadow-xs'
                          : 'bg-white text-gray-700 border-[#E6E4DF] hover:bg-gray-50'
                      }`}
                    >
                      हिंदी
                      <span className="block text-[10px] font-normal opacity-70">Hindi</span>
                    </button>

                    <button
                      onClick={() => onLanguageChange('gu')}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        language === 'gu'
                          ? 'bg-[#111418] text-white border-[#111418] shadow-xs'
                          : 'bg-white text-gray-700 border-[#E6E4DF] hover:bg-gray-50'
                      }`}
                    >
                      ગુજરાતી
                      <span className="block text-[10px] font-normal opacity-70">Gujarati</span>
                    </button>
                  </div>
                </div>

                {/* 4. Concurrency Stress Test Trigger */}
                {onOpenStressTest && (
                  <div className="space-y-2.5 pt-2 border-t border-[#E6E4DF]">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#111418] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#C5A059]" />
                      Atomic Concurrency Engine
                    </label>
                    <p className="text-[11px] text-gray-500">
                      Launch a simulated race condition with 5 parallel buyer requests competing for the exact same slot.
                    </p>

                    <button
                      onClick={() => {
                        setIsSidebarOpen(false);
                        onOpenStressTest();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-[#111418] hover:bg-[#2A3038] text-[#C5A059] border border-[#C5A059]/50 shadow-sm transition-all cursor-pointer"
                    >
                      <Zap className="w-4 h-4 fill-[#C5A059]" />
                      <span>Stress Test Concurrency (Race Condition)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-[#E6E4DF] bg-[#F8F7F4] text-center text-[11px] text-gray-500">
                Company A Ahmedabad • 24/7 Concierge Engine
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
