
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import { ThemeProvider, useTheme } from './hooks/useTheme';

// Scroll to top on page change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
    const { theme } = useTheme();

    // This is to ensure the daisyUI theme attribute is updated on the html tag
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow"> {/* Removed navbar and padding */}
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
        <HashRouter>
            <AppContent />
        </HashRouter>
    </ThemeProvider>
  );
};

export default App;
