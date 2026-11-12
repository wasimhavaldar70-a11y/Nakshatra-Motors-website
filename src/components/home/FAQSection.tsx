import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../lib/store';
import { Reveal } from '../common/MotionPrimitives';

export const FAQSection: React.FC = () => {
  const store = useStore();
  const faqs = store.getFaqs();

  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'range', label: 'Range & Speed' },
    { id: 'battery', label: 'Battery & Longevity' },
    { id: 'charging', label: 'Charging & Costs' },
    { id: 'purchase', label: 'Booking & Test Ride' },
    { id: 'service', label: 'After-Sales Service' },
  ];

  const filteredFaqs = faqs
    .filter((faq) => {
      if (activeCategory !== 'all' && faq.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          faq.question.toLowerCase().includes(q) ||
          faq.answer.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faqs" className="py-20 lg:py-28 border-b border-slate-200 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-12">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything You Need to Know About Riding Electric
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Transparent answers on range, battery health, charging at home, and dealership service.
          </p>
        </Reveal>

        {/* Search bar & Category filters */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. warranty, range, home charging)..."
              className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F8FAFC] border border-slate-200 rounded-2xl">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`relative px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
                  activeCategory === c.id
                    ? 'text-white'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {activeCategory === c.id && (
                  <motion.span
                    layoutId="faqCategoryPill"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className="absolute inset-0 bg-blue-600 rounded-xl shadow-sm"
                  />
                )}
                <span className="relative z-10">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 bg-[#F8FAFC] border border-slate-200 rounded-2xl">
              No questions found matching your query.
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl overflow-hidden transition-all hover:border-blue-400 shadow-sm"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 font-medium">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
