import React from 'react';
import { motion } from 'motion/react';
import {
  Zap,
  Battery,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { Reveal, StaggerGrid, StaggerCard } from '../common/MotionPrimitives';

export const EnergeticBentoSection: React.FC = () => {
  const store = useStore();
  const settings = store.getSettings();

  return (
    <section className="w-full bg-[#F8FAFC] text-slate-900 overflow-hidden">

      {/* 
        PART 2: LOGO / CERTIFICATION TICKER (Matching Image 2 middle strip)
      */}
      <div className="border-b border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal y={10} className="flex flex-wrap items-center justify-between gap-6 opacity-70 grayscale hover:grayscale-0 transition-all text-xs font-bold text-slate-600 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span>ARAI Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Hestur Authorized</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>AIS 156 Phase 2</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Make in India</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-600" />
              <span>Lithium Safe LFP</span>
            </div>
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-red-600" />
              <span>100% RTO Approved</span>
            </div>
          </Reveal>
        </div>
      </div>

      {/* 
        PART 3: UNIQUE BENTO GRID SECTION (Exact Structure of Image 2 Bottom)
      */}
      <div className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Kicker & Main Headline matching Image 2 */}
        <Reveal className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span>ABOUT NAKSHATRA MOTORS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.14]">
            An authorized dealership dedicated to building{' '}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-2xl sm:text-4xl font-extrabold">
              <Zap className="w-5 h-5 sm:w-7 sm:h-7 text-cyan-600" /> smarter
            </span>{' '}
            and{' '}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-lime-100 text-lime-900 rounded-full text-2xl sm:text-4xl font-extrabold">
              <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 text-lime-600" /> more exciting
            </span>{' '}
            daily journeys
          </h2>
        </Reveal>

        {/* BENTO GRID (4 Distinctive Cards matching Image 2) */}
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Card 1 (Left: Sky Blue Card with Rider Photo & 120+ stat) */}
          <StaggerCard hoverLift className="md:col-span-4 bg-gradient-to-br from-[#0284C7] to-[#0EA5E9] rounded-3xl p-6 sm:p-7 text-white flex flex-col justify-between shadow-xl min-h-[420px] relative overflow-hidden group">
            <div className="flex items-center justify-between z-10">
              <span className="text-base font-black tracking-wider uppercase font-sans">
                NAKSHATRA
              </span>
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Center Visual: Electric Scooter / Rider showcase */}
            <div className="my-auto py-4 flex items-center justify-center z-10">
              <motion.img
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                src="/assets/aistudio/image_3fa52802.png"
                alt="Hestur Dyno Rider"
                className="w-48 sm:w-56 h-auto object-contain transform group-hover:scale-105 transition-transform duration-500 filter drop-shadow-xl"
              />
            </div>

            {/* Bottom Inner White Card matching Image 2 */}
            <div className="bg-white rounded-2xl p-5 text-slate-900 shadow-lg z-10">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight tabular-nums">
                {settings.happyCustomersCount}+
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                Delighted families riding Hestur Energy electric scooters across Maharashtra with full
                warranty.
              </p>
            </div>
          </StaggerCard>

          {/* Card 2 (Center: White Card with 100% Commitment & Avatars) */}
          <StaggerCard hoverLift className="md:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Commitment to Excellence
              </span>
              <div className="text-4xl sm:text-5xl font-black text-slate-900 font-mono mt-3 tracking-tight tabular-nums">
                100%
              </div>
            </div>

            <div className="space-y-4 pt-6 mt-6 border-t border-slate-100">
              {/* Customer Avatar Stack matching Image 2 */}
              <div className="flex items-center -space-x-2">
                <div className="w-9 h-9 rounded-full bg-red-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white">
                  VH
                </div>
                <div className="w-9 h-9 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white">
                  PK
                </div>
                <div className="w-9 h-9 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white">
                  SN
                </div>
                <div className="w-9 h-9 rounded-full bg-purple-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white">
                  AR
                </div>
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white">
                  +120
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic font-medium">
                &ldquo;Their test ride experience, battery safety explanation, and fast delivery
                completely changed how our family travels in Maharashtra.&rdquo;
              </p>
            </div>
          </StaggerCard>

          {/* Column 3 (Right: Stack of Lime Green 520k+ card & Dark 20+ card) */}
          <StaggerCard className="md:col-span-4 flex flex-col gap-6 justify-between">
            {/* Card 3 (Lime Green Card matching Image 2 #CCFF00) */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex-1 bg-[#CCFF00] rounded-3xl p-6 sm:p-7 text-slate-950 shadow-xl flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-slate-900/70 uppercase tracking-wider block">
                  Monthly Fleet Telemetry
                </span>
                <div className="text-4xl sm:text-5xl font-black text-slate-950 font-mono mt-2 tracking-tight tabular-nums">
                  520k+
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-900 font-semibold mt-4 leading-relaxed">
                Kilometres covered monthly by Nakshatra Motors customers with zero direct fuel
                emissions.
              </p>
            </motion.div>

            {/* Card 4 (Dark Sleek Card matching Image 2 bottom-right) */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-[#0B0F17] rounded-3xl p-6 sm:p-7 text-white shadow-xl flex items-center justify-between"
            >
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">
                  Service Touchpoints
                </span>
                <span className="text-xs text-slate-400 mt-1 block">Bays & charging points</span>
              </div>
              <div className="text-4xl font-black text-white font-mono tabular-nums">20+</div>
            </motion.div>
          </StaggerCard>
        </StaggerGrid>
      </div>
    </section>
  );
};
