import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Calendar, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../lib/store';
import { validateEnquiry, generateWhatsAppLink } from '../../utils/evCalculations';

interface TestRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialScooterName?: string;
}

export const TestRideModal: React.FC<TestRideModalProps> = ({
  isOpen,
  onClose,
  initialScooterName,
}) => {
  const store = useStore();
  const scooters = store.getScooters();
  const settings = store.getSettings();

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [scooterModel, setScooterModel] = useState(
    initialScooterName || scooters[0]?.name || 'Hestur Dyno'
  );
  const [preferredDate, setPreferredDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('Morning (10:00 AM - 1:00 PM)');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateEnquiry({
      fullName,
      mobile,
      scooterModel,
      enquiryType: 'Test Ride',
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      store.addEnquiry({
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        scooterModel,
        enquiryType: 'Test Ride',
        preferredDate: preferredDate || undefined,
        message: `Booked test ride for ${scooterModel}. Preferred time: ${timeSlot}.`,
      });

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 400);
  };

  const handleWhatsAppConfirmation = () => {
    const text = `Hello ${settings.dealerName}, I booked a test ride for the ${scooterModel} on ${preferredDate || 'upcoming weekend'} (${timeSlot}). Looking forward to experiencing it!`;
    const link = generateWhatsAppLink(settings.whatsappNumber, text);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="relative bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-slate-900"
          >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Test Ride Reserved!</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We have booked your test ride for the <strong className="text-slate-900">{scooterModel}</strong>.
              Our showroom executive will call <strong className="text-slate-900 font-mono">{mobile}</strong> shortly to confirm your slot.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleWhatsAppConfirmation}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Send Confirmation on WhatsApp
              </button>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
                className="w-full py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-medium"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                Authorized Dealership Experience
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Book a Free Test Ride
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Experience instant torque and smooth electric ride quality on real road conditions.
              </p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Anand Rao"
                className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:bg-white transition-colors ${
                  errors.fullName ? 'border-red-500' : 'border-slate-200 focus:border-blue-600'
                }`}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit mobile number"
                className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-mono focus:outline-none focus:bg-white transition-colors ${
                  errors.mobile ? 'border-red-500' : 'border-slate-200 focus:border-blue-600'
                }`}
              />
              {errors.mobile && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.mobile}
                </p>
              )}
            </div>

            {/* Model Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Select Scooter Model
              </label>
              <select
                value={scooterModel}
                onChange={(e) => setScooterModel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                {scooters.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.certifiedRange} km)
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Time Window
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  <option value="Morning (10:00 AM - 1:00 PM)">Morning (10 AM - 1 PM)</option>
                  <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1 PM - 4 PM)</option>
                  <option value="Evening (4:00 PM - 7:30 PM)">Evening (4 PM - 7:30 PM)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 bg-[#CCFF00] hover:bg-[#b8e600] active:scale-[0.98] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Reserving...' : 'Confirm Test Ride Booking ↗'}
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              Please carry a valid driving license for your test ride. Helmets are provided.
            </p>
          </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
