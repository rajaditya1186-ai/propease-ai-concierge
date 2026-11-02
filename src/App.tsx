import React, { useState } from 'react';
import { Header, AppView } from './components/layout/Header';
import { ComplianceBanner } from './components/layout/ComplianceBanner';
import { BuyerChatWidget } from './components/buyer/BuyerChatWidget';
import { UnifiedLeadList } from './components/admin/UnifiedLeadList';
import { ExecutiveWorkspace } from './components/sales/ExecutiveWorkspace';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { FactSheetEditor } from './components/admin/FactSheetEditor';
import { WhatsAppSimulatorModal } from './components/sales/WhatsAppSimulatorModal';
import { ConcurrencyStressTestModal } from './components/admin/ConcurrencyStressTestModal';
import { useBookingStore } from './store/useBookingStore';
import { LanguageCode } from './types/lead';
import { ProjectId } from './types/booking';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('buyer-chat');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [currentProject, setCurrentProject] = useState<ProjectId>('Project 1');
  const [isStressTestOpen, setIsStressTestOpen] = useState(false);

  const { slots } = useBookingStore();
  const testSlot = slots.find((s) => s.projectId === currentProject) || slots[0];

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col text-[#181A1D]">
      {/* Top GujRERA & DPDP Compliance Ribbon */}
      <ComplianceBanner currentProject={currentProject} />

      {/* Primary Navigation & SLA Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        language={language}
        onLanguageChange={setLanguage}
        currentProject={currentProject}
        onProjectChange={setCurrentProject}
        onOpenStressTest={() => setIsStressTestOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1">
        {currentView === 'buyer-chat' && (
          <div className="p-2 sm:p-4 animate-in fade-in duration-200">
            <BuyerChatWidget currentProject={currentProject} language={language} />
          </div>
        )}

        {currentView === 'lead-hub' && (
          <div className="animate-in fade-in duration-200">
            <UnifiedLeadList />
          </div>
        )}

        {currentView === 'sales-workspace' && (
          <div className="animate-in fade-in duration-200">
            <ExecutiveWorkspace onOpenWhatsAppSim={() => setCurrentView('whatsapp-simulator')} />
          </div>
        )}

        {currentView === 'executive-dashboard' && (
          <div className="animate-in fade-in duration-200">
            <ExecutiveDashboard />
          </div>
        )}

        {currentView === 'factsheet-cms' && (
          <div className="animate-in fade-in duration-200">
            <FactSheetEditor />
          </div>
        )}

        {currentView === 'whatsapp-simulator' && (
          <div className="p-4 animate-in fade-in duration-200">
            <WhatsAppSimulatorModal />
          </div>
        )}
      </main>

      {/* Concurrency Mutex Race-Condition Stress Test Modal */}
      {testSlot && (
        <ConcurrencyStressTestModal
          isOpen={isStressTestOpen}
          onClose={() => setIsStressTestOpen(false)}
          targetSlot={testSlot}
        />
      )}

      {/* Footer with GujRERA stamps, DPDP notice, and compliance */}
      <footer className="bg-[#111418] border-t border-[#2A3038] py-5 px-6 text-xs text-gray-400 mt-auto">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1A1E24] border border-[#C5A059]/30 flex items-center justify-center">
                <span className="text-[#C5A059] font-bold text-xs">A</span>
              </div>
              <div>
                <span className="font-bold text-white block text-sm">PropEase AI Concierge</span>
                <span className="text-gray-400 text-[11px]">Company A · Ahmedabad · 420 Luxury Units (₹65L – ₹1.2 Cr)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-900/40 text-emerald-400 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-800/50">
                DPDP Act 2023 Compliant
              </span>
              <span className="bg-[#1A1E24] text-[#C5A059] text-[10px] font-semibold px-2.5 py-1 rounded-full border border-[#C5A059]/30">
                Zero Double-Booking
              </span>
            </div>
          </div>

          {/* GujRERA Registration Numbers */}
          <div className="border-t border-[#2A3038] pt-3 space-y-1">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1.5">GujRERA Registered Projects</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-[11px]">
              <span className="text-gray-400">
                <span className="text-gray-500 font-semibold">The Grand Orchid (S.G. Highway):</span>{' '}
                <span className="font-mono text-[#C5A059]">PR/GJ/AHMEDABAD/AHMEDABAD-CITY/AUDA/RAA09876/010124</span>
              </span>
              <span className="text-gray-400">
                <span className="text-gray-500 font-semibold">Orchid Heights (Shela):</span>{' '}
                <span className="font-mono text-[#C5A059]">PR/GJ/AHMEDABAD/SANAND/AUDA/RAA09877/010124</span>
              </span>
            </div>
          </div>

          <div className="text-[10px] text-gray-600 border-t border-[#2A3038] pt-2">
            This platform is governed under the Real Estate (Regulation and Development) Act 2016 (RERA) and the Digital Personal Data Protection Act 2023 (DPDP). All promotional claims are limited to registered project details. Buyer data processed only with explicit prior consent. Opt-out honoured immediately.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
