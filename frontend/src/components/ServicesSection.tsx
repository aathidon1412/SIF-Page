import React from 'react';
import ScrollReveal from './ui/ScrollReveal';
import { HoverEffect } from "@/components/ui/card-hover-effect";

interface Service {
  icon: string;
  title: string;
  description: string;
}

const services: Service[] = [
  {
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    title: '3D Printing',
    description: 'Bring digital models to life with our high-precision FDM and Resin 3D printers.'
  },
  {
    icon: 'M5 13l4 4L19 7',
    title: 'Laser Cutting & Engraving',
    description: 'Cut and engrave intricate designs on various materials like wood, acrylic, and fabric.'
  },
  {
    icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V4m0 16v-2M8 9a4 4 0 100-8 4 4 0 000 8z',
    title: 'Electronics Workbench',
    description: 'Access soldering stations, oscilloscopes, and components for your electronic projects.'
  },
  {
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    title: 'PCB Milling',
    description: 'Create custom printed circuit boards for your prototypes and final products.'
  },
  {
    icon: 'M17 20h5V4h-5v16zM3 20h5V4H3v16z',
    title: 'Workshops & Training',
    description: 'Join our regular workshops to learn new skills and master the lab equipment.'
  },
  {
    icon: 'M12 6.253v11.494m-9-5.747h18',
    title: 'Project Consultation',
    description: 'Get expert advice and guidance from our lab managers for your projects.'
  },
];


const ServicesSection: React.FC = () => {
  const items = services.map((s) => ({
    title: s.title,
    description: s.description,
    link: "#",
  }));
  return (
    <section className="py-20 bg-slate-50 dark:bg-[#0A0F1E]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
              <span className="relative inline-block">Our Facilities<span className="absolute -bottom-1 left-0 h-[5px] w-24 rounded-full bg-yellow-300/40 dark:bg-yellow-300/30" /></span> &{' '}<span className="relative inline-block">Services<span className="absolute -bottom-1 left-0 h-[5px] w-24 rounded-full bg-blue-500/20 dark:bg-blue-400/20" /></span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Everything you need to <span className="bg-yellow-200/40 dark:bg-yellow-300/20 px-1 rounded">build</span> anything.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <HoverEffect items={items} className="gap-6" />
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ServicesSection;
