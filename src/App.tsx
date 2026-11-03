import React, { useState, useEffect } from 'react';
import { Header, AppView } from './components/layout/Header';
import { ComplianceBanner } from './components/layout/ComplianceBanner';
import { BuyerChatWidget } from './components/buyer/BuyerChatWidget';
import { UnifiedLeadList } from './components/admin/UnifiedLeadList';
import { ExecutiveWorkspace } from './components/sales/ExecutiveWorkspace';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { FactSheetEditor } from './components/admin/FactSheetEditor';
import { WhatsAppSimulatorModal } from './components/sales/WhatsAppSimulatorModal';
import { ConcurrencyStressTestModal } from './components/admin/ConcurrencyStressTestModal';
import { SystemLimitsModal } from './components/common/SystemLimitsModal';
import { EmiCalculatorModal } from './components/common/EmiCalculatorModal';
import { FloorPlanModal } from './components/common/FloorPlanModal';
import { CommandPalette } from './components/common/CommandPalette';
import { ClientDemoBar } from './components/common/ClientDemoBar';
import { ToastContainer } from './components/ui/ToastContainer';
import { useToast } from './hooks/useToast';
import { useBookingStore } from './store/useBookingStore';
import { LanguageCode } from './types/lead';
import { ProjectId } from './types/booking';
import { sounds } from './utils/soundEffects';

// ── Splash Screen ────────────────────────────────────────────────────
const SplashScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  useEffect(() => {
    const timer = setTimeout(onDone, 2200);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#111418] flex flex-col items-center justify-center animate-splash-out pointer-events-none">
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(197,160,89,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(#C5A059 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />

      {/* Logo mark */}
      <div className="animate-splash-logo relative z-10 flex flex-col items-center gap-5">
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute -inset-4 rounded-full border border-[#C5A059]/20 animate-pulse-glow" />
          <div className="w-24 h-24 rounded-3xl bg-[#1A1E24] border-2 border-[#C5A059]/50 flex items-center justify-center shadow-2xl">
            <span className="shimmer-text text-5xl font-serif font-bold leading-none">A</span>
          </div>
          {/* Live dot */}
          <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#111418] flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse" />
          </span>
        </div>

        <div className="text-center space-y-1.5 animate-splash-tag">
          <h1 className="font-serif text-3xl font-bold text-white tracking-tight">Company A</h1>
          <p className="text-sm text-[#C5A059] font-semibold tracking-widest uppercase">PropEase AI Concierge</p>
          <p className="text-xs text-gray-500 font-medium">Ahmedabad · 420 Premium Units · ₹65L – ₹1.2 Cr</p>
        </div>

        {/* Loading bar */}
        <div className="w-40 h-0.5 bg-[#2A3038] rounded-full overflow-hidden mt-2 animate-splash-tag">
          <div
            className="h-full bg-gradient-to-r from-[#8F6C27] via-[#C5A059] to-[#F0D080] rounded-full animate-fill-bar"
            style={{ '--bar-width': '100%', animationDuration: '1.8s' } as React.CSSProperties}
          />
        </div>
        <p className="text-[11px] text-gray-600 animate-splash-tag">Initialising AI systems…</p>
      </div>

      {/* RERA compliance badge */}
      <div className="absolute bottom-8 flex items-center gap-3 animate-splash-tag z-10">
        <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">GujRERA Registered</span>
        <span className="w-1 h-1 rounded-full bg-gray-700" />
        <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">DPDP Act 2023</span>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState<AppView>('buyer-chat');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [currentProject, setCurrentProject] = useState<ProjectId>('Project 1');
  const [isStressTestOpen, setIsStressTestOpen] = useState(false);
  const [isLimitsModalOpen, setIsLimitsModalOpen] = useState(false);
  const [isEmiModalOpen, setIsEmiModalOpen] = useState(false);
  const [isFloorPlansOpen, setIsFloorPlansOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sounds.getSoundEnabled());
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  // Sound toggle handler
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setSoundEnabled(next);
    addToast({
      type: 'info',
      title: next ? 'Sound effects enabled' : 'Sound effects muted',
      message: next ? 'Synthesized acoustic feedback active.' : 'Interface sounds silenced.',
      duration: 2500,
    });
  };

  // Keyboard shortcut listener: Cmd+K / Ctrl+K opens Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Show scroll-to-top after 300px
  useEffect(() => {
    const handler = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const { slots } = useBookingStore();
  const testSlot = slots.find((s) => s.projectId === currentProject) || slots[0];

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col text-[#181A1D]">

      {/* Splash Screen */}
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

      {/* GujRERA & DPDP Compliance Banner */}
      <ComplianceBanner currentProject={currentProject} />

      {/* Primary Navigation Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        language={language}
        onLanguageChange={setLanguage}
        currentProject={currentProject}
        onProjectChange={setCurrentProject}
        onOpenStressTest={() => setIsStressTestOpen(true)}
        onOpenLimitsModal={() => setIsLimitsModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenEmiModal={() => setIsEmiModalOpen(true)}
        onOpenFloorPlans={() => setIsFloorPlansOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Client Demo Guided Tour Bar */}
      <ClientDemoBar
        onViewChange={setCurrentView}
        onOpenStressTest={() => setIsStressTestOpen(true)}
        onOpenLimitsModal={() => setIsLimitsModalOpen(true)}
        onOpenEmiModal={() => setIsEmiModalOpen(true)}
        onOpenFloorPlans={() => setIsFloorPlansOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onToast={addToast}
      />

      {/* Main View — keyed to trigger page transition animation on view switch */}
      <main className="flex-1">
        <div key={currentView} className="animate-view-in">
          {currentView === 'buyer-chat' && (
            <div className="p-2 sm:p-4">
              <BuyerChatWidget
                currentProject={currentProject}
                language={language}
                onOpenEmiModal={() => setIsEmiModalOpen(true)}
                onOpenFloorPlans={() => setIsFloorPlansOpen(true)}
              />
            </div>
          )}

          {currentView === 'lead-hub' && (
            <UnifiedLeadList onToast={addToast} />
          )}

          {currentView === 'sales-workspace' && (
            <ExecutiveWorkspace
              onOpenWhatsAppSim={() => setCurrentView('whatsapp-simulator')}
              onToast={addToast}
            />
          )}

          {currentView === 'executive-dashboard' && (
            <ExecutiveDashboard />
          )}

          {currentView === 'factsheet-cms' && (
            <FactSheetEditor />
          )}

          {currentView === 'whatsapp-simulator' && (
            <div className="p-4">
              <WhatsAppSimulatorModal />
            </div>
          )}
        </div>
      </main>

      {/* Concurrency Stress Test Modal */}
      {testSlot && (
        <ConcurrencyStressTestModal
          isOpen={isStressTestOpen}
          onClose={() => setIsStressTestOpen(false)}
          targetSlot={testSlot}
        />
      )}

      {/* System Limits & Architecture Modal (Honest notes about limits) */}
      <SystemLimitsModal
        isOpen={isLimitsModalOpen}
        onClose={() => setIsLimitsModalOpen(false)}
      />

      {/* Gujarat Stamp Duty & Home Loan EMI Estimator Modal */}
      <EmiCalculatorModal
        isOpen={isEmiModalOpen}
        onClose={() => setIsEmiModalOpen(false)}
        initialPrice={currentProject === 'Project 1' ? 9500000 : 6500000}
        onBookTour={() => setCurrentView('buyer-chat')}
      />

      {/* Architectural Blueprints & Floor Plans Modal */}
      <FloorPlanModal
        isOpen={isFloorPlansOpen}
        onClose={() => setIsFloorPlansOpen(false)}
        initialProject={currentProject}
        onSelectSlot={() => setCurrentView('buyer-chat')}
      />

      {/* Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onViewChange={setCurrentView}
        onProjectChange={setCurrentProject}
        onLanguageChange={setLanguage}
        onOpenStressTest={() => setIsStressTestOpen(true)}
        onOpenLimitsModal={() => setIsLimitsModalOpen(true)}
        onOpenEmiModal={() => setIsEmiModalOpen(true)}
        onOpenFloorPlans={() => setIsFloorPlansOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Toast Stack */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Scroll-to-top FAB */}
      {showScrollTop && (
        <button
          onClick={() => {
            sounds.playClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="fixed bottom-24 right-4 z-[150] w-10 h-10 rounded-full bg-[#111418] text-[#C5A059] border border-[#C5A059]/40 shadow-lg flex items-center justify-center hover:bg-[#2A3038] transition-all hover:scale-110 active:scale-95 animate-fade-up btn-ripple"
          title="Scroll to top"
          aria-label="Scroll to top"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      {/* Footer */}
      <footer className="relative bg-[#111418] border-t border-[#2A3038] py-6 px-6 text-xs text-gray-400 mt-auto">
        <div className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-[#111418] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-4">
          {/* Brand + badges row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1A1E24] border border-[#C5A059]/30 flex items-center justify-center shrink-0">
                <span className="shimmer-text font-bold text-sm font-serif">A</span>
              </div>
              <div>
                <span className="font-bold text-white text-sm block">PropEase AI Concierge</span>
                <span className="text-gray-500 text-[11px]">Company A · Ahmedabad · 420 Luxury Units · ₹65L – ₹1.2 Cr</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-emerald-900/40 text-emerald-400 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-800/50 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                DPDP Act 2023
              </span>
              <span className="bg-[#1A1E24] text-[#C5A059] text-[10px] font-semibold px-2.5 py-1 rounded-full border border-[#C5A059]/30">
                Zero Double-Booking
              </span>
              <span className="bg-[#1A1E24] text-gray-400 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-[#2A3038]">
                GujRERA Registered
              </span>
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsLimitsModalOpen(true);
                }}
                className="bg-[#2A3038] text-[#C5A059] hover:bg-[#3A4048] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#C5A059]/40 transition-colors"
              >
                Platform Limits &amp; Boundaries
              </button>
            </div>
          </div>

          {/* RERA numbers */}
          <div className="border-t border-[#2A3038] pt-3 space-y-1">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1.5">GujRERA Registered Projects</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 text-[11px]">
              <span>
                <span className="text-gray-500 font-semibold">The Grand Orchid (S.G. Highway): </span>
                <code className="font-mono text-[#C5A059] select-all">PR/GJ/AHMEDABAD/AHMEDABAD-CITY/AUDA/RAA09876/010124</code>
              </span>
              <span>
                <span className="text-gray-500 font-semibold">Orchid Heights (Shela): </span>
                <code className="font-mono text-[#C5A059] select-all">PR/GJ/AHMEDABAD/SANAND/AUDA/RAA09877/010124</code>
              </span>
            </div>
          </div>

          {/* Legal disclaimer & Limits Note */}
          <div className="text-[10px] text-gray-600 border-t border-[#2A3038] pt-3 leading-relaxed">
            This platform is governed under the Real Estate (Regulation and Development) Act 2016 (RERA) and the Digital Personal Data Protection Act 2023 (DPDP). All promotional claims are limited to registered project details. Buyer data processed only with explicit prior consent. Opt-out honoured immediately.
            <span className="block mt-1.5 text-gray-500">
              <strong className="text-gray-400">Platform Limits &amp; Operational Boundaries:</strong> AI responses are bounded strictly to the signed Fact Sheet. The AI concierge does not offer informal price reductions or execute binding sale deeds. Site visit walkthroughs require licensed sales advisor confirmation.{' '}
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsLimitsModalOpen(true);
                }}
                className="text-[#C5A059] underline hover:text-[#E0B96A] font-semibold"
              >
                View full production limits &amp; SLA disclosures →
              </button>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
