import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';

// Floating / auto-hide Navbar (replicates FloatingNav behavior)
// Shows only after scrolling down then up past a threshold; hidden when scrolling down.
const Navbar = () => {
    const { scrollYProgress } = useScroll();
    const [visible, setVisible] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    useMotionValueEvent(scrollYProgress, 'change', (current) => {
        if (typeof current !== 'number') return;
        const prev = scrollYProgress.getPrevious() ?? current;
        const direction = current - prev; // < 0 => scrolling up

            // Always show while near the very top
            if (scrollYProgress.get() < 0.05) {
                setVisible(true);
                return;
            }

        if (direction < 0) {
            // scrolling up
            setVisible(true);
        } else {
            // scrolling down
            setVisible(false);
        }
    });

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/about', label: 'About' },
        { to: '/contact', label: 'Contact' },
    ];
    const { pathname } = useLocation();

    // Navbar no longer includes a rotating logo; logo is shown in the Hero section.

    return (
        <AnimatePresence>
                <motion.nav
                key="floating-navbar"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="fixed top-4 left-0 right-0 z-50 transition-all"
            >
                <div className="mx-4 md:mx-auto max-w-6xl">
                    <div className="bg-white/60 dark:bg-black/60 backdrop-blur-md rounded-full px-4 py-2 md:py-3 shadow-md border border-white/60 dark:border-black/40 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link to="/" className="text-white font-semibold tracking-wide text-sm md:text-base">
                                <span className="relative inline-block">
                                    SIF
                                </span>
                            </Link>
                            <span className="text-sm text-primary hidden md:inline">FABLAB</span>
                        </div>

                        {/* desktop links */}
                        <div className="hidden md:flex items-center gap-6">
                            {navLinks.map((l) => {
                                const isActive = pathname === l.to;
                                return (
                                    <NavLink
                                        key={l.to}
                                        to={l.to}
                                        className={({ isActive: active }) =>
                                            `relative text-sm transition-colors ${
                                                active || isActive
                                                    ? 'text-white'
                                                    : 'text-gray-300 hover:text-white'
                                            }`
                                        }
                                    >
                                        <span className="relative inline-block">
                                            {l.label}
                                            {isActive && (
                                                <span className="pointer-events-none absolute -bottom-0.5 left-0 h-[3px] w-6 rounded-full bg-blue-400/70" />
                                            )}
                                        </span>
                                    </NavLink>
                                );
                            })}
                        </div>

                        {/* right side: login or mobile menu */}
                        <div className="flex items-center gap-2">
                            <div className="hidden md:block">
                                <button
                                    type="button"
                                    className="ml-3 relative border border-gray-600/50 hover:border-gray-500 text-gray-100 px-5 py-2 rounded-full text-sm font-medium transition-colors"
                                >
                                    <span>Login</span>
                                </button>
                            </div>

                            {/* mobile menu button */}
                            <div className="md:hidden">
                                <button
                                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                                    aria-expanded={menuOpen}
                                    onClick={() => setMenuOpen((v) => !v)}
                                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <svg className="w-5 h-5 text-gray-800 dark:text-gray-100" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        {menuOpen ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* mobile dropdown panel */}
                    {menuOpen && (
                        <div className="mt-2 md:hidden">
                            <div className="bg-white/80 dark:bg-black/70 backdrop-blur-md rounded-xl p-3 shadow-md border border-white/60 dark:border-black/40">
                                <nav className="flex flex-col gap-2">
                                    {navLinks.map((l) => (
                                        <Link
                                            key={l.to}
                                            to={l.to}
                                            onClick={() => setMenuOpen(false)}
                                            className="px-3 py-2 rounded-md text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        >
                                            {l.label}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    )}
                </div>
            </motion.nav>
        </AnimatePresence>
    );
};

export default Navbar;
