import React from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';

const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle form submission here.
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <div className="bg-slate-50 dark:bg-[#0A0F1E]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100">
              Get In <span className="text-primary dark:text-secondary">Touch</span>
            </h1>
            <p className="mt-4 text-lg max-w-3xl mx-auto text-slate-600 dark:text-slate-400">
              We're here to help and answer any questions you might have. We look forward to hearing from you.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <ScrollReveal>
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">Contact Details</h2>
                <ul className="space-y-2 text-lg text-slate-700 dark:text-slate-300">
                  <li className="flex items-center">
                    <span className="mr-3 text-primary dark:text-secondary">📧</span> Email: info@sif-fablab.edu
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-primary dark:text-secondary">📞</span> Phone: (123) 456-7890
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3 text-primary dark:text-secondary">📍</span> Address: 123 Innovation Drive, Tech Campus, Sonipat
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">Location</h2>
                {/* Placeholder for a map */}
                <div className="aspect-w-16 aspect-h-9 bg-base-200 dark:bg-neutral-focus rounded-lg shadow-md flex items-center justify-center">
                   <img src="https://picsum.photos/1200/600?random=3" alt="Map placeholder" className="rounded-lg object-cover w-full h-full"/>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Contact Form */}
          <ScrollReveal delay={200}>
            <div className="bg-slate-100 dark:bg-[#1A2033] dark:border dark:border-slate-800/50 p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="label">
                    <span className="label-text text-slate-700 dark:text-slate-300">Full Name</span>
                  </label>
                  <input type="text" id="name" placeholder="Your Name" className="input input-bordered w-full bg-white/50 dark:bg-slate-900/50 dark:border-slate-700" required />
                </div>
                <div>
                  <label htmlFor="email" className="label">
                    <span className="label-text text-slate-700 dark:text-slate-300">Email Address</span>
                  </label>
                  <input type="email" id="email" placeholder="your.email@example.com" className="input input-bordered w-full bg-white/50 dark:bg-slate-900/50 dark:border-slate-700" required />
                </div>
                <div>
                  <label htmlFor="message" className="label">
                    <span className="label-text text-slate-700 dark:text-slate-300">Message</span>
                  </label>
                  <textarea id="message" className="textarea textarea-bordered w-full h-32 bg-white/50 dark:bg-slate-900/50 dark:border-slate-700" placeholder="Your message..." required></textarea>
                </div>
                <div>
                  <button type="submit" className="btn btn-primary w-full">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default Contact;
