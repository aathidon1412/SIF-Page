import React from 'react';
import ScrollReveal from './ui/ScrollReveal';

const AboutSection: React.FC = () => {
  return (
    <section className="py-20 bg-blue-900">
      <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-10 space-y-20">
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
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                About <span className="text-yellow-300">SIF</span>
              </h2>
              <p className="mt-4 text-lg text-blue-100">
                <span className="font-medium text-yellow-300 px-1 rounded">Sonipat Incubation Foundation</span> (SIF) is an initiative focused on nurturing <span className="text-yellow-300 font-medium">innovation</span>, <span className="text-yellow-300 font-medium">entrepreneurship</span>, and research-driven problem solving. We support student founders and researchers with mentorship, infrastructure, and programs that accelerate ideas into impact.
              </p>
              <ul className="mt-4 list-disc list-inside space-y-2 text-blue-100">
                <li><span className="font-medium text-white">Mentorship</span> and incubation programs</li>
                <li>Access to labs, <span className="font-medium text-yellow-300 px-1 rounded">funding</span>, and industry connects</li>
                <li>Events, hackathons, and <span className="text-yellow-300 font-medium">startup showcases</span></li>
              </ul>
              <div className="mt-6">
                <a
                  href="#sif-more"
                  className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-5 py-2 text-sm font-medium rounded-sm shadow-md transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
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
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                About <span className="text-yellow-300">FABLAB</span>
              </h2>
              <p className="mt-4 text-lg text-blue-100">
                The <span className="font-semibold text-yellow-300">FABLAB</span> is a hands-on fabrication space with 3D printers, laser cutters, PCB milling, and a full electronics bench. It enables <span className="font-medium text-yellow-300 px-1 rounded">rapid prototyping</span>, learning by doing, and transforming ideas into functional products.
              </p>
              <ul className="mt-4 list-disc list-inside space-y-2 text-blue-100">
                <li>Advanced digital <span className="text-yellow-300 font-medium">fabrication tools</span></li>
                <li>Safety and <span className="font-medium text-yellow-300 px-1 rounded">usage trainings</span> for all users</li>
                <li>Guided workshops and <span className="text-yellow-300 font-medium">project support</span></li>
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
