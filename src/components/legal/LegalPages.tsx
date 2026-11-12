import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../../lib/store';
import { EASE_OUT_EXPO } from '../common/MotionPrimitives';

interface LegalSectionItem {
  title: string;
  body: React.ReactNode;
}

const LegalPageLayout: React.FC<{
  title: string;
  lastUpdated: string;
  sections: LegalSectionItem[];
}> = ({ title, lastUpdated, sections }) => (
  <div className="pt-24 sm:pt-28 pb-16 sm:pb-20 bg-[#F8FAFC]">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
        className="border-b border-slate-200 pb-6 mb-8"
      >
        <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
          Legal &amp; Dealership Policy
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h1>
        <p className="text-xs font-medium text-slate-500 mt-2">Last updated: {lastUpdated}</p>
      </motion.div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: 0.06 * (index + 1),
              ease: EASE_OUT_EXPO,
            }}
            className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-2">{section.title}</h2>
            <p className="text-sm text-slate-700 leading-relaxed">{section.body}</p>
          </motion.section>
        ))}
      </div>
    </div>
  </div>
);

export const PrivacyPolicyPage: React.FC = () => {
  const store = useStore();
  const settings = store.getSettings();

  return (
    <LegalPageLayout
      title="Privacy Policy"
      lastUpdated="November 2026"
      sections={[
        {
          title: '1. Overview',
          body: (
            <>
              {settings.dealerName} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), an
              authorized dealership of Hestur Energy, respects your privacy and is committed to
              safeguarding any personal information you share with us through our website and
              showroom facilities.
            </>
          ),
        },
        {
          title: '2. Information We Collect',
          body: 'When you request a test ride, submit an enquiry, or schedule dealership service, we collect information such as your full name, mobile number, email address, vehicle model interest, and test ride preferences.',
        },
        {
          title: '3. How We Use Your Information',
          body: 'Your information is used solely to coordinate your test ride appointment, provide on-road price quotes and financing assistance, deliver customer support, and fulfill mandatory RTO vehicle registration requirements. We never sell or license customer data to third parties.',
        },
        {
          title: '4. Communications',
          body: (
            <>
              By submitting an enquiry, you consent to receive direct communications via telephone,
              SMS, or WhatsApp from authorized sales advisors of {settings.dealerName}.
            </>
          ),
        },
        {
          title: '5. Contact Us',
          body: (
            <>
              If you have questions regarding our privacy practices, contact us at {settings.email}{' '}
              or call {settings.phone}.
            </>
          ),
        },
      ]}
    />
  );
};

export const TermsPage: React.FC = () => {
  const store = useStore();
  const settings = store.getSettings();

  return (
    <LegalPageLayout
      title="Terms & Conditions"
      lastUpdated="November 2026"
      sections={[
        {
          title: '1. Dealership Authority',
          body: (
            <>
              {settings.dealerName} operates as an authorized dealer for Hestur Energy electric
              vehicles. All vehicle sales, warranty policies, and service obligations are governed
              by official manufacturer guidelines.
            </>
          ),
        },
        {
          title: '2. Pricing & Subsidies',
          body: 'Prices displayed on this website represent ex-showroom indicative figures and are subject to applicable local taxes, state EV incentives, insurance, and RTO registration charges at the time of invoicing.',
        },
        {
          title: '3. Test Ride Eligibility',
          body: 'All test ride riders must hold a valid Indian Driving License and comply with safety protocols including mandatory helmet usage during test rides.',
        },
        {
          title: '4. Official Warranties',
          body: (
            <>
              Vehicle and battery warranties are provided by Hestur Energy through{' '}
              {settings.dealerName}{' '}
              subject to manufacturer terms, periodic service maintenance schedules, and adherence
              to recommended charging guidelines.
            </>
          ),
        },
      ]}
    />
  );
};
