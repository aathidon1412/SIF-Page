import React from 'react';
import { NavLink } from 'react-router-dom';
import { Meteors } from './ui/Meteors';
import ScrollReveal from './ui/ScrollReveal';

const HeroSection: React.FC = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="relative z-10 text-center p-4">
        <ScrollReveal>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
            Welcome to <span className="text-primary dark:text-secondary">SIF-FABLAB</span>
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-slate-600 dark:text-slate-400 mb-8">
            Your hub for innovation and creation. Access state-of-the-art equipment and bring your ideas to life.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={400}>
          <div className="flex justify-center items-center gap-4">
            <NavLink to="/about" className="btn btn-primary">
              Explore Us
            </NavLink>
            <NavLink to="/contact" className="btn btn-outline btn-secondary">
              Contact Us
            </NavLink>
          </div>
        </ScrollReveal>
      </div>
      <Meteors number={30} />
    </div>
  );
};

export default HeroSection;
