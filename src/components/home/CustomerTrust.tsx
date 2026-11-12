import React from 'react';
import { Star, CheckCircle, Shield, ThumbsUp } from 'lucide-react';
import { useStore } from '../../lib/store';
import { Reveal, StaggerGrid, StaggerCard } from '../common/MotionPrimitives';

export const CustomerTrust: React.FC = () => {
  const store = useStore();
  const settings = store.getSettings();
  const testimonials = store.getTestimonials();

  return (
    <section className="py-20 lg:py-28 border-b border-slate-200 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
            Rider Satisfaction & Reviews
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {settings.happyCustomersCount}+ Customers. One Trusted Destination.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Thank you for trusting Nakshatra Motors for your electric mobility journey.
          </p>
        </Reveal>

        {/* 3 Metric Trust Cards */}
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <StaggerCard hoverLift className="bg-white border border-slate-200/90 p-6 rounded-3xl text-center shadow-md transition-colors hover:border-blue-300">
            <div className="text-4xl sm:text-5xl font-black text-slate-900 font-mono tabular-nums">
              {settings.happyCustomersCount}+
            </div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mt-2">
              Satisfied Scooter Owners
            </div>
            <p className="text-xs text-slate-500 mt-1">Delivered across Maharashtra with full RTO support</p>
          </StaggerCard>

          <StaggerCard hoverLift className="bg-white border border-slate-200/90 p-6 rounded-3xl text-center shadow-md transition-colors hover:border-blue-300">
            <div className="text-4xl sm:text-5xl font-black text-amber-500 font-mono tabular-nums">
              4.9 <span className="text-2xl font-normal text-slate-400">/ 5.0</span>
            </div>
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mt-2">
              Average Dealership Rating
            </div>
            <p className="text-xs text-slate-500 mt-1">Based on post-delivery customer feedback</p>
          </StaggerCard>

          <StaggerCard hoverLift className="bg-white border border-slate-200/90 p-6 rounded-3xl text-center shadow-md transition-colors hover:border-blue-300">
            <div className="text-4xl sm:text-5xl font-black text-emerald-600 font-mono tabular-nums">
              100%
            </div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mt-2">
              Official Hestur Energy Warranty
            </div>
            <p className="text-xs text-slate-500 mt-1">Authorized dealer direct battery & service backup</p>
          </StaggerCard>
        </StaggerGrid>

        {/* Testimonial Cards Grid */}
        <StaggerGrid staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <StaggerCard
              key={t.id}
              hoverLift
              className="bg-white border border-slate-200 rounded-3xl p-7 flex flex-col justify-between hover:border-blue-400 hover:shadow-xl transition-colors shadow-md"
            >
              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic font-medium">
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>

              {/* Author footer */}
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight">{t.name}</h4>
                  <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <span>{t.scooterModel}</span>
                    <span>·</span>
                    <span>{t.city}</span>
                  </div>
                </div>

                {t.verified && (
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </StaggerCard>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
};
