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

      {/* Footer with Developer Attributions and Rules Compliance */}
      <footer className="bg-white border-t border-[#E6E4DF] py-4 px-6 text-xs text-gray-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#111418]">PropEase AI Concierge</span>
            <span>•</span>
            <span>Company A (Ahmedabad Developer)</span>
          </div>

          <div className="text-[11px] text-gray-400">
            420 Luxury Units (₹65 Lakh - ₹1.2 Crore) • Zero Double-Booking Guarantee • GujRERA Approved
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
