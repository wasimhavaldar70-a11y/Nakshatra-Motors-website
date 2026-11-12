import React, { useState } from 'react';
import { motion } from 'motion/react';
import { IndianRupee, Leaf, Sparkles, TrendingUp, ArrowUpRight } from 'lucide-react';
import { calculateEvSavings, formatInr } from '../../utils/evCalculations';
import { Reveal } from '../common/MotionPrimitives';

interface SavingsCalculatorProps {
  onBookTestRide: () => void;
}

export const SavingsCalculator: React.FC<SavingsCalculatorProps> = ({ onBookTestRide }) => {
  const [dailyKm, setDailyKm] = useState<number>(35);
  const [petrolPrice, setPetrolPrice] = useState<number>(104);
  const [unitRate, setUnitRate] = useState<number>(7.5);

  const savings = calculateEvSavings(dailyKm, petrolPrice, unitRate);

  return (
    <section className="py-20 lg:py-24 border-b border-slate-200 bg-[#F1F5F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">
            Cost & Environmental Impact
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Calculate Your Real-World Electric Savings
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            See how much you will save every month by switching from a petrol two-wheeler to a
            Hestur Energy electric scooter.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xl">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-8">
            {/* Daily Commute Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label htmlFor="daily-km-slider" className="text-sm font-bold text-slate-900">
                  Daily Commute Distance
                </label>
                <span className="text-2xl font-black text-blue-600 font-mono tabular-nums">
                  {dailyKm} <span className="text-xs font-semibold text-slate-500">km / day</span>
                </span>
              </div>
              <input
                id="daily-km-slider"
                type="range"
                min="10"
                max="120"
                step="5"
                value={dailyKm}
                onChange={(e) => setDailyKm(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono font-medium">
                <span>10 km (Errands)</span>
                <span>40 km (Average office)</span>
                <span>120 km (Power commuter)</span>
              </div>
            </div>

            {/* Petrol & Electricity rates */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div>
                <label className="text-slate-600 block mb-1.5 font-bold">
                  Petrol Price (₹ / Litre)
                </label>
                <input
                  type="number"
                  value={petrolPrice}
                  onChange={(e) => setPetrolPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 font-mono text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1.5 font-bold">
                  Electricity Rate (₹ / Unit)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={unitRate}
                  onChange={(e) => setUnitRate(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 font-mono text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Based on realistic comparisons: 45 km/litre for typical petrol scooter vs 30 km per kWh unit for Hestur Energy electric scooters.
            </p>
          </div>

          {/* Results Summary Box with High Energy Accent */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#0B0F17] to-[#1E293B] text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
              <span className="text-xs uppercase tracking-widest text-slate-300 font-bold">
                Your Projected Annual Savings
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#CCFF00] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                Pure Savings
              </div>
            </div>

            {/* Giant Annual Savings Figure */}
            <div>
              <motion.div
                key={savings.annualSavings}
                initial={{ scale: 0.96, opacity: 0.75 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="text-4xl sm:text-5xl font-black text-[#CCFF00] font-mono tracking-tight tabular-nums"
              >
                {formatInr(savings.annualSavings)}
              </motion.div>
              <div className="text-xs text-slate-300 mt-1 font-medium">
                Saved in your pocket every single year
              </div>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-700/60 text-xs">
              <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-2xl">
                <span className="text-slate-300 block">Monthly Petrol Cost</span>
                <span className="text-lg font-bold text-red-400 font-mono tabular-nums">
                  {formatInr(savings.monthlyPetrolCost)}
                </span>
              </div>

              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl">
                <span className="text-slate-300 block">Monthly Electric Cost</span>
                <span className="text-lg font-bold text-emerald-400 font-mono tabular-nums">
                  {formatInr(savings.monthlyElectricCost)}
                </span>
              </div>
            </div>

            {/* 3-Year Savings & Green Impact */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">3-Year Cumulative Savings</span>
                <span className="text-base font-extrabold text-white font-mono tabular-nums">
                  {formatInr(savings.threeYearSavings)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">CO2 Offset</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono tabular-nums">
                    {savings.annualCo2SavedKg} kg / yr
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onBookTestRide}
                className="w-full py-3.5 bg-[#CCFF00] hover:bg-[#b8e600] active:scale-95 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-[#CCFF00]/30 flex items-center justify-center gap-2"
              >
                <span>Schedule Test Ride & Experience It</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
