import React from 'react';
import { Accordion } from './ui/Accordion';
import ScrollReveal from './ui/ScrollReveal';

const faqItems = [
  {
    trigger: "Who can use the FABLAB?",
    content: "The lab is open to all students, faculty, and staff of the college. We also offer memberships for external enthusiasts and startups. Contact us for more details on access policies.",
  },
  {
    trigger: "Do I need prior experience to use the equipment?",
    content: "No prior experience is necessary for most equipment. We provide mandatory safety and basic usage training for all new members. For advanced machinery, we offer specialized workshops and one-on-one sessions.",
  },
  {
    trigger: "How do I book a machine?",
    content: "Machine booking is done through our online portal. You'll need to create an account, complete the required training modules, and then you can reserve time slots for the equipment you need.",
  },
  {
    trigger: "Are there any costs involved?",
    content: "Access to the lab is free for all college members. However, there is a nominal fee for consumables like 3D printing filament, acrylic sheets, and other materials. You can bring your own materials, provided they are approved by the lab manager.",
  },
];

const FAQSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-100 dark:bg-[#101629]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Have questions? We have answers.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <div className="max-w-3xl mx-auto">
            <Accordion items={faqItems} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FAQSection;
