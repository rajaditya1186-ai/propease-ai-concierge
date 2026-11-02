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
    <header className="bg-white border-b border-[#E6E4DF] sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#111418] flex items-center justify-center text-[#C5A059] shadow-inner">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg tracking-tight text-[#111418]">
                  Company A
                </span>
                <span className="text-[10px] font-mono tracking-widest uppercase bg-[#C5A059]/15 text-[#8F6C27] font-semibold px-2 py-0.5 rounded-full">
                  Ahmedabad
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">PropEase AI Concierge Platform</p>
            </div>
          </div>

          {/* Active Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-[#F8F7F4] p-1.5 rounded-xl border border-[#E6E4DF]">
            <button
              onClick={() => onViewChange('buyer-chat')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'buyer-chat'
                  ? 'bg-white text-[#111418] shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-[#111418] hover:bg-white/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#C5A059]" />
              Buyer Concierge
            </button>

            <button
              onClick={() => onViewChange('lead-hub')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'lead-hub'
                  ? 'bg-white text-[#111418] shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-[#111418] hover:bg-white/60'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#3E54AC]" />
              Lead Hub & Dedup
            </button>

            <button
              onClick={() => onViewChange('sales-workspace')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'sales-workspace'
                  ? 'bg-white text-[#111418] shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-[#111418] hover:bg-white/60'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5 text-[#1B7A4D]" />
              Sales Advisors (11)
            </button>

            <button
              onClick={() => onViewChange('executive-dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'executive-dashboard'
                  ? 'bg-white text-[#111418] shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-[#111418] hover:bg-white/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#B84233]" />
              ROI Dashboard
            </button>

            <button
              onClick={() => onViewChange('factsheet-cms')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'factsheet-cms'
                  ? 'bg-white text-[#111418] shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-[#111418] hover:bg-white/60'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5 text-[#D9822B]" />
              Fact Sheet CMS
            </button>

            <button
              onClick={() => onViewChange('whatsapp-simulator')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'whatsapp-simulator'
                  ? 'bg-white text-[#111418] shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-[#111418] hover:bg-white/60'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              WhatsApp Sim
            </button>
          </nav>

          {/* Right Controls: Concurrency Stress Test, SLA Indicator, Project Selector, Language Toggle */}
          <div className="flex items-center gap-2.5">
            {onOpenStressTest && (
              <button
                onClick={onOpenStressTest}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#111418] hover:bg-[#2A3038] text-[#C5A059] border border-[#C5A059]/40 shadow-xs transition-all"
                title="Simulate 5 Parallel Requests Racing for the Same Slot"
              >
                <Zap className="w-3.5 h-3.5 fill-[#C5A059]" />
                <span className="hidden sm:inline">Stress Test Concurrency</span>
                <span className="sm:hidden">Test Mutex</span>
              </button>
            )}

            {/* Real-Time SLA Beacon */}
            <div className="hidden lg:flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-glow"></span>
              <span>Reply: 18s (SLA &lt; 2m)</span>
            </div>

            {/* Project Picker */}
            <select
              value={currentProject}
              onChange={(e) => onProjectChange(e.target.value as ProjectId)}
              className="text-xs bg-white border border-[#E6E4DF] rounded-lg px-2.5 py-1.5 font-medium text-[#111418] focus:ring-1 focus:ring-[#C5A059] focus:outline-none"
            >
              <option value="Project 1">The Grand Orchid (3 BHK)</option>
              <option value="Project 2">Orchid Heights (2 & 3 BHK)</option>
            </select>

            {/* Language Switcher */}
            <div className="flex items-center bg-[#F8F7F4] border border-[#E6E4DF] rounded-lg p-0.5 text-xs font-medium">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 rounded ${
                  language === 'en' ? 'bg-white shadow-xs text-[#111418] font-semibold' : 'text-gray-500'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-1 rounded ${
                  language === 'hi' ? 'bg-white shadow-xs text-[#111418] font-semibold' : 'text-gray-500'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => onLanguageChange('gu')}
                className={`px-2 py-1 rounded ${
                  language === 'gu' ? 'bg-white shadow-xs text-[#111418] font-semibold' : 'text-gray-500'
                }`}
              >
                ગુજરાતી
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex overflow-x-auto py-2 gap-2 border-t border-[#E6E4DF]">
          <button
            onClick={() => onViewChange('buyer-chat')}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
              currentView === 'buyer-chat' ? 'bg-[#111418] text-white' : 'bg-[#F8F7F4] text-gray-700'
            }`}
          >
            Buyer Concierge
          </button>
          <button
            onClick={() => onViewChange('lead-hub')}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
              currentView === 'lead-hub' ? 'bg-[#111418] text-white' : 'bg-[#F8F7F4] text-gray-700'
            }`}
          >
            Leads & Dedup
          </button>
          <button
            onClick={() => onViewChange('sales-workspace')}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
              currentView === 'sales-workspace' ? 'bg-[#111418] text-white' : 'bg-[#F8F7F4] text-gray-700'
            }`}
          >
            Advisors (11)
          </button>
          <button
            onClick={() => onViewChange('executive-dashboard')}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
              currentView === 'executive-dashboard' ? 'bg-[#111418] text-white' : 'bg-[#F8F7F4] text-gray-700'
            }`}
          >
            ROI Dashboard
          </button>
          <button
            onClick={() => onViewChange('factsheet-cms')}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
              currentView === 'factsheet-cms' ? 'bg-[#111418] text-white' : 'bg-[#F8F7F4] text-gray-700'
            }`}
          >
            Fact Sheet CMS
          </button>
          <button
            onClick={() => onViewChange('whatsapp-simulator')}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
              currentView === 'whatsapp-simulator' ? 'bg-[#111418] text-white' : 'bg-[#F8F7F4] text-gray-700'
            }`}
          >
            WhatsApp Sim
          </button>
        </div>
      </div>
    </header>
  );
};
