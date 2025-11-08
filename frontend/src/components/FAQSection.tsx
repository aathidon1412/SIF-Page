import React, { useState } from 'react';
import { Accordion } from './ui/Accordion';
import ScrollReveal from './ui/ScrollReveal';

// Categorized FAQ data
const faqData: Record<string, { trigger: string; content: string }[]> = {
  general: [
    {
      trigger: 'Who can use the FABLAB?',
      content:
        'The lab is open to all students, faculty, and staff of the college. We also offer memberships for external enthusiasts and startups. Contact us for more details on access policies.'
    },
    {
      trigger: 'Are there any costs involved?',
      content:
        'Access to the lab is free for all college members. However, there is a nominal fee for consumables like 3D printing filament, acrylic sheets, and other materials. You can bring your own materials if they are approved by the lab manager.'
    }
  ],
  equipment: [
    {
      trigger: 'Do I need prior experience to use the equipment?',
      content:
        'No prior experience is necessary for most equipment. We provide mandatory safety and basic usage training for all new members. For advanced machinery, we offer specialized workshops and one-on-one sessions.'
    },
    {
      trigger: 'Is training provided for all machines?',
      content:
        'Yes. Each machine has a corresponding introductory module. Completion unlocks booking privileges for that specific equipment.'
    }
  ],
  booking: [
    {
      trigger: 'How do I book a machine?',
      content:
        "Machine booking is done through our online portal. Create an account, finish required training modules, then reserve time slots for the equipment you need."
    },
    {
      trigger: 'Can I cancel or reschedule a booking?',
      content:
        'Yes, up to 2 hours before the slot starts. After that, please contact a lab manager to avoid a no-show penalty.'
    }
  ]
};

const categoryLabels: { key: keyof typeof faqData; label: string }[] = [
  { key: 'general', label: 'General' },
  { key: 'equipment', label: 'Equipment' },
  { key: 'booking', label: 'Booking' }
];

const FAQSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<keyof typeof faqData>('general');

  const items = faqData[activeCategory];

  return (
    <section className="py-20 bg-blue-900">
      <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-10">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Frequently Asked <span className="text-yellow-300">Questions</span>
            </h2>
            <p className="mt-4 text-lg text-blue-100">Have questions? We have answers.</p>
          </div>
        </ScrollReveal>

        {/* Category Toggle */}
        <ScrollReveal delay={100}>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categoryLabels.map(({ key, label }) => {
              const active = key === activeCategory;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveCategory(key)}
                  className={
                    'relative px-5 py-2 rounded-sm text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 ' +
                    (active
                      ? 'bg-yellow-400 text-blue-900 shadow-md'
                      : 'bg-blue-800 text-blue-100 hover:bg-blue-700 border border-blue-600 shadow-sm hover:shadow-md transform hover:-translate-y-0.5')
                  }
                >
                  {label}
                  {active && (
                    <span className="absolute inset-x-0 -bottom-px mx-auto h-[2px] w-1/2 rounded bg-gradient-to-r from-transparent via-white to-transparent" />
                  )}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Accordion */}
        <ScrollReveal delay={200}>
          <div className="max-w-3xl mx-auto">
            <Accordion items={items} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FAQSection;
