import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 dark:bg-[#0A0F1E] dark:border-t dark:border-slate-800/50 p-8 md:p-10">
      <div className="container mx-auto footer grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <aside className="flex flex-col items-center md:items-start space-y-2">
          <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
            SIF-<span className="text-primary dark:text-secondary no-underline">FABLAB</span>
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">© 2024 SIF-FABLAB. All rights reserved.</p>
        </aside>

        <nav className="flex flex-col items-center md:items-start space-y-2 text-slate-600 dark:text-slate-400">
          <h6 className="footer-title opacity-100 text-slate-800 dark:text-slate-100 mb-2">Services</h6>
          <a href="#" className="hover:underline">3D Printing</a>
          <a href="#" className="hover:underline">Laser Cutting</a>
          <a href="#" className="hover:underline">Electronics Workbench</a>
          <a href="#" className="hover:underline">Workshops</a>
        </nav>

        <nav className="flex flex-col items-center md:items-start space-y-2 text-slate-600 dark:text-slate-400">
          <h6 className="footer-title opacity-100 text-slate-800 dark:text-slate-100 mb-2">Legal</h6>
          <a href="#" className="hover:underline">Terms of use</a>
          <a href="#" className="hover:underline">Privacy policy</a>
          <a href="#" className="hover:underline">Cookie policy</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
