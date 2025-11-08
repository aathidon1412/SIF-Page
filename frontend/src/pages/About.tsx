import React from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';

const teamMembers = [
  { name: 'Dr. Evelyn Reed', role: 'Lab Director', imageUrl: 'https://picsum.photos/200/200?random=10' },
  { name: 'Marcus Chen', role: 'Lead Technician', imageUrl: 'https://picsum.photos/200/200?random=11' },
  { name: 'Aisha Khan', role: 'Community Manager', imageUrl: 'https://picsum.photos/200/200?random=12' },
  { name: 'Leo Martinez', role: 'Electronics Specialist', imageUrl: 'https://picsum.photos/200/200?random=13' },
];

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
              <h2 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">Our Mission</h2>
              <p className="mb-6">
                To democratize access to digital fabrication technologies, fostering a culture of innovation, collaboration, and lifelong learning. We aim to empower individuals to turn their creative ideas into reality, driving both personal growth and technological advancement.
              </p>
              <h2 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">Our Vision</h2>
              <p>
                To be a leading hub for digital fabrication and interdisciplinary research, recognized for its contribution to education, entrepreneurship, and community development. We envision a future where anyone can design and create solutions to the world's challenges.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Meet the Team */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">Meet the Team</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              The passionate individuals dedicated to supporting your journey.
            </p>
          </ScrollReveal>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <ScrollReveal key={member.name} delay={index * 100}>
              <div className="text-center">
                <img src={member.imageUrl} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 shadow-lg object-cover" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{member.name}</h3>
                <p className="text-primary dark:text-secondary">{member.role}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
