import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

interface NavItem {
  name: string;
  path: string;
}

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = (): void => {
    setIsMenuOpen(false);
  };

  // Scroll detection logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar only when at top (within 50px) or scrolling up
      if (currentScrollY < 50) {
        // At the top of the page
        setIsVisible(true);
      }else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
        setIsMenuOpen(false); // Close mobile menu when hiding
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems: NavItem[] = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Booking', path: '/booking' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      {/* Floating navbar container */}
      <div className="bg-white backdrop-blur-md border-2 border-blue-900/60 rounded-2xl shadow-lg px-4 sm:px-6 py-3 w-full max-w-sm sm:max-w-md md:w-auto md:max-w-6xl">
        <div className="flex items-center justify-between">
          {/* Logo/Brand - Desktop */}
          <div className="hidden md:flex flex-shrink-0">
            <NavLink 
              to="/" 
              className="text-lg font-bold text-blue-900 hover:text-blue-700 transition-colors duration-200"
              onClick={closeMenu}
            >
              SIF-FAB LAB
            </NavLink>
          </div>

          {/* Vertical divider between logo and nav - Desktop */}
          <div className="hidden md:block w-px h-8 bg-blue-900/60 ml-6"></div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center mx-8">
            {navItems.map((item, index) => (
              <React.Fragment key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-900 text-white shadow-md'
                        : 'text-blue-900 hover:bg-blue-100/50 hover:text-blue-900'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
                {index < navItems.length - 1 && (
                  <div className="w-px h-6 bg-blue-900 mx-4"></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile: Logo + Menu button */}
          <div className="md:hidden flex items-center justify-between w-full">
            <NavLink 
              to="/" 
              className="text-sm sm:text-lg font-bold text-blue-900 hover:text-blue-700 transition-colors duration-200 whitespace-nowrap mr-40"
              onClick={closeMenu}
            >
              SIF-FAB LAB
            </NavLink>
            
            <button
              onClick={toggleMenu}
              type="button"
              className="bg-yellow-300/20 backdrop-blur-sm inline-flex items-center justify-center p-2 rounded-full text-blue-900 hover:bg-yellow-300/30 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all duration-200 mr-2"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-5 w-5`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-5 w-5`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 sm:w-96">
          <div className="bg-yellow-200/40 backdrop-blur-md border-2 border-yellow-400/60 rounded-2xl shadow-lg p-2">
            {navItems.map((item, index) => (
              <React.Fragment key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-base font-medium text-center transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-900 text-white shadow-md'
                        : 'text-blue-900 hover:bg-yellow-200/30 hover:text-blue-900'
                    }`
                  }
                  onClick={closeMenu}
                >
                  {item.name}
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