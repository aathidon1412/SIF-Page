
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import MainBooking from './pages/MainBooking';
import Admin from './pages/Admin';
import { AuthProvider } from './lib/auth';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { Toaster } from 'react-hot-toast';


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
    const { pathname } = useLocation();

    // This is to ensure the daisyUI theme attribute is updated on the html tag
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

  const hideFooterOn = ['/main-booking', '/admin'];
  const hideNavbarOn = ['/main-booking', '/admin'];
  const hideFooter = hideFooterOn.includes(pathname);
  const hideNavbar = hideNavbarOn.includes(pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow"> {/* Removed padding-top for floating navbar */}
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/main-booking" element={<MainBooking />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <AppContent />
          <Toaster
            position="top-right"
            gutter={12}
            toastOptions={{
              style: {
                background: '#FEFCE8', // Tailwind yellow-50 equivalent
                color: '#0A1F44', // dark blue tone (approx blue-950)
                border: '1px solid #0A1F44',
                fontWeight: 500,
              },
              success: {
                style: {
                  background: '#ECFDF5', // green-50ish
                  color: '#065F46',
                  border: '1px solid #065F46'
                }
              },
              error: {
                style: {
                  background: '#FEF2F2', // red-50ish
                  color: '#7F1D1D',
                  border: '1px solid #7F1D1D'
                }
              }
            }}
          />
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
