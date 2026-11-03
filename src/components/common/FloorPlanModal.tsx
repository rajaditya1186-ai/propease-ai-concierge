import React, { useState } from 'react';
import {
  Compass,
  X,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { ProjectId } from '../../types/booking';
import { sounds } from '../../utils/soundEffects';

interface FloorPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProject?: ProjectId;
  onSelectSlot?: () => void;
}

export const FloorPlanModal: React.FC<FloorPlanModalProps> = ({
  isOpen,
  onClose,
  initialProject = 'Project 1',
  onSelectSlot,
}) => {
  const [selectedProject, setSelectedProject] = useState<ProjectId>(initialProject);
  const [selectedConfig, setSelectedConfig] = useState<'2 BHK' | '3 BHK'>(
    initialProject === 'Project 1' ? '3 BHK' : '2 BHK'
  );
  const [activeRoom, setActiveRoom] = useState<string | null>(null);

  if (!isOpen) return null;

  const isGrandOrchid = selectedProject === 'Project 1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#E6E4DF] overflow-hidden flex flex-col max-h-[92vh] animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="floorplan-modal-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#111418] via-[#1A1E24] to-[#111418] text-white p-5 border-b border-[#2A3038] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2A3038] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="floorplan-modal-title" className="font-serif text-lg sm:text-xl font-bold text-white">
                  Architectural Blueprints &amp; Unit Layouts
                </h2>
                <span className="text-[10px] font-mono bg-[#C5A059]/20 text-[#C5A059] px-2 py-0.5 rounded-full border border-[#C5A059]/30">
                  AUDA Approved
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                GujRERA registered carpet areas, room dimensions, and luxury specifications.
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

        {/* Project & Unit Selector Bar */}
        <div className="bg-[#F8F7F4] border-b border-[#E6E4DF] px-5 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                setSelectedProject('Project 1');
                setSelectedConfig('3 BHK');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedProject === 'Project 1'
                  ? 'bg-[#111418] text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-[#E6E4DF] hover:bg-gray-100'
              }`}
            >
              The Grand Orchid (3 BHK Luxury)
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setSelectedProject('Project 2');
                setSelectedConfig('2 BHK');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedProject === 'Project 2'
                  ? 'bg-[#111418] text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-[#E6E4DF] hover:bg-gray-100'
              }`}
            >
              Orchid Heights (2 &amp; 3 BHK)
            </button>
          </div>

          {selectedProject === 'Project 2' && (
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-[#E6E4DF]">
              {(['2 BHK', '3 BHK'] as const).map((cfg) => (
                <button
                  key={cfg}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedConfig(cfg);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    selectedConfig === cfg
                      ? 'bg-[#C5A059] text-[#111418] font-bold'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {cfg}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm text-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive SVG Floor Plan */}
            <div className="lg:col-span-2 bg-[#F8F7F4] rounded-2xl border-2 border-dashed border-[#E6E4DF] p-4 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="w-full flex items-center justify-between text-xs text-gray-500 mb-2 font-mono">
                <span className="flex items-center gap-1 font-semibold text-[#111418]">
                  <Compass className="w-3.5 h-3.5 text-[#C5A059]" /> East Facing Entry (Vastu Compliant)
                </span>
                <span>Click rooms to view specifications</span>
              </div>

              {/* Blueprint Layout SVG */}
              <div className="w-full max-w-lg aspect-[4/3] bg-white rounded-xl shadow-inner border border-[#E6E4DF] p-3 relative">
                <svg viewBox="0 0 500 380" className="w-full h-full font-mono text-[10px]">
                  {/* Outer Walls */}
                  <rect x="20" y="20" width="460" height="340" fill="#FAFAF8" stroke="#111418" strokeWidth="4" rx="6" />

                  {/* Living & Dining Area */}
                  <rect
                    x="30"
                    y="30"
                    width="260"
                    height="190"
                    fill={activeRoom === 'living' ? '#FBF7EE' : '#FFFFFF'}
                    stroke={activeRoom === 'living' ? '#C5A059' : '#D1D5DB'}
                    strokeWidth={activeRoom === 'living' ? 3 : 1.5}
                    className="cursor-pointer transition-colors"
                    onClick={() => setActiveRoom('living')}
                  />
                  <text x="160" y="110" textAnchor="middle" className="font-bold fill-[#111418] text-xs">
                    LIVING &amp; DINING
                  </text>
                  <text x="160" y="130" textAnchor="middle" className="fill-gray-500 text-[10px]">
                    {isGrandOrchid ? '14\'0" × 22\'6"' : '12\'0" × 18\'0"'} (Italian Marble)
                  </text>

                  {/* East Balcony */}
                  <rect
                    x="30"
                    y="225"
                    width="260"
                    height="65"
                    fill={activeRoom === 'balcony' ? '#FBF7EE' : '#F3F4F6'}
                    stroke={activeRoom === 'balcony' ? '#C5A059' : '#D1D5DB'}
                    strokeWidth={activeRoom === 'balcony' ? 3 : 1.5}
                    className="cursor-pointer transition-colors"
                    onClick={() => setActiveRoom('balcony')}
                  />
                  <text x="160" y="260" textAnchor="middle" className="font-bold fill-[#111418] text-[11px]">
                    EAST SUN-DECK BALCONY
                  </text>
                  <text x="160" y="275" textAnchor="middle" className="fill-gray-500 text-[9px]">
                    Glass Railing • SG Highway View
                  </text>

                  {/* Kitchen & Utility */}
                  <rect
                    x="295"
                    y="30"
                    width="175"
                    height="130"
                    fill={activeRoom === 'kitchen' ? '#FBF7EE' : '#FFFFFF'}
                    stroke={activeRoom === 'kitchen' ? '#C5A059' : '#D1D5DB'}
                    strokeWidth={activeRoom === 'kitchen' ? 3 : 1.5}
                    className="cursor-pointer transition-colors"
                    onClick={() => setActiveRoom('kitchen')}
                  />
                  <text x="382" y="85" textAnchor="middle" className="font-bold fill-[#111418] text-[11px]">
                    MODULAR KITCHEN
                  </text>
                  <text x="382" y="105" textAnchor="middle" className="fill-gray-500 text-[9px]">
                    Quartz Countertop • PNG Ready
                  </text>

                  {/* Master Bedroom */}
                  <rect
                    x="295"
                    y="165"
                    width="175"
                    height="195"
                    fill={activeRoom === 'master' ? '#FBF7EE' : '#FFFFFF'}
                    stroke={activeRoom === 'master' ? '#C5A059' : '#D1D5DB'}
                    strokeWidth={activeRoom === 'master' ? 3 : 1.5}
                    className="cursor-pointer transition-colors"
                    onClick={() => setActiveRoom('master')}
                  />
                  <text x="382" y="250" textAnchor="middle" className="font-bold fill-[#111418] text-xs">
                    MASTER SUITE
                  </text>
                  <text x="382" y="270" textAnchor="middle" className="fill-gray-500 text-[10px]">
                    {isGrandOrchid ? '13\'0" × 16\'0"' : '11\'0" × 14\'0"'}
                  </text>
                  <text x="382" y="288" textAnchor="middle" className="fill-[#C5A059] font-bold text-[9px]">
                    + Attached Bath &amp; Wardrobe
                  </text>

                  {/* Bedroom 2 */}
                  <rect
                    x="30"
                    y="295"
                    width="260"
                    height="65"
                    fill={activeRoom === 'bed2' ? '#FBF7EE' : '#FFFFFF'}
                    stroke={activeRoom === 'bed2' ? '#C5A059' : '#D1D5DB'}
                    strokeWidth={activeRoom === 'bed2' ? 3 : 1.5}
                    className="cursor-pointer transition-colors"
                    onClick={() => setActiveRoom('bed2')}
                  />
                  <text x="160" y="332" textAnchor="middle" className="font-bold fill-[#111418] text-[11px]">
                    BEDROOM 2 (GUEST / PARENTS)
                  </text>
                </svg>
              </div>

              <div className="w-full flex items-center justify-between text-[11px] text-gray-500 mt-3">
                <span className="font-semibold text-gray-700">
                  Total Carpet Area: {isGrandOrchid ? '1,820 sq.ft (RERA Carpet)' : '1,240 sq.ft (RERA Carpet)'}
                </span>
                <span className="text-[#C5A059] font-mono font-bold">100% Vastu Approved</span>
              </div>
            </div>

            {/* Room Details & Specifications Sidebar */}
            <div className="space-y-4">
              <div className="bg-[#111418] text-white p-4 rounded-xl space-y-2">
                <span className="text-[10px] text-[#C5A059] font-mono uppercase font-bold tracking-wider">
                  Specification Highlights
                </span>
                <h4 className="font-serif font-bold text-base text-white">
                  {isGrandOrchid ? 'The Grand Orchid Luxury Standard' : 'Orchid Heights Contemporary Standard'}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Engineered with earthquake-resistant RCC frame, soundproof UPVC windows from Fenesta, and Kohler sanitary ware.
                </p>
              </div>

              {/* Room Info card based on selection */}
              <div className="p-4 rounded-xl border border-[#E6E4DF] bg-white space-y-2">
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Selected Room</span>
                <h5 className="font-bold text-sm text-[#111418]">
                  {activeRoom === 'living' && 'Living & Dining Hall'}
                  {activeRoom === 'master' && 'Master Bedroom Suite'}
                  {activeRoom === 'kitchen' && 'Modular Quartz Kitchen'}
                  {activeRoom === 'balcony' && 'East-Facing Sun-Deck'}
                  {activeRoom === 'bed2' && 'Guest / Children Bedroom'}
                  {!activeRoom && 'Click any room on the plan'}
                </h5>
                <p className="text-xs text-gray-600">
                  {activeRoom === 'living' && 'Spacious open-plan living room with Italian marble flooring, 10.5 ft ceiling height, and concealed conduit for smart home automation.'}
                  {activeRoom === 'master' && 'Hardwood textured vitrified tiles, full-height walk-in wardrobe nook, and premium dual-sink vanity bathroom.'}
                  {activeRoom === 'kitchen' && 'Granite/Quartz platform with Franke stainless sink, dedicated utility dry-balcony, and PNG connection.'}
                  {activeRoom === 'balcony' && 'Toughened glass railing with unobstructed panoramic view of Ahmedabad SG Highway skyline.'}
                  {activeRoom === 'bed2' && 'Generous layout suited for elderly parents or children with abundant morning natural light.'}
                  {!activeRoom && 'Click any space on the blueprint diagram to view specific carpet area and material finishes.'}
                </p>
              </div>

              {/* Amenities list */}
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Tower Amenities
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-emerald-950">
                  <span>• Infinity Rooftop Pool</span>
                  <span>• EV Charging Bays</span>
                  <span>• Dual High-Speed Elevators</span>
                  <span>• Banquet &amp; Clubhouse</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8F7F4] border-t border-[#E6E4DF] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-gray-500">
            *Certified GujRERA carpet area drawings available at sales gallery.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            {onSelectSlot && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onClose();
                  onSelectSlot();
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#111418] text-[#C5A059] hover:bg-[#2A3038] shadow-sm transition-all"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Reserve Walkthrough to See Sample Flat</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
