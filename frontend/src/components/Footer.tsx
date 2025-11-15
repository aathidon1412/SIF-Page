import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaXTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa6';

const Footer: React.FC = () => {
  return (
    <footer className="p-8 md:p-10 rounded-t-2xl " style={{ backgroundColor: '#fffdeb' }}>
      <div className="w-full max-w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
        {/* Brand + Social */}
        <aside className="flex flex-col items-center md:items-start space-y-3 pb-6 md:pb-0 border-b md:border-b-0 md:border-r border-blue-950 md:pr-8">
          <p className="text-2xl md:text-3xl font-bold text-slate-900">
            SIF-<span className="text-blue-900 no-underline">FABLAB</span>
          </p>
          <p className="text-sm text-slate-700">© 2024 SIF-FABLAB. All rights reserved.</p>

          {/* Social icons */}
          <div className="flex items-center gap-4 pt-2">
            <a
              href="https://facebook.com/siffablab"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-slate-700 hover:text-blue-700 transition-colors"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://instagram.com/siffablab"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-slate-700 hover:text-pink-600 transition-colors"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://x.com/siffablab"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="text-slate-700 hover:text-black transition-colors"
            >
              <FaXTwitter size={24} />
            </a>
            <a
              href="https://www.linkedin.com/company/sona-incubation-foundation"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-slate-700 hover:text-blue-800 transition-colors"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="https://youtube.com/@siffablab"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-slate-700 hover:text-red-600 transition-colors"
            >
              <FaYoutube size={24} />
            </a>
          </div>
        </aside>

        {/* Quick Links */}
        <nav className="flex flex-col items-center md:items-start space-y-2 text-slate-700 pb-6 md:pb-0 border-b md:border-b-0 md:border-r border-blue-950 md:px-8">
          <h6 className="footer-title opacity-100 text-slate-900 mb-2 underline decoration-blue-950 decoration-2 underline-offset-4">Quick Links</h6>
          <Link to="/" className="hover:underline flex items-center gap-2">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10.5L12 3l9 7.5" />
              <path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" />
            </svg>
            Home
          </Link>
          <Link to="/about" className="hover:underline flex items-center gap-2">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            About
          </Link>
          <Link to="/booking" className="hover:underline flex items-center gap-2">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            Booking
          </Link>
          <Link to="/contact" className="hover:underline flex items-center gap-2">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 6 12 13 2 6" />
            </svg>
            Contact
          </Link>
        </nav>

        {/* Services (static) */}
        <nav className="flex flex-col items-center md:items-start space-y-2 text-slate-700 pb-6 md:pb-0 border-b md:border-b-0 md:border-r border-blue-950 md:px-8">
          <h6 className="footer-title opacity-100 text-slate-900 mb-2 underline decoration-blue-950 decoration-2 underline-offset-4">Services</h6>
          <span className="text-slate-700 flex items-center gap-2">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 16l-8-8" />
              <path d="M21 16V8a2 2 0 0 0-2-2h-8" />
              <rect x="3" y="8" width="8" height="8" rx="2" />
            </svg>
            3D Printing
          </span>
          <span className="text-slate-700 flex items-center gap-2">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M7 6l10 12" />
              <path d="M4 18h16" />
            </svg>
            Laser Cutting
          </span>
          <span className="text-slate-700 flex items-center gap-2">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <path d="M14 14h7v7h-7z" />
            </svg>
            Electronics Workbench
          </span>
          <span className="text-slate-700 flex items-center gap-2">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16v12H4z" />
              <path d="M2 20h20" />
              <path d="M8 8h8" />
            </svg>
            Workshops
          </span>
        </nav>

        {/* Legal */}
        <nav className="flex flex-col items-center md:items-start space-y-2 text-slate-700 md:pl-8">
          <h6 className="footer-title opacity-100 text-slate-900 mb-2 underline decoration-blue-950 decoration-2 underline-offset-4">Legal</h6>
          <a href="#" className="hover:underline flex items-center gap-2">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
              <path d="M10 9H8" />
            </svg>
            Terms of use
          </a>
          <a href="#" className="hover:underline flex items-center gap-2">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" />
              <path d="M12 8v4" />
            </svg>
            Privacy policy
          </a>
          <a href="#" className="hover:underline flex items-center gap-2">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="7" />
              <path d="M16 8c.5 1-.5 2-1.5 2S13 9 12 10s-1.5 2-3 2-2-.5-3-1" />
            </svg>
            Cookie policy
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
