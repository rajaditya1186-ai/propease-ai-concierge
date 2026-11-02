import React from 'react';
import {
  MessageSquare,
  Users,
  CalendarCheck,
  BarChart3,
  FileEdit,
  Smartphone,
  Building2,
  Zap,
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
  return (
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

          {/* Active Navigation Tabs (Desktop / Large Displays) */}
          <nav className="hidden xl:flex items-center space-x-1 bg-[#F8F7F4] p-1 rounded-xl border border-[#E6E4DF] flex-shrink-0">
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

          {/* Right Controls: Stress Test, SLA Indicator, Project Selector, Language Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            {onOpenStressTest && (
              <button
                onClick={onOpenStressTest}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#111418] hover:bg-[#2A3038] text-[#C5A059] border border-[#C5A059]/40 shadow-xs transition-all flex-shrink-0"
                title="Simulate 5 Parallel Requests Racing for the Same Slot"
              >
                <Zap className="w-3.5 h-3.5 fill-[#C5A059] flex-shrink-0" />
                <span className="hidden sm:inline">Stress Test Concurrency</span>
                <span className="sm:hidden">Test Mutex</span>
              </button>
            )}

            {/* Real-Time SLA Beacon */}
            <div className="hidden lg:flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs font-medium flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-glow flex-shrink-0"></span>
              <span className="whitespace-nowrap font-mono text-[11px] sm:text-xs">Reply: 18s (SLA &lt; 2m)</span>
            </div>

            {/* Project Picker */}
            <select
              value={currentProject}
              onChange={(e) => onProjectChange(e.target.value as ProjectId)}
              className="text-xs bg-white border border-[#E6E4DF] rounded-lg px-2 sm:px-2.5 py-1.5 font-medium text-[#111418] focus:ring-1 focus:ring-[#C5A059] focus:outline-none flex-shrink-0"
            >
              <option value="Project 1">The Grand Orchid (3 BHK)</option>
              <option value="Project 2">Orchid Heights (2 &amp; 3 BHK)</option>
            </select>

            {/* Language Switcher */}
            <div className="flex items-center bg-[#F8F7F4] border border-[#E6E4DF] rounded-lg p-0.5 text-xs font-medium flex-shrink-0">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 rounded text-xs transition-all ${
                  language === 'en' ? 'bg-white shadow-xs text-[#111418] font-semibold' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-1 rounded text-xs transition-all ${
                  language === 'hi' ? 'bg-white shadow-xs text-[#111418] font-semibold' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => onLanguageChange('gu')}
                className={`px-2 py-1 rounded text-xs transition-all ${
                  language === 'gu' ? 'bg-white shadow-xs text-[#111418] font-semibold' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                ગુજરાતી
              </button>
            </div>
          </div>
        </div>

        {/* Medium and Mobile Navigation Bar */}
        <div className="xl:hidden flex items-center overflow-x-auto py-2 gap-1.5 border-t border-[#E6E4DF] no-scrollbar">
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
  );
};
