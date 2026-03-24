import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import logo1 from '../assets/logo_1.jpeg';
import logo2 from '../assets/logo_2.jpeg';
import logo3 from '../assets/logo_3.jpeg';
import logo4 from '../assets/logo_4.png';
import { ChevronDownIcon, MenuIcon, XIcon } from './icons';

interface NavItem {
  name: string;
  path: string;
}

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [currentLogoIndex, setCurrentLogoIndex] = useState<number>(0);
  const logos = [logo1, logo2, logo3, logo4];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogoIndex((prev) => (prev + 1) % logos.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = (): void => {
    setIsMenuOpen(false);
  };

  // Navbar is static/sticky; no scroll-hide behavior.

  const navItems: NavItem[] = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Booking', path: '/booking' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="sticky top-0 z-50 px-0">
      {/* Full-width navbar container */}
      <div className="bg-[#fffdeb] px-6 py-4 w-full">
        <div className="relative flex items-center justify-between">
          {/* Logo/Brand - Desktop */}
          <div className="hidden md:flex flex-shrink-0 items-center">
            <NavLink to="/" onClick={closeMenu} className="flex items-center gap-3">
              <div className="relative w-20 h-20" style={{ perspective: '800px' }}>
                <div
                  className="absolute w-full h-full transition-transform duration-700 ease-in-out"
                  style={{ transformStyle: 'preserve-3d', transform: `rotateY(${currentLogoIndex * 90}deg)` }}
                >
                  {logos.map((l, i) => (
                    <div
                      key={i}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ backfaceVisibility: 'hidden', transform: `rotateY(${i * 90}deg) translateZ(44px)` }}
                    >
                      <img src={l} alt={`logo-${i}`} className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
              </div>
              <span className="text-2xl font-bold text-slate-900 hover:text-slate-700 transition-colors duration-200">SIF-FAB LAB</span>
            </NavLink>
          </div>

          {/* Desktop Navigation (centered) */}
          <div className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2 space-x-6">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-900 text-white shadow-md'
                      : 'text-slate-900 hover:bg-blue-100/50 hover:text-slate-900'
                  }`
                }
              >
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>

          {/* Mobile: Logo + Menu button */}
          <div className="md:hidden flex items-center justify-between w-full">
            <NavLink to="/" onClick={closeMenu} className="flex items-center gap-3">
              <div className="relative w-14 h-14" style={{ perspective: '700px' }}>
                <div
                  className="absolute w-full h-full transition-transform duration-700 ease-in-out"
                  style={{ transformStyle: 'preserve-3d', transform: `rotateY(${currentLogoIndex * 90}deg)` }}
                >
                  {logos.map((l, i) => (
                    <div
                      key={i}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ backfaceVisibility: 'hidden', transform: `rotateY(${i * 90}deg) translateZ(30px)` }}
                    >
                      <img src={l} alt={`logo-${i}`} className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
              </div>
              <span className="text-base sm:text-lg font-bold text-slate-900 hover:text-slate-700 transition-colors duration-200 whitespace-nowrap">SIF-FAB LAB</span>
            </NavLink>
            
            <button
              onClick={toggleMenu}
              type="button"
              className="bg-transparent inline-flex items-center justify-center p-2 rounded-full text-slate-900 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 mr-2"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <MenuIcon className={`${isMenuOpen ? 'hidden' : 'block'} h-5 w-5`} />
              <XIcon className={`${isMenuOpen ? 'block' : 'hidden'} h-5 w-5`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-0 px-0">
          <div className="bg-[#fffdeb] p-2 mx-auto w-full sm:max-w-md">
            {navItems.map((item, index) => (
              <React.Fragment key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `group block px-4 py-3 rounded-xl text-lg font-semibold text-center transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-900 text-white shadow-md'
                        : 'text-slate-900 hover:bg-yellow-200/30 hover:text-slate-900'
                    }`
                  }
                  onClick={closeMenu}
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <ChevronDownIcon className="h-4 w-4 transform transition-transform duration-300 group-hover:rotate-90" />
                    <span>{item.name}</span>
                  </span>
                </NavLink>
                {index < navItems.length - 1 && (
                  <div className="h-px bg-blue-900 mx-2 my-1"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;