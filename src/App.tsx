import React, { useState, useEffect } from 'react';
import { Header, AppView } from './components/layout/Header';
import { ComplianceBanner } from './components/layout/ComplianceBanner';
import { Footer } from './components/layout/Footer';
import { BuyerChatWidget } from './components/buyer/BuyerChatWidget';
import { UnifiedLeadList } from './components/admin/UnifiedLeadList';
import { ExecutiveWorkspace } from './components/sales/ExecutiveWorkspace';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { FactSheetEditor } from './components/admin/FactSheetEditor';
import { WhatsAppSimulatorModal } from './components/sales/WhatsAppSimulatorModal';
import { ConcurrencyStressTestModal } from './components/admin/ConcurrencyStressTestModal';
import { ToastContainer } from './components/ui/ToastContainer';
import { useToast } from './hooks/useToast';
import { useBookingStore } from './store/useBookingStore';
import { LanguageCode } from './types/lead';
import { ProjectId } from './types/booking';

// ── Splash Screen ────────────────────────────────────────────────────
const SplashScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  useEffect(() => {
    const timer = setTimeout(onDone, 2000);
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
          <div className="absolute -inset-4 rounded-full border border-[#C5A059]/20 animate-pulse-glow" />
          <div className="w-24 h-24 rounded-3xl bg-[#1A1E24] border-2 border-[#C5A059]/50 flex items-center justify-center shadow-2xl">
            <span className="shimmer-text text-5xl font-serif font-bold leading-none">A</span>
          </div>
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
            style={{ '--bar-width': '100%', animationDuration: '1.6s' } as React.CSSProperties}
          />
        </div>
        <p className="text-[11px] text-gray-600 animate-splash-tag">Initialising AI Concierge…</p>
      </div>

      {/* Compliance badges */}
      <div className="absolute bottom-8 flex items-center gap-3 animate-splash-tag z-10">
        <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">GujRERA Registered</span>
        <span className="w-1 h-1 rounded-full bg-gray-700" />
        <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">DPDP Act 2023 Compliant</span>
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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

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
      />

      {/* Main View — keyed to trigger page transition animation on view switch */}
      <main className="flex-1">
        <div key={currentView} className="animate-view-in">
          {currentView === 'buyer-chat' && (
            <div className="p-2 sm:p-4">
              <BuyerChatWidget
                currentProject={currentProject}
                language={language}
                onLanguageChange={setLanguage}
                onProjectChange={setCurrentProject}
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

      {/* Toast Stack */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Scroll-to-top FAB */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-4 z-[150] w-10 h-10 rounded-full bg-[#111418] text-[#C5A059] border border-[#C5A059]/40 shadow-lg flex items-center justify-center hover:bg-[#2A3038] transition-all hover:scale-110 active:scale-95 animate-fade-up btn-ripple"
          title="Scroll to top"
          aria-label="Scroll to top"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      {/* Architectural Developer Footer */}
      <Footer
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenStressTest={() => setIsStressTestOpen(true)}
      />
    </div>
  );
};

export default App;
