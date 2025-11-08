import React from 'react';
import ScrollReveal from './ui/ScrollReveal';

const AboutSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-100 dark:bg-[#101629]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
              About <span className="text-primary dark:text-secondary">SIF-FABLAB</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Fostering creativity and hands-on learning.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <img
              src="https://picsum.photos/800/600?random=1"
              alt="FABLAB Workspace"
              className="rounded-2xl shadow-lg w-full h-auto object-cover"
            />
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="dark:text-slate-300 space-y-4">
              <p className="text-lg">
                The <strong className="text-primary dark:text-secondary">SIF-FABLAB</strong> (Sonipat Incubation Foundation - Fabrication Laboratory) is a cutting-edge facility designed to empower students, researchers, and innovators. We provide access to advanced digital fabrication tools and technologies.
              </p>
              <p>
                Our mission is to create an open and collaborative environment where ideas can be prototyped, tested, and transformed into tangible products. Whether you're a seasoned maker or just starting, our lab is here to support your creative journey.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>State-of-the-art 3D printers and laser cutters.</li>
                <li>Comprehensive electronics and robotics kits.</li>
                <li>Expert guidance and regular workshops.</li>
                <li>A vibrant community of makers and innovators.</li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
