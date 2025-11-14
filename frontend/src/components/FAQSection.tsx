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
    },
    {
      trigger: 'What are the operating hours?',
      content:
        'The FABLAB is open Monday through Friday from 9:00 AM to 8:00 PM, and weekends from 10:00 AM to 6:00 PM. Extended hours may be available during project deadlines with prior arrangement.'
    },
    {
      trigger: 'Is there parking available?',
      content:
        'Yes, free parking is available in the designated areas near the building. Visitor parking passes can be obtained from the main reception desk for external members.'
    },
    {
      trigger: 'Can I work on personal projects?',
      content:
        'Absolutely! The FABLAB encourages both academic and personal projects. Personal projects help you learn and explore creativity while developing practical skills with our equipment.'
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
    },
    {
      trigger: 'What equipment is available in the FABLAB?',
      content:
        'We have 3D printers, laser cutters, CNC machines, soldering stations, oscilloscopes, PCB fabrication tools, woodworking tools, and a complete electronics prototyping setup with various sensors and microcontrollers.'
    },
    {
      trigger: 'Can I use my own tools and materials?',
      content:
        'Yes, you can bring your own tools and materials as long as they meet our safety standards and are approved by the lab manager. This helps keep your project costs down.'
    },
    {
      trigger: 'What if I break or damage equipment?',
      content:
        'Accidents happen! Report any damage immediately to lab staff. Minor wear and tear is expected, but deliberate misuse or failure to follow safety protocols may result in repair charges or restricted access.'
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
    },
    {
      trigger: 'How far in advance can I book equipment?',
      content:
        'You can book equipment up to 2 weeks in advance. Popular machines like 3D printers and laser cutters tend to fill up quickly, so we recommend booking as early as possible for your project timeline.'
    },
    {
      trigger: 'What happens if I run over my booked time?',
      content:
        'You have a 15-minute grace period. Beyond that, if no one else is waiting, you can continue working. However, if someone has the next slot booked, you must wrap up and clean your workspace.'
    },
    {
      trigger: 'Can I book multiple machines at once?',
      content:
        'Yes, you can book multiple machines simultaneously if your project requires it. However, you must be physically present to operate each machine and cannot leave them unattended during your booking slot.'
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
    <section className="min-h-screen flex flex-col justify-center bg-blue-950 py-12 sm:py-16 lg:py-20">
      <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white inline-block border-b-4 border-yellow-300">
              Frequently Asked <span className="text-yellow-300">Questions</span>
            </h2>
            <p className="mt-4 text-lg text-blue-100">Have questions? We have answers.</p>
          </div>
        </ScrollReveal>

        {/* Category Toggle */}
        <ScrollReveal delay={100}>
          <div className="flex flex-wrap justify-center gap-4 lg:gap-6 mb-12 lg:mb-16">
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
                      ? 'bg-yellow-300 text-blue-950 shadow-md'
                      : 'bg-blue-900 text-blue-100 hover:bg-blue-800 border border-blue-700 shadow-sm hover:shadow-md transform hover:-translate-y-0.5')
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
          <div className="max-w-6xl mx-auto">
            <Accordion items={items} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FAQSection;
