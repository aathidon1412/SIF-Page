import React from 'react';
import ScrollReveal from './ui/ScrollReveal';

const AboutSection: React.FC = () => {
  return (
    <section className="min-h-screen bg-blue-950 flex flex-col">
      <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-10 flex-1 flex flex-col">
        {/* Section 1: About SIF - 50% of screen */}
        <div className="flex-1 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-8 lg:py-16">
          <ScrollReveal>
            <div className="text-left">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
                About <span className="text-yellow-300">SIF</span>
              </h2>
              <p className="text-sm lg:text-base text-blue-100 leading-relaxed mb-6">
                <span className="font-medium text-yellow-300">Sona Incubation Foundation</span> (SIF) is an initiative focused on nurturing <span className="text-yellow-300 font-medium">innovation</span>, <span className="text-yellow-300 font-medium">entrepreneurship</span>, and research-driven problem solving. We support student founders and researchers with mentorship, infrastructure, and programs that accelerate ideas into impact.
              </p>
              
              <ul className="list-disc list-inside space-y-2 text-blue-100 text-sm mb-8">
                <li><span className="font-medium text-white">Mentorship</span> and incubation programs</li>
                <li>Access to labs, <span className="font-medium text-yellow-300">funding</span>, and industry connects</li>
                <li>Events, hackathons, and <span className="text-yellow-300 font-medium">startup showcases</span></li>
              </ul>
              
              <div>
                <a
                  href="#sif-more"
                  className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-6 py-3 text-base font-medium rounded-sm shadow-md transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Read more about SIF
                </a>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <img
              src="https://picsum.photos/800/600?random=11"
              alt="SIF Logo"
              className="rounded-xl shadow-lg w-full h-auto object-cover max-h-[50vh]"
            />
          </ScrollReveal>
        </div>

        {/* Section 2: About FABLAB - 50% of screen */}
        <div className="flex-1 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-8 lg:py-16">
          <ScrollReveal className="order-2 lg:order-1">
            <img
              src="https://picsum.photos/800/600?random=22"
              alt="FABLAB Logo"
              className="rounded-xl shadow-lg w-full h-auto object-cover max-h-[50vh]"
            />
          </ScrollReveal>
          <ScrollReveal delay={150} className="order-1 lg:order-2">
            <div className="text-left">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
                About <span className="text-yellow-300">FABLAB</span>
              </h2>
              <p className="text-sm lg:text-base text-blue-100 leading-relaxed mb-6">
                The <span className="font-semibold text-yellow-300">FABLAB</span> is a hands-on fabrication space with 3D printers, laser cutters, PCB milling, and a full electronics bench. It enables <span className="font-medium text-yellow-300">rapid prototyping</span>, learning by doing, and transforming ideas into functional products.
              </p>
              
              <ul className="list-disc list-inside space-y-2 text-blue-100 text-sm mb-8">
                <li>Advanced digital <span className="text-yellow-300 font-medium">fabrication tools</span></li>
                <li>Safety and <span className="font-medium text-yellow-300">usage trainings</span> for all users</li>
                <li>Guided workshops and <span className="text-yellow-300 font-medium">project support</span></li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
