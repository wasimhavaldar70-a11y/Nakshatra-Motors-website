import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../lib/store';
import { generateWhatsAppLink } from '../../utils/evCalculations';

interface WhatsAppFloatingButtonProps {
  activeScooterName?: string;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  activeScooterName,
}) => {
  const store = useStore();
  const settings = store.getSettings();
  const [showTooltip, setShowTooltip] = useState(true);

  const message = activeScooterName
    ? `Hello ${settings.dealerName}, I am interested in the ${activeScooterName} electric scooter. Please share price, test ride availability and specs.`
    : `Hello ${settings.dealerName}, I am interested in your Hestur Energy electric scooters. Please share available models, prices and details.`;

  const handleClick = () => {
    const link = generateWhatsAppLink(settings.whatsappNumber, message);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Tooltip prompt */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.94 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mb-2 bg-[#111827] text-white text-xs py-2 px-3.5 rounded-xl shadow-2xl border border-slate-700/80 flex items-center gap-2 max-w-[220px]"
          >
          <span>Need help? Chat with our dealership team</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-white"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        onClick={handleClick}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.5 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-xl shadow-[#25D366]/30 transition-colors duration-200 group focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
        aria-label="Chat on WhatsApp"
        title="Chat with Nakshatra Motors on WhatsApp"
      >
        <MessageSquare className="w-7 h-7 fill-white stroke-none group-hover:scale-105 transition-transform" />
      </motion.button>
    </div>
  );
};
