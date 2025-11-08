import React from 'react';
import ScrollReveal from './ui/ScrollReveal';

const AboutSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-100 dark:bg-[#101629]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Section 1: About SIF */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <img
              src="https://picsum.photos/800/600?random=11"
              alt="SIF Community"
              className="rounded-2xl shadow-lg w-full h-auto object-cover"
            />
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
                About <span className="relative text-blue-600 dark:text-blue-400">SIF<span className="absolute -bottom-1 left-0 h-[6px] w-10 rounded-full bg-yellow-300/50 dark:bg-yellow-300/30"/></span>
              </h2>
              <p className="mt-4 text-lg text-slate-700 dark:text-slate-300">
                <span className="bg-yellow-200/40 dark:bg-yellow-300/20 px-1 rounded">Sonipat Incubation Foundation</span> (SIF) is an initiative focused on nurturing <span className="text-blue-600 dark:text-blue-400 font-medium">innovation</span>, <span className="text-blue-600 dark:text-blue-400 font-medium">entrepreneurship</span>, and research-driven problem solving. We support student founders and researchers with mentorship, infrastructure, and programs that accelerate ideas into impact.
              </p>
              <ul className="mt-4 list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                <li><span className="font-medium text-slate-800 dark:text-slate-200">Mentorship</span> and incubation programs</li>
                <li>Access to labs, <span className="bg-blue-50 dark:bg-blue-900/30 px-1 rounded">funding</span>, and industry connects</li>
                <li>Events, hackathons, and <span className="text-yellow-600 dark:text-yellow-400 font-medium">startup showcases</span></li>
              </ul>
              <div className="mt-6">
                <a
                  href="#sif-more"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-5 py-2 text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Read more about SIF
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Section 2: About FABLAB */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <ScrollReveal className="order-2 md:order-1">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
                About <span className="relative text-blue-600 dark:text-blue-400">FABLAB<span className="absolute -bottom-1 left-0 h-[6px] w-16 rounded-full bg-yellow-300/50 dark:bg-yellow-300/30"/></span>
              </h2>
              <p className="mt-4 text-lg text-slate-700 dark:text-slate-300">
                The <span className="font-semibold text-blue-600 dark:text-blue-400">FABLAB</span> is a hands-on fabrication space with 3D printers, laser cutters, PCB milling, and a full electronics bench. It enables <span className="bg-yellow-200/40 dark:bg-yellow-300/20 px-1 rounded">rapid prototyping</span>, learning by doing, and transforming ideas into functional products.
              </p>
              <ul className="mt-4 list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                <li>Advanced digital <span className="text-blue-600 dark:text-blue-400 font-medium">fabrication tools</span></li>
                <li>Safety and <span className="bg-blue-50 dark:bg-blue-900/30 px-1 rounded">usage trainings</span> for all users</li>
                <li>Guided workshops and <span className="text-yellow-600 dark:text-yellow-400 font-medium">project support</span></li>
              </ul>
              
            </div>
          </ScrollReveal>
          <ScrollReveal delay={150} className="order-1 md:order-2">
            <img
              src="https://picsum.photos/800/600?random=22"
              alt="FABLAB Workspace"
              className="rounded-2xl shadow-lg w-full h-auto object-cover"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
