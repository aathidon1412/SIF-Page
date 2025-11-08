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
              Get In <span className="text-blue-600 dark:text-blue-400">Touch</span>
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
            <div className="bg-white/90 dark:bg-[#0f1724]/60 dark:border dark:border-slate-800/50 p-10 md:p-12 rounded-2xl shadow-xl">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900 dark:text-slate-100 tracking-tight leading-tight">Send us a <span className="text-blue-600 dark:text-blue-400">Message</span></h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-xl">Have a question, project idea or need assistance? Send us a message and our team will get back to you shortly.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Full name</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Your name"
                    className="w-full rounded-xl border border-slate-200 bg-white/80 dark:bg-white/3 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email address</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-slate-200 bg-white/80 dark:bg-white/3 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Message</span>
                  </label>
                  <textarea
                    id="message"
                    className="w-full rounded-xl border border-slate-200 bg-white/85 dark:bg-white/4 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition h-40 resize-y"
                    placeholder="Write your message..."
                    required
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full rounded-full px-6 py-3 bg-transparent border-2 border-primary dark:border-secondary text-slate-900 dark:text-slate-100 font-semibold hover:bg-primary/10 dark:hover:bg-secondary/10 transition-shadow focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <span>Send </span>
                    <span className="text-primary dark:text-secondary">Message</span>
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
