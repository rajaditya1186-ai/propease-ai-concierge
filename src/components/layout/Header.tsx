import React, { useState, useEffect, useRef } from 'react';
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
  ChevronRight,
  ShieldAlert,
  Search,
  Calculator,
  Compass,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { LanguageCode } from '../../types/lead';
import { ProjectId } from '../../types/booking';
import { sounds } from '../../utils/soundEffects';

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
  onOpenLimitsModal?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenEmiModal?: () => void;
  onOpenFloorPlans?: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

const NAV_CONFIG: { view: AppView; label: string; shortLabel: string; icon: React.ReactNode; accent: string; bg: string }[] = [
  {
    view: 'buyer-chat',
    label: 'Buyer Concierge',
    shortLabel: 'Concierge',
    icon: <MessageSquare className="w-3.5 h-3.5" />,
    accent: 'text-[#C5A059]',
    bg: 'bg-amber-50',
  },
  {
    view: 'lead-hub',
    label: 'Lead Hub',
    shortLabel: 'Leads',
    icon: <Users className="w-3.5 h-3.5" />,
    accent: 'text-[#3E54AC]',
    bg: 'bg-indigo-50',
  },
  {
    view: 'sales-workspace',
    label: 'Sales Advisors',
    shortLabel: 'Sales',
    icon: <CalendarCheck className="w-3.5 h-3.5" />,
    accent: 'text-[#1B7A4D]',
    bg: 'bg-emerald-50',
  },
  {
    view: 'executive-dashboard',
    label: 'ROI Dashboard',
    shortLabel: 'Dashboard',
    icon: <BarChart3 className="w-3.5 h-3.5" />,
    accent: 'text-[#B84233]',
    bg: 'bg-rose-50',
  },
  {
    view: 'factsheet-cms',
    label: 'Fact Sheet CMS',
    shortLabel: 'CMS',
    icon: <FileEdit className="w-3.5 h-3.5" />,
    accent: 'text-[#D9822B]',
    bg: 'bg-orange-50',
  },
  {
    view: 'whatsapp-simulator',
    label: 'WhatsApp Sim',
    shortLabel: 'WA Sim',
    icon: <Smartphone className="w-3.5 h-3.5" />,
    accent: 'text-emerald-600',
    bg: 'bg-green-50',
  },
];

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  language,
  onLanguageChange,
  currentProject,
  onProjectChange,
  onOpenStressTest,
  onOpenLimitsModal,
  onOpenCommandPalette,
  onOpenEmiModal,
  onOpenFloorPlans,
  soundEnabled = true,
  onToggleSound,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [liveTime, setLiveTime] = useState('');

  // Ref to the active nav button for the sliding indicator
  const navRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Live clock — updates every second
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update sliding indicator position when view changes
  useEffect(() => {
    if (activeButtonRef.current && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const btnRect = activeButtonRef.current.getBoundingClientRect();
      setIndicatorStyle({
        left: btnRect.left - navRect.left,
        width: btnRect.width,
      });
    }
  }, [currentView]);

  const handleOpenSidebar = () => {
    sounds.playClick();
    setIsSidebarOpen(true);
    setHasOpenedOnce(true);
  };

  return (
    <>
      <header className="bg-white border-b border-[#E6E4DF] sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">

            {/* Brand Logo */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <div
                onClick={() => onViewChange('buyer-chat')}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#111418] flex items-center justify-center text-[#C5A059] flex-shrink-0 transition-all hover:shadow-[0_0_0_2px_rgba(197,160,89,0.4)] cursor-pointer"
                title="Company A • PropEase Home"
              >
                <Building2 className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5">
                  <span
                    onClick={() => onViewChange('buyer-chat')}
                    className="font-serif font-bold text-sm sm:text-base tracking-tight text-[#111418] leading-none logo-shimmer cursor-pointer select-none"
                  >
                    Company A
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase bg-[#C5A059]/15 text-[#8F6C27] font-bold px-1.5 py-0.5 rounded-full leading-none hidden sm:inline">
                    Ahmedabad
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-400 font-medium mt-0.5 leading-none hidden sm:block">
                  PropEase AI Concierge
                </p>
              </div>
            </div>

            {/* Desktop Navigation — with sliding active indicator */}
            <nav
              ref={navRef}
              className="hidden lg:flex items-center bg-[#F8F7F4] p-1 rounded-xl border border-[#E6E4DF] flex-shrink-0 relative gap-0.5"
            >
              <span
                className="absolute top-1 bottom-1 rounded-lg bg-white shadow-xs border border-[#E6E4DF]/80 transition-all duration-300 ease-out pointer-events-none"
                style={{ left: indicatorStyle.left + 4, width: indicatorStyle.width - 8 }}
                aria-hidden
              />

              {NAV_CONFIG.map((item) => {
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    ref={isActive ? activeButtonRef : null}
                    onClick={() => {
                      sounds.playClick();
                      onViewChange(item.view);
                    }}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors z-10 ${
                      isActive
                        ? 'text-[#111418] font-semibold'
                        : 'text-gray-500 hover:text-[#111418]'
                    }`}
                  >
                    <span className={isActive ? item.accent : 'text-gray-400'}>{item.icon}</span>
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#C5A059] shadow-[0_0_6px_rgba(197,160,89,0.9)]" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right: Quick Tools + Limits Badge + Clock + Settings */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Quick Limits Badge (Honest notes about limits) */}
              {onOpenLimitsModal && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenLimitsModal();
                  }}
                  className="hidden md:flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-[#111418] bg-[#F8F7F4] hover:bg-gray-100 border border-[#E6E4DF] rounded-xl px-2.5 py-1.5 transition-colors"
                  title="View System Limits & Production Boundaries"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-[11px]">Limits &amp; Specs</span>
                </button>
              )}

              {/* Command Palette Trigger */}
              {onOpenCommandPalette && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenCommandPalette();
                  }}
                  className="hidden sm:flex items-center gap-1 text-xs text-gray-600 hover:text-black bg-[#F8F7F4] border border-[#E6E4DF] rounded-xl px-2.5 py-1.5 transition-colors"
                  title="Search & Quick Actions (Ctrl+K)"
                >
                  <Search className="w-3.5 h-3.5 text-gray-500" />
                  <kbd className="text-[10px] font-mono text-gray-400 font-semibold">⌘K</kbd>
                </button>
              )}

              {/* Live clock — desktop only */}
              {liveTime && (
                <div className="hidden xl:flex items-center gap-1.5 text-[#111418] bg-[#F8F7F4] border border-[#E6E4DF] rounded-lg px-2.5 py-1.5">
                  <Clock className="w-3 h-3 text-[#C5A059]" />
                  <span className="font-mono text-xs font-bold tabular-nums tracking-wider">{liveTime}</span>
                  <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">IST</span>
                </div>
              )}

              {/* Sound Effects Toggle */}
              {onToggleSound && (
                <button
                  onClick={onToggleSound}
                  className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#F8F7F4] hover:bg-gray-100 border border-[#E6E4DF] text-gray-700 transition-colors"
                  title={soundEnabled ? 'Mute Interface Audio' : 'Enable Web Audio Effects'}
                  aria-label="Toggle sound"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </button>
              )}

              {/* Settings & Tools button */}
              <button
                onClick={handleOpenSidebar}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-[#111418] text-[#C5A059] hover:bg-[#2A3038] border border-[#C5A059]/40 shadow-xs transition-all cursor-pointer group btn-ripple ${
                  !hasOpenedOnce ? 'animate-hamburger-pulse' : ''
                }`}
                title="Open Controls & Settings"
                aria-label="Open Controls & Settings Sidebar"
              >
                <Menu className="w-4 h-4 text-[#C5A059] group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-xs font-bold text-white hidden sm:inline">Settings</span>
              </button>
            </div>
          </div>

          {/* Mobile / Tablet Navigation — scrollable pill row */}
          <div className="lg:hidden flex items-center overflow-x-auto py-2 gap-1.5 border-t border-[#E6E4DF] no-scrollbar">
            {NAV_CONFIG.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => {
                    sounds.playClick();
                    onViewChange(item.view);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-all flex-shrink-0 ${
                    isActive
                      ? 'bg-[#111418] text-white font-semibold shadow-xs'
                      : 'bg-[#F8F7F4] text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className={isActive ? 'text-[#C5A059]' : item.accent}>{item.icon}</span>
                  {item.shortLabel}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Sidebar Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => {
              sounds.playClick();
              setIsSidebarOpen(false);
            }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
          />

          <aside className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white border-l border-[#E6E4DF] shadow-2xl flex flex-col overflow-y-auto animate-slide-right">

              {/* Drawer Header */}
              <div className="p-5 border-b border-[#E6E4DF] bg-[#111418] text-white flex items-center justify-between flex-shrink-0 sidebar-section">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1A1E24] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                    <Sparkles className="w-4 h-4 animate-pulse-glow" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-white leading-tight">Settings &amp; Tools</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Platform controls &amp; parameters</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsSidebarOpen(false);
                  }}
                  className="w-8 h-8 rounded-lg bg-[#1A1E24] hover:bg-[#2A3038] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Close sidebar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-5 space-y-6 flex-1">

                {/* 1. Real-Time SLA Monitor */}
                <div className="bg-[#F8F7F4] rounded-2xl p-4 border border-[#E6E4DF] sidebar-section">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#1B7A4D]" />
                      Response SLA
                    </span>
                    <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                      </span>
                      LIVE
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-3xl font-bold font-mono text-[#111418] tabular-nums">18s</span>
                      <p className="text-xs text-emerald-700 font-semibold mt-1">Median reply · SLA &lt; 2 min ✓</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block">Old baseline</span>
                      <del className="text-rose-500 font-mono font-bold text-sm">14 hours</del>
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 w-full bg-rose-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full animate-fill-bar" style={{ '--bar-width': '1%' } as React.CSSProperties} />
                  </div>
                  <div className="flex justify-between text-[9px] text-gray-400 mt-1">
                    <span>18s (now)</span><span className="text-rose-400">50,400s (baseline)</span>
                  </div>
                </div>

                {/* 2. Interactive Feature Shortcuts */}
                <div className="space-y-2 sidebar-section">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#111418] block">
                    Interactive Add-Ons
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {onOpenEmiModal && (
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setIsSidebarOpen(false);
                          onOpenEmiModal();
                        }}
                        className="p-3 rounded-xl border border-[#E6E4DF] hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition-all"
                      >
                        <Calculator className="w-4 h-4 text-indigo-600 mb-1" />
                        <span className="text-xs font-bold text-gray-900 block">EMI Estimator</span>
                        <span className="text-[10px] text-gray-500">GJ Stamp Duty</span>
                      </button>
                    )}

                    {onOpenFloorPlans && (
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setIsSidebarOpen(false);
                          onOpenFloorPlans();
                        }}
                        className="p-3 rounded-xl border border-[#E6E4DF] hover:border-[#C5A059] hover:bg-amber-50/50 text-left transition-all"
                      >
                        <Compass className="w-4 h-4 text-[#C5A059] mb-1" />
                        <span className="text-xs font-bold text-gray-900 block">Floor Plans</span>
                        <span className="text-[10px] text-gray-500">2 &amp; 3 BHK layouts</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. System Limits & Governance Modal */}
                {onOpenLimitsModal && (
                  <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2 sidebar-section">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      Platform Limits &amp; Boundaries
                    </div>
                    <p className="text-[11px] text-amber-800">
                      Discloses what the AI cannot do (no price haggling, no legal deed execution).
                    </p>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setIsSidebarOpen(false);
                        onOpenLimitsModal();
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-xs"
                    >
                      Read Operational Limits
                    </button>
                  </div>
                )}

                {/* 4. Project Selector */}
                <div className="space-y-3 sidebar-section">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#111418] flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#C5A059]" />
                      Active Project
                    </label>
                    <p className="text-[11px] text-gray-500 mt-0.5">Switch to change fact sheets &amp; slot calendars.</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      {
                        id: 'Project 1' as ProjectId,
                        name: 'The Grand Orchid',
                        badge: '3 BHK Luxury',
                        badgeClass: 'bg-[#C5A059]/15 text-[#8F6C27]',
                        loc: 'S.G. Highway · ₹95L–₹1.2Cr',
                        rera: 'RAA09876',
                      },
                      {
                        id: 'Project 2' as ProjectId,
                        name: 'Orchid Heights',
                        badge: '2 & 3 BHK',
                        badgeClass: 'bg-[#3E54AC]/10 text-[#3E54AC]',
                        loc: 'Shela / S. Bopal · ₹65L–₹88L',
                        rera: 'RAA09877',
                      },
                    ].map((proj) => (
                      <button
                        key={proj.id}
                        onClick={() => {
                          sounds.playClick();
                          onProjectChange(proj.id);
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between cursor-pointer btn-ripple ${
                          currentProject === proj.id
                            ? 'border-[#C5A059] bg-[#FBF7EE] bronze-glow'
                            : 'border-[#E6E4DF] hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-serif font-bold text-sm text-[#111418]">{proj.name}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${proj.badgeClass}`}>{proj.badge}</span>
                          </div>
                          <p className="text-xs text-gray-500">{proj.loc}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">RERA: PR/GJ/.../{proj.rera}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center flex-shrink-0 ${
                          currentProject === proj.id ? 'border-[#C5A059] bg-[#C5A059]' : 'border-gray-300'
                        }`}>
                          {currentProject === proj.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Language Selector */}
                <div className="space-y-3 sidebar-section">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#111418] flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#3E54AC]" />
                      Conversational Language
                    </label>
                    <p className="text-[11px] text-gray-500 mt-0.5">AI responses, quick chips, and interface labels.</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { code: 'en' as LanguageCode, label: 'English', sub: 'EN' },
                      { code: 'hi' as LanguageCode, label: 'हिंदी', sub: 'Hindi' },
                      { code: 'gu' as LanguageCode, label: 'ગુજરાતી', sub: 'Gujarati' },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          sounds.playClick();
                          onLanguageChange(lang.code);
                        }}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer btn-ripple ${
                          language === lang.code
                            ? 'bg-[#111418] text-white border-[#111418] shadow-xs'
                            : 'bg-white text-gray-700 border-[#E6E4DF] hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {lang.label}
                        <span className="block text-[10px] font-normal opacity-60 mt-0.5">{lang.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. Concurrency Stress Test */}
                {onOpenStressTest && (
                  <div className="space-y-3 pt-4 border-t border-[#E6E4DF] sidebar-section">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#111418] flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-[#C5A059]" />
                        Atomic Concurrency Engine
                      </label>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        5 parallel buyers compete for the same slot — mutex ensures zero double-booking.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setIsSidebarOpen(false);
                        onOpenStressTest();
                      }}
                      className="w-full flex items-center justify-between py-3 px-4 rounded-xl text-xs font-bold bg-[#111418] hover:bg-[#2A3038] text-[#C5A059] border border-[#C5A059]/50 shadow-xs transition-all cursor-pointer group btn-ripple"
                    >
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 fill-[#C5A059]" />
                        <span>Stress Test Concurrency</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform opacity-60" />
                    </button>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-[#E6E4DF] bg-[#F8F7F4] text-center">
                <p className="text-[11px] text-gray-400">Company A · Ahmedabad</p>
                <p className="text-[10px] text-gray-500 mt-0.5">24/7 AI Concierge Engine · v1.0</p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
