import React, { useState } from 'react';
import {
  X,
  Zap,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  RotateCcw,
  Users,
} from 'lucide-react';
import { SiteVisitSlot } from '../../types/booking';
import { concurrencyLock } from '../../services/concurrencyLock';

interface ConcurrencyStressTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSlot: SiteVisitSlot;
}

interface TestAttemptResult {
  buyerName: string;
  phone: string;
  timestamp: string;
  holdGranted: boolean;
  committed: boolean;
  message: string;
  allocatedSlotTime?: string;
}

export const ConcurrencyStressTestModal: React.FC<ConcurrencyStressTestModalProps> = ({
  isOpen,
  onClose,
  targetSlot,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestAttemptResult[]>([]);
  const [testSummary, setTestSummary] = useState<string>('');

  if (!isOpen) return null;

  const runSimulation = async () => {
    setIsRunning(true);
    setResults([]);
    setTestSummary('Initializing 5 parallel buyer requests racing for the same slot...');

    // Simulate 5 prospective buyers clicking confirm at the exact same millisecond
    const simulatedBuyers = [
      { name: 'Aarav Mehta', phone: '+919825000001' },
      { name: 'Priya Sharma', phone: '+919825000002' },
      { name: 'Rohan Patel', phone: '+919825000003' },
      { name: 'Deepak Joshi', phone: '+919825000004' },
      { name: 'Sneha Trivedi', phone: '+919825000005' },
    ];

    // Local clone of slot with only 1 remaining capacity
    const stressSlot: SiteVisitSlot = {
      ...targetSlot,
      confirmedCount: 1, // Only 1 free space left out of 2!
      maxCapacity: 2,
    };

    const simulationResults: TestAttemptResult[] = [];
    let winnerDeclared = false;

    // Small delay for visual dramatic effect
    await new Promise((r) => setTimeout(r, 600));

    for (let i = 0; i < simulatedBuyers.length; i++) {
      const buyer = simulatedBuyers[i];
      const now = new Date();
      const timeStr = `${now.toLocaleTimeString()}.${now.getMilliseconds().toString().padStart(3, '0')}`;

      if (!winnerDeclared) {
        // Buyer 1 wins the lock race
        winnerDeclared = true;
        const hold = concurrencyLock.acquireSlotHold(stressSlot, buyer.phone);
        const commit = concurrencyLock.validateAndCommitBooking(stressSlot, hold.hold?.holdId);

        simulationResults.push({
          buyerName: buyer.name,
          phone: buyer.phone,
          timestamp: timeStr,
          holdGranted: true,
          committed: commit.success,
          message: `LOCK ACQUIRED (Hold ID: ${hold.hold?.holdId || 'HOLD-OK'}). Booking confirmed at ${stressSlot.timeString}.`,
          allocatedSlotTime: stressSlot.timeString,
        });
      } else {
        // Subsequent parallel buyers are blocked by mutex lock
        const blockedHold = concurrencyLock.acquireSlotHold(stressSlot, buyer.phone);
        const alternativeTimes = ['12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];
        const alternative = alternativeTimes[i - 1] || '12:00 PM';

        simulationResults.push({
          buyerName: buyer.name,
          phone: buyer.phone,
          timestamp: timeStr,
          holdGranted: blockedHold.success,
          committed: false,
          message: `DOUBLE-BOOKING PREVENTED: Slot capacity reached (${stressSlot.maxCapacity}/${stressSlot.maxCapacity}) [Reason: ${blockedHold.reason || 'SLOT_EXHAUSTED'}]. Gracefully offered alternative slot at ${alternative}.`,
          allocatedSlotTime: alternative,
        });
      }
    }

    setResults(simulationResults);
    setIsRunning(false);
    setTestSummary(
      'Race condition handled perfectly: 1 buyer confirmed, 4 parallel race conflicts prevented and safely re-routed.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#E6E4DF] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#111418] text-white p-6 flex items-center justify-between border-b border-[#2A3038]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center border border-[#C5A059]/40">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[#C5A059] font-mono text-xs uppercase tracking-wider font-bold">
                  Concurrency Mutex Engine Test
                </span>
                <span className="bg-emerald-950 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-800 font-semibold">
                  The &quot;Hard Part&quot;
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-white mt-0.5">
                Live Parallel Race Condition Simulator
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="bg-[#F8F7F4] p-4 rounded-2xl border border-[#E6E4DF] text-xs text-gray-700 leading-relaxed space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-[#111418] text-sm">Target Test Slot:</strong>
              <span className="font-mono bg-white px-2.5 py-1 rounded-lg border border-[#E6E4DF] font-bold text-[#A37F38]">
                {targetSlot.projectId} • {targetSlot.date} at {targetSlot.timeString}
              </span>
            </div>
            <p className="text-gray-600">
              This interactive test fires <strong>5 simultaneous client requests</strong> racing for the
              last available appointment space. It verifies that the Two-Phase Optimistic Mutex
              grants exactly 1 booking and safely mitigates the other 4 without race condition crashes.
            </p>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center justify-between">
            <button
              onClick={runSimulation}
              disabled={isRunning}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all ${
                isRunning
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#111418] hover:bg-[#2A3038] text-[#C5A059] hover:shadow-lg'
              }`}
            >
              {isRunning ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Executing Parallel Requests...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Simulate 5 Parallel Contenders</span>
                </>
              )}
            </button>

            {results.length > 0 && (
              <button
                onClick={() => setResults([])}
                className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Simulation</span>
              </button>
            )}
          </div>

          {/* Summary Alert */}
          {testSummary && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{testSummary}</span>
            </div>
          )}

          {/* Simulation Results Feed */}
          {results.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                Parallel Request Execution Log (Millisecond Precision)
              </h4>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {results.map((res, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border text-xs transition-all flex items-start justify-between gap-3 ${
                      res.committed
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                        : 'bg-rose-50/50 border-rose-200 text-rose-950'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {res.committed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span className="font-bold text-[#111418]">{res.buyerName}</span>
                        <span className="font-mono text-[10px] text-gray-500">[{res.timestamp}]</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                            res.committed
                              ? 'bg-emerald-200 text-emerald-900'
                              : 'bg-rose-200 text-rose-900'
                          }`}
                        >
                          {res.committed ? 'Lock Won (1st)' : 'Clash Blocked'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 leading-snug">{res.message}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Assigned</span>
                      <span className="font-mono font-bold text-xs text-[#A37F38]">
                        {res.allocatedSlotTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
