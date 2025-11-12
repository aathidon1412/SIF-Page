import React from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle form submission here.
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
  <div className="bg-blue-950 py-14 text-[#fffdeb] dark:bg-blue-950">
      <div className="w-full">
        <ScrollReveal>
          <div className="mb-16 mt-8 mx-4 sm:mx-6 lg:mx-8 border-2 border-[#fffdeb] rounded-2xl p-8 lg:p-12 bg-transparent">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#fffdeb] inline-block border-b-4 border-[#fffdeb]">
                Get In <span className="text-yellow-300">Touch</span>
              </h1>
              <p className="mt-6 text-lg max-w-3xl mx-auto text-[#fffdeb]">
                We're here to help and answer any questions you might have. We look forward to hearing from you.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <div className="mx-4 sm:mx-6 lg:mx-8 grid lg:grid-cols-2 gap-12 items-stretch">
          {/* Contact Information */}
          <ScrollReveal>
            <div className="space-y-8 h-full flex flex-col">
              <div className="p-6 rounded-2xl border-2 border-[#fffdeb] bg-transparent flex-1 flex flex-col">
                <h2 className="text-2xl font-bold mb-4 text-[#fffdeb] underline decoration-[#fffdeb] underline-offset-4">Contact <span className="text-yellow-300">Details</span></h2>
                <p className="text-sm text-[#fffdeb] mb-4 max-w-prose">Reach out to our team for questions about workshops, lab access, or partnerships. We typically respond <span className="bg-yellow-300 text-blue-950 px-2 rounded font-semibold">within 1–2 business days</span> — please include a short summary of your request.</p>
                <ul className="space-y-4 text-lg text-[#fffdeb] mt-auto">
                  <li className="flex items-center">
                    <MdEmail className="mr-3 text-[#fffdeb]" /> <span className="font-medium">Email:</span>&nbsp; info@sif-fablab.edu
                  </li>
                  <li className="flex items-center">
                    <MdPhone className="mr-3 text-[#fffdeb]" /> <span className="font-medium">Phone:</span>&nbsp; (123) 456-7890
                  </li>
                  <li className="flex items-center">
                    <MdLocationOn className="mr-3 text-[#fffdeb]" /> <span className="font-medium">Address:</span>&nbsp; 123 Innovation Drive, Tech Campus, Sonipat
                  </li>
                </ul>

                {/* Social media connections */}
                <div className="mt-6 pt-4 border-t-2 border-[#fffdeb]">
                  <h3 className="text-lg font-semibold mb-3 text-[#fffdeb]">Follow us</h3>
                  <div className="flex items-center gap-4">
                    <a
                      href="https://facebook.com/siffablab"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="text-[#fffdeb] hover:text-yellow-300 transition-colors inline-flex items-center justify-center w-7 h-7"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.2 3-3.2.9 0 1.9.1 1.9.1v2.1h-1.1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0 0 22 12z" />
                      </svg>
                    </a>
                    <a
                      href="https://instagram.com/siffablab"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="text-[#fffdeb] hover:text-yellow-300 transition-colors inline-flex items-center justify-center w-7 h-7"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2.2A2.8 2.8 0 1 0 12 16.8 2.8 2.8 0 0 0 12 9.2zm5.5-2.7a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6z"/>
                      </svg>
                    </a>
                    <a
                      href="https://x.com/siffablab"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="X (Twitter)"
                      className="text-[#fffdeb] hover:text-yellow-300 transition-colors inline-flex items-center justify-center w-7 h-7"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M3 3h4.6l4.3 5.7L17.9 3H21l-6.6 8.2L21 21h-4.6l-4.6-6-5 6H3l7-8.4L3 3z"/>
                      </svg>
                    </a>
                    <a
                      href="https://www.linkedin.com/company/sona-incubation-foundation"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="text-[#fffdeb] hover:text-yellow-300 transition-colors inline-flex items-center justify-center w-7 h-7"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.7v2.2h.1c.7-1.3 2.5-2.7 5.1-2.7 5.5 0 6.5 3.6 6.5 8.4V24h-5v-7.1c0-1.7 0-3.9-2.4-3.9s-2.8 1.9-2.8 3.8V24h-5V8z"/>
                      </svg>
                    </a>
                    <a
                      href="https://youtube.com/@siffablab"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                      className="text-[#fffdeb] hover:text-yellow-300 transition-colors inline-flex items-center justify-center w-7 h-7"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .6 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .6-5.8 31 31 0 0 0-.6-5.8zM9.8 15.5V8.5l6.2 3.5-6.2 3.5z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border-2 border-[#fffdeb] bg-transparent flex-1 flex flex-col">
                <h2 className="text-2xl font-bold mb-4 text-[#fffdeb] underline decoration-[#fffdeb] underline-offset-4">Location</h2>
                <div className="rounded-lg shadow-md overflow-hidden flex-1">
                   <iframe
                     title="SIF-FABLAB location"
                     src="https://www.google.com/maps?q=Sonipat&output=embed"
                     className="w-full h-full border-0"
                     allowFullScreen
                     loading="lazy"
                     referrerPolicy="no-referrer-when-downgrade"
                   />
                </div>

                <p className="mt-4 text-[#fffdeb]">
                  Our lab is located at <span className="font-semibold">123 Innovation Drive, Tech Campus, Sonipat</span>. We welcome visitors <span className="bg-yellow-300 text-blue-950 px-2 rounded font-semibold">Monday–Friday, 9:00 AM — 6:00 PM</span>. Drop by for hands-on <span className="bg-blue-950 text-[#fffdeb] px-2 rounded">workshops</span>, <span className="bg-blue-950 text-[#fffdeb] px-2 rounded">prototyping help</span>, and <span className="bg-blue-950 text-[#fffdeb] px-2 rounded">community meetups</span> — or reach out to <span className="bg-yellow-300 text-blue-950 px-2 rounded font-semibold">schedule a dedicated session</span>.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Contact Form */}
          <ScrollReveal delay={200}>
            <div className="p-10 md:p-12 rounded-2xl shadow-xl border-2 border-[#fffdeb] bg-transparent h-full flex flex-col">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-[#fffdeb] tracking-tight leading-tight underline decoration-[#fffdeb] underline-offset-4">Send us a <span className="text-yellow-300">Message</span></h2>
              <p className="text-sm text-[#fffdeb] mb-6 max-w-xl">Have a question, project idea or need assistance? Send us a message and our team will get back to you shortly.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block mb-2">
                    <span className="text-sm font-medium text-[#fffdeb]">Full name</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Your name"
                    className="w-full rounded-xl border border-slate-200 bg-[#fffdeb] px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-950/30 transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2">
                    <span className="text-sm font-medium text-[#fffdeb]">Email address</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-slate-200 bg-[#fffdeb] px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-950/30 transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2">
                    <span className="text-sm font-medium text-[#fffdeb]">Message</span>
                  </label>
                  <textarea
                    id="message"
                    className="w-full rounded-xl border border-slate-200 bg-[#fffdeb] px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-950/30 transition h-40 resize-y"
                    placeholder="Write your message..."
                    required
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                      className="w-full rounded-full px-6 py-3 bg-[#fffdeb] text-blue-950 font-semibold hover:bg-yellow-200 transition-shadow focus:outline-none focus:ring-2 focus:ring-[#fffdeb]/40"
                  >
                    <span>Send </span>
                      <span>Message</span>
                  </button>
                </div>
              </form>
                <div className="mt-auto" />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default Contact;
