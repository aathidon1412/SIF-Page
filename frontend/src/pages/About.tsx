import React from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import { AnimatedTestimonials } from '../components/ui/AnimatedTestimonials';

export function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
        "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
      name: "Sarah Chen",
      designation: "Product Manager at TechFlow",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: "Michael Rodriguez",
      designation: "CTO at InnovateSphere",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
      name: "Emily Watson",
      designation: "Operations Director at CloudScale",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
      name: "James Kim",
      designation: "Engineering Lead at DataPro",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
      name: "Lisa Thompson",
      designation: "VP of Technology at FutureNet",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}

const About: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-[#0A0F1E]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100">
              About <span className="text-yellow-300/40 dark:text-yellow-300">SIF-FABLAB</span>
            </h1>
            <p className="mt-4 text-lg max-w-3xl mx-auto text-slate-600 dark:text-slate-400">
              Discover our mission, our history, and the team that makes innovation happen every day.
            </p>
          </div>
        </ScrollReveal>

        {/* Mission and Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-20 items-center bg-slate-100 dark:bg-[#101629] p-8 rounded-2xl">
          <ScrollReveal>
            <img src="https://picsum.photos/800/600?random=2" alt="Lab collaboration" className="rounded-2xl shadow-lg"/>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="text-slate-700 dark:text-slate-300">
              <section aria-labelledby="mission-heading" className="mb-8">
                <h2 id="mission-heading" className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">Our Mission</h2>
                <p className="text-base leading-relaxed">
                  To democratize access to digital fabrication technologies, fostering a culture of innovation, collaboration, and lifelong learning.
                </p>
              </section>

              {/* decorative separator */}
              <div role="separator" aria-hidden="true" className="my-8 flex items-center">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-300/60 to-transparent" />
                <div className="mx-4 w-10 h-1 bg-gradient-to-r from-yellow-300 to-blue-400 rounded-full shadow-sm" />
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-blue-300/60 to-transparent" />
              </div>

              <section aria-labelledby="vision-heading" className="mt-8">
                <h2 id="vision-heading" className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">Our Vision</h2>
                <p className="text-base leading-relaxed">
                  To be a leading hub for digital fabrication and interdisciplinary research, recognized for its contribution to education, entrepreneurship, and community development.
                </p>
              </section>
            </div>
          </ScrollReveal>
  </div>

  <AnimatedTestimonialsDemo />
      </div>
    </div>
  );
};

export default About;
