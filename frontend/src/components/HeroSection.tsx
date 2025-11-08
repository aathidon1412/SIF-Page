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
            <span className="relative inline-block">
              Welcome
              <span className="absolute -bottom-1 left-0 h-[6px] w-24 rounded-full bg-yellow-300/40 dark:bg-yellow-300/30" />
            </span>{' '}to <span className="relative text-yellow-300/40 dark:text-yellow-300">
              SIF-FABLAB
              <span className="absolute -bottom-1 left-0 h-[6px] w-32 rounded-full bg-blue-500/20 dark:bg-blue-400/20" />
            </span>
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-slate-600 dark:text-slate-400 mb-8">
            Your hub for <span className="font-medium text-blue-600 dark:text-blue-400">innovation</span> and <span className="bg-yellow-200/40 dark:bg-yellow-300/20 px-1 rounded">creation</span>. Access state-of-the-art equipment and bring your ideas to life.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={400}>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <NavLink
              to="/about"
              aria-label="Explore SIF-FABLAB"
              className="px-6 py-3 text-base flex items-center gap-2 rounded-full shadow-sm transition-colors duration-150 bg-primary text-yellow-300/40 hover:text-yellow-300 dark:bg-secondary dark:text-yellow-300"
            >
              <span>Explore Us</span>
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </NavLink>

            <NavLink
              to="/contact"
              aria-label="Contact SIF-FABLAB"
              className="px-6 py-3 text-base flex items-center gap-2 rounded-full shadow-sm transition-colors duration-150 bg-transparent border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            >
              <span>Contact Us</span>
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M22 2 11 13" />
                <path d="M22 2 15 22 11 13 2 9 22 2z" />
              </svg>
            </NavLink>
          </div>
        </ScrollReveal>
      </div>
      <Meteors number={30} />
    </div>
  );
};

export default HeroSection;
