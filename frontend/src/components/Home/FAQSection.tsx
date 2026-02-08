import React, { useState } from "react";
import { Accordion } from "../ui/Accordion";
import ScrollReveal from "../ui/ScrollReveal";

// Categorized FAQ data
const faqData: Record<string, { trigger: string; content: string }[]> = {
  general: [
    {
      trigger: "What is a FABLAB?",
      content:
        "A FABLAB is a hands-on innovation space for fabrication, prototyping, and creative product development.",
    },
    {
      trigger: "Who can use the FABLAB?",
      content:
        "Students, faculty members, startups, and innovators are welcome to use the FABLAB.",
    },
    {
      trigger: "What types of projects are supported?",
      content:
        "The FABLAB supports academic projects, research work, startup ideas, and prototype development.",
    },
    {
      trigger: "Do I need prior experience to use the FABLAB?",
      content:
        "No prior experience is required. Basic training and guidance will be provided before using the equipment.",
    },
    {
      trigger: "What are the working hours?",
      content: "The FABLAB operates on working days from 8:00 AM to 8:00 PM.",
    },
  ],
  equipment: [
    {
      trigger: "What equipment is available in the FABLAB?",
      content:
        "The lab is equipped with CNC machines, laser cutters, electronics tools, and IoT development equipment.",
    },
    {
      trigger: "Are Arduino and Raspberry Pi kits available?",
      content:
        "Yes, Arduino and Raspberry Pi boards are available along with sensors, motors, and supporting modules.",
    },
    {
      trigger: "Is training mandatory before using the machines?",
      content:
        "Yes, safety instructions and machine-specific training are mandatory for all users.",
    },
    {
      trigger: "Can I bring my own materials to use in the FABLAB?",
      content:
        "Yes, you may bring your own materials, subject to safety and compatibility approval.",
    },
    {
      trigger: "Is technical support available during usage?",
      content:
        "Yes, trained staff members are available to provide technical assistance during lab hours.",
    },
  ],
  booking: [
    {
      trigger: "How can I book the FABLAB or its equipment?",
      content:
        "Bookings can be made through the official online booking portal.",
    },
    {
      trigger: "Is advance booking required?",
      content:
        "Yes, advance booking is recommended to ensure equipment availability.",
    },
    {
      trigger: "Are there any usage charges?",
      content:
        "Usage charges depend on the type of equipment and the duration of use.",
    },
    {
      trigger: "Can I cancel or reschedule my booking?",
      content:
        "Yes, cancellations and rescheduling are allowed as per the booking policy.",
    },
    {
      trigger: "Can external users access the FABLAB?",
      content:
        "Yes, external users can book the FABLAB, subject to approval and usage guidelines.",
    },
  ],
};

const categoryLabels: { key: keyof typeof faqData; label: string }[] = [
  { key: "general", label: "General" },
  { key: "equipment", label: "Equipment" },
  { key: "booking", label: "Booking" },
];

const FAQSection: React.FC = () => {
  const [activeCategory, setActiveCategory] =
    useState<keyof typeof faqData>("general");

  const items = faqData[activeCategory];

  return (
    <section className="min-h-screen flex flex-col justify-center bg-blue-950 py-12 sm:py-16 lg:py-20">
      <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white inline-block border-b-4 border-yellow-300">
              Frequently Asked{" "}
              <span className="text-yellow-300">Questions</span>
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Have questions? We have answers.
            </p>
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
                    "relative px-5 py-2 rounded-sm text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 " +
                    (active
                      ? "bg-yellow-300 text-blue-950 shadow-md"
                      : "bg-blue-900 text-blue-100 hover:bg-blue-800 border border-blue-700 shadow-sm hover:shadow-md transform hover:-translate-y-0.5")
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
