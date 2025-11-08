import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 dark:bg-[#0A0F1E] dark:border-t dark:border-slate-800/50 p-10">
  <div className="container mx-auto footer grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <aside>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            <span className="relative inline-block">SIF-<span className="text-yellow-300/40 dark:text-yellow-300">FABLAB</span>
              <span className="absolute -bottom-1 left-0 h-[4px] w-16 rounded-full bg-yellow-300/50 dark:bg-yellow-300/30" />
            </span>
          </p>
          <p className="text-slate-600 dark:text-slate-400">© 2024 SIF-FABLAB. All rights reserved.</p>
        </aside>
        <nav className="flex flex-col space-y-2 text-slate-600 dark:text-slate-400 mx-auto">
          <h6 className="footer-title opacity-100 text-slate-800 dark:text-slate-100">Services</h6>
          <a className="link link-hover">3D Printing</a>
          <a className="link link-hover">Laser Cutting</a>
          <a className="link link-hover">Electronics Workbench</a>
          <a className="link link-hover">Workshops</a>
        </nav>
        <nav className="flex flex-col space-y-2 text-slate-600 dark:text-slate-400 mx-auto">
          <h6 className="footer-title opacity-100 text-slate-800 dark:text-slate-100">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
