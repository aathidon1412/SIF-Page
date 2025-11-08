import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';

// Floating / auto-hide Navbar (replicates FloatingNav behavior)
// Shows only after scrolling down then up past a threshold; hidden when scrolling down.
const Navbar = () => {
        const { scrollYProgress } = useScroll();
        const [visible, setVisible] = useState(true);

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

    return (
        <AnimatePresence>
            <motion.nav
                key="floating-navbar"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="flex max-w-fit fixed top-6 inset-x-0 mx-auto z-50 pr-4 pl-8 py-2 items-center space-x-6 rounded-full bg-gray-800/80 backdrop-blur-md border border-gray-700/40 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.4)]"
            >
                        <Link to="/" className="text-white font-semibold tracking-wide text-sm md:text-base">
                            <span className="relative inline-block">
                                SIF-FABLAB
                                <span className="pointer-events-none absolute -bottom-0.5 left-0 h-[4px] w-12 rounded-full bg-yellow-300/50" />
                            </span>
                        </Link>
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
                                                    {(isActive) && (
                                                        <span className="pointer-events-none absolute -bottom-0.5 left-0 h-[3px] w-6 rounded-full bg-blue-400/70" />
                                                    )}
                                                </span>
                                            </NavLink>
                                        );
                                })}
                <button
                    type="button"
                    className="ml-2 relative border border-gray-600/50 hover:border-gray-500 text-gray-100 px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                >
                    <span>Login</span>
                    <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px w-1/2 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                </button>
            </motion.nav>
        </AnimatePresence>
    );
};

export default Navbar;
