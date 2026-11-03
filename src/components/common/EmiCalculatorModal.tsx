import React, { useState, useMemo } from 'react';
import {
  Calculator,
  X,
  ArrowRight,
} from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import { sounds } from '../../utils/soundEffects';

interface EmiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrice?: number;
  onBookTour?: () => void;
}

export const EmiCalculatorModal: React.FC<EmiCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialPrice = 9500000,
  onBookTour,
}) => {
  const [propertyPrice, setPropertyPrice] = useState<number>(initialPrice);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [applicantGender, setApplicantGender] = useState<'male' | 'female'>('male');

  // Math
  const calculations = useMemo(() => {
    const downPayment = (propertyPrice * downPaymentPct) / 100;
    const loanAmount = propertyPrice - downPayment;

    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = tenureYears * 12;

    // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const emi =
      monthlyRate === 0
        ? loanAmount / totalMonths
        : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const totalRepayment = emi * totalMonths;
    const totalInterest = totalRepayment - loanAmount;

    // Gujarat State Stamp Duty & AUDA Registration
    // In Gujarat: 4.9% Stamp Duty for Male, 1% Registration. For female primary buyers: 0% Stamp Duty + 1% Registration concession.
    const stampDutyPct = applicantGender === 'female' ? 0.0 : 4.9;
    const registrationPct = 1.0;
    const stampDutyAmount = (propertyPrice * stampDutyPct) / 100;
    const registrationAmount = (propertyPrice * registrationPct) / 100;
    const totalStatutoryCharges = stampDutyAmount + registrationAmount;

    return {
      downPayment,
      loanAmount,
      monthlyEmi: Math.round(emi),
      totalRepayment: Math.round(totalRepayment),
      totalInterest: Math.round(totalInterest),
      stampDutyAmount,
      registrationAmount,
      totalStatutoryCharges,
    };
  }, [propertyPrice, downPaymentPct, interestRate, tenureYears, applicantGender]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E6E4DF] overflow-hidden flex flex-col max-h-[90vh] animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="emi-modal-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#111418] to-[#1A1E24] text-white p-5 border-b border-[#2A3038] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2A3038] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="emi-modal-title" className="font-serif text-lg font-bold text-white">
                  Ahmedabad Home Loan &amp; Gujarat Stamp Duty Estimator
                </h2>
                <span className="text-[10px] font-mono bg-[#C5A059]/20 text-[#C5A059] px-2 py-0.5 rounded-full border border-[#C5A059]/30">
                  SBI / HDFC 2026 Slabs
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Calculate monthly installment and Gujarat statutory registration charges.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-[#2A3038] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm text-gray-700">
          {/* Main EMI Highlight Banner */}
          <div className="bg-gradient-to-br from-[#111418] to-[#1C2128] text-white rounded-2xl p-5 border border-[#C5A059]/40 bronze-glow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#C5A059] font-mono uppercase tracking-wider font-bold">
                Estimated Monthly EMI
              </span>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1 tabular-nums">
                {formatINR(calculations.monthlyEmi)}
                <span className="text-xs font-sans text-gray-400 font-normal ml-1">/ month</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Loan Amount: <strong className="text-white">{formatINR(calculations.loanAmount)}</strong> ({100 - downPaymentPct}% of total)
              </p>
            </div>

            <div className="bg-[#2A3038] p-3 rounded-xl border border-[#3A4048] text-right space-y-1 w-full sm:w-auto">
              <div className="text-[10px] uppercase font-bold text-gray-400">Total Interest Payable</div>
              <div className="text-base font-bold text-amber-400 font-mono">
                {formatINR(calculations.totalInterest)}
              </div>
              <div className="text-[10px] text-gray-400">
                Total Outflow: {formatINR(calculations.totalRepayment)}
              </div>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Property Cost Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-[#111418]">Property Price</span>
                <span className="text-[#C5A059] font-mono font-bold">{formatINR(propertyPrice)}</span>
              </div>
              <input
                type="range"
                min="6500000"
                max="12500000"
                step="250000"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="w-full accent-[#C5A059] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>₹65 Lakh (2 BHK)</span>
                <span>₹1.25 Cr (3 BHK)</span>
              </div>
            </div>

            {/* Down Payment % */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-[#111418]">Down Payment ({downPaymentPct}%)</span>
                <span className="text-emerald-700 font-mono font-bold">
                  {formatINR(calculations.downPayment)}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={downPaymentPct}
                onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                className="w-full accent-[#1B7A4D] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>10% (Min)</span>
                <span>50%</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-[#111418]">Annual Interest Rate</span>
                <span className="text-[#3E54AC] font-mono font-bold">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="7.5"
                max="11.5"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-[#3E54AC] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>7.5% (Prime)</span>
                <span>11.5%</span>
              </div>
            </div>

            {/* Loan Tenure */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-[#111418]">Tenure in Years</span>
                <span className="text-[#111418] font-mono font-bold">{tenureYears} Years</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-[#111418] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>5 Years</span>
                <span>30 Years</span>
              </div>
            </div>
          </div>

          {/* Gujarat Stamp Duty & AUDA Registration Section */}
          <div className="bg-[#F8F7F4] p-4 rounded-xl border border-[#E6E4DF] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-[#111418] block">
                  Gujarat State Stamp Duty &amp; AUDA Registration
                </span>
                <span className="text-[11px] text-gray-500">
                  Gujarat state grants female buyers 0% stamp duty exemption.
                </span>
              </div>

              {/* Gender selector */}
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-[#E6E4DF]">
                <button
                  type="button"
                  onClick={() => setApplicantGender('male')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    applicantGender === 'male'
                      ? 'bg-[#111418] text-white shadow-xs'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Male (4.9%)
                </button>
                <button
                  type="button"
                  onClick={() => setApplicantGender('female')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    applicantGender === 'female'
                      ? 'bg-pink-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Female (0% Exemption) ✨
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Stamp Duty (GJ)</span>
                <span className="text-sm font-bold text-[#111418] font-mono">
                  {formatINR(calculations.stampDutyAmount)}
                </span>
                <span className="text-[10px] text-gray-500 block">
                  {applicantGender === 'female' ? '0% Female Concession' : '4.9% AUDA Slabs'}
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">AUDA Registration (1%)</span>
                <span className="text-sm font-bold text-[#111418] font-mono">
                  {formatINR(calculations.registrationAmount)}
                </span>
                <span className="text-[10px] text-gray-500 block">1.0% Fixed Gov Fee</span>
              </div>

              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <span className="text-[10px] text-amber-800 uppercase font-bold block">Total Gov Charges</span>
                <span className="text-sm font-bold text-amber-900 font-mono">
                  {formatINR(calculations.totalStatutoryCharges)}
                </span>
                <span className="text-[10px] text-amber-700 block">Statutory Non-Negotiable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8F7F4] border-t border-[#E6E4DF] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-gray-500">
            *Indicative calculation based on AUDA Gujarat 2026 circle rates.
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            {onBookTour && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onClose();
                  onBookTour();
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#111418] text-[#C5A059] hover:bg-[#2A3038] shadow-sm transition-all"
              >
                <span>Book Walkthrough with Advisor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
