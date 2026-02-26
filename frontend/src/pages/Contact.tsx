import React from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { FaFacebook, FaInstagram, FaXTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa6';

const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle form submission here.
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
  <div className="bg-blue-950 text-[#fffdeb] dark:bg-blue-950 pt-6 pb-12">
      <div className="w-full">
        <ScrollReveal>
          <div className="mx-4 sm:mx-6 lg:mx-8 rounded-2xl p-4 lg:p-6 bg-transparent">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#fffdeb] inline-block">
                Get In Touch
              </h1>
              <p className="mt-3 text-lg max-w-3xl mx-auto text-[#fffdeb]">
                We're here to help and answer any questions you might have. We look forward to hearing from you.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <div className="mx-4 sm:mx-6 lg:mx-8 grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Contact Information */}
          <ScrollReveal>
            <div className="space-y-8 h-full flex flex-col md:pr-8 md:border-r md:border-yellow-100">
              <div className="p-6 rounded-2xl bg-transparent flex-1 flex flex-col pb-6 md:pb-0 border-b md:border-b-0 border-blue-950">
                <h2 className="text-2xl font-bold mb-4 text-[#fffdeb] underline decoration-[#fffdeb] underline-offset-4">Contact Details</h2>
                <p className="text-md text-[#fffdeb] ">Reach out to our team for questions about workshops, lab access, or partnerships. We typically respond <span className="bg-yellow-300 text-blue-950 px-2 rounded font-semibold">within 1–2 business days</span> — please include a short summary of your request.</p>
                <div className="flex flex-wrap items-center gap-6 text-lg text-[#fffdeb] mt-10">
                  <a href="mailto:info@sif-fablab.edu" className="flex items-center gap-2 hover:underline">
                    <MdEmail className="text-[#fffdeb] text-2xl flex-shrink-0" />
                    <span className="font-medium">Email</span>
                  </a>
                  <a href="tel:+919080895742" className="flex items-center gap-2 hover:underline">
                    <MdPhone className="text-[#fffdeb] text-2xl flex-shrink-0" />
                    <span className="font-medium">Phone</span>
                  </a>
                  <a href="https://www.google.com/maps/search/?api=1&query=Sona+College+of+Technology+Sona+Valliappa+Block+Salem+Tamil+Nadu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                    <MdLocationOn className="text-[#fffdeb] text-2xl flex-shrink-0" />
                    <span className="font-medium">Address</span>
                  </a>
                </div>

                {/* Social media connections */}
                <div className="mt-16 pt-4">
                  <h3 className="text-lg font-semibold mb-3 text-[#fffdeb]">Follow us</h3>
                  <div className="flex items-center gap-4">
                    <a
                      href="https://facebook.com/siffablab"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="text-[#fffdeb] hover:text-blue-700 transition-colors"
                    >
                      <FaFacebook size={24} />
                    </a>
                    <a
                      href="https://instagram.com/siffablab"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="text-[#fffdeb] hover:text-pink-600 transition-colors"
                    >
                      <FaInstagram size={24} />
                    </a>
                    <a
                      href="https://x.com/siffablab"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="X (Twitter)"
                      className="text-[#fffdeb] hover:text-black transition-colors"
                    >
                      <FaXTwitter size={24} />
                    </a>
                    <a
                      href="https://www.linkedin.com/company/sona-incubation-foundation"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="text-[#fffdeb] hover:text-blue-800 transition-colors"
                    >
                      <FaLinkedin size={24} />
                    </a>
                    <a
                      href="https://youtube.com/@siffablab"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                      className="text-[#fffdeb] hover:text-red-600 transition-colors"
                    >
                      <FaYoutube size={24} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-transparent flex-1 flex flex-col">
                <h2 className="text-2xl font-bold mb-4 text-[#fffdeb] underline decoration-[#fffdeb] underline-offset-4">Location</h2>
                <div className="rounded-lg shadow-md overflow-hidden flex-1">
                   <iframe
  title="Sona College of Technology Location"
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3895.40!2d78.12461046136933!3d11.67845960906935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2sSona%20College%20of%20Technology!5e0!3m2!1sen!2sin!4v1731787777000!5m2!1sen!2sin"
  className="w-full h-full border-0"
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>

                </div>

                <p className="mt-4 text-[#fffdeb] text-justify">
                  Our lab is located at <span className="font-semibold">2nd floor, Sona College of Technology, Sona Valliappa Block, Sona Incubation Foundation, Junction Main Rd, Salem, Tamil Nadu 636005</span>. We welcome visitors <span className="bg-yellow-300 text-blue-950 px-2 rounded font-semibold">Monday–Friday, 9:00 AM — 6:00 PM</span>. Drop by for hands-on <span className="bg-blue-950 text-[#fffdeb] px-2 rounded">workshops</span>, <span className="bg-blue-950 text-[#fffdeb] px-2 rounded">prototyping help</span>, and <span className="bg-blue-950 text-[#fffdeb] px-2 rounded">community meetups</span> — or reach out to <span className="bg-yellow-300 text-blue-950 px-2 rounded font-semibold">schedule a dedicated session</span>.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Contact Form */}
          <ScrollReveal delay={200}>
            <div className="p-6 md:p-8 rounded-2xl shadow-xl bg-transparent h-full flex flex-col md:pl-8">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-[#fffdeb] tracking-tight leading-tight underline decoration-[#fffdeb] underline-offset-4">Send us a Message</h2>
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
                    className="w-full rounded-xl border-0 bg-[#fffdeb] px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-950/30 transition"
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
                    className="w-full rounded-xl border-0 bg-[#fffdeb] px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-950/30 transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2">
                    <span className="text-sm font-medium text-[#fffdeb]">Message</span>
                  </label>
                  <textarea
                    id="message"
                    className="w-full rounded-xl border-0 bg-[#fffdeb] px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-950/30 transition h-80 resize-y"
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
