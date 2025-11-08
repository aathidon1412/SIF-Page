import React from 'react';
import { NavLink } from 'react-router-dom';
import CountUp from 'react-countup';

const stats = [
  { label: 'Available Labs', value: '12' },
  { label: 'Equipment', value: '240' },
  { label: 'Bookings Today', value: '34' },
  { label: 'Active Projects', value: '18' }
];

const HeroSection: React.FC = () => {
  return (
    <section className="min-h-screen w-full font-sans flex items-center py-8 lg:py-0" style={{ backgroundColor: '#fffdeb' }} >

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 items-stretch">
          {/* Left - Content */}
          <div className="lg:w-7/12 flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight animate-fade-in-up" style={{ animationDelay: '0ms' }}>
              Book lab time for <span className="text-blue-800 px-1 rounded">equipment</span> and <span className="text-blue-800 px-1 rounded">workspace</span> instantly.
            </h1>

            <p className="text-slate-700 max-w-2xl mt-6 sm:mt-8 text-base sm:text-lg animate-fade-in-up" style={{ animationDelay: '120ms' }}>
  Reserve instruments, workstations and labs quickly. Manage schedules, track availability and <span className="font-medium text-blue-800 px-1 rounded">start experiments</span> without the wait.
</p>

            {/* Images card - Mobile only */}
            <div className="lg:hidden mt-6 sm:mt-8 flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-2xl p-4 w-full max-w-md animate-scale-in hover:shadow-3xl transition-all duration-500" style={{ animationDelay: '200ms' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-3">
                    <img
                      src="/api/placeholder/280/200"
                      alt="Laboratory Equipment"
                      className="w-full h-32 sm:h-40 object-cover rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
                    />
                    <img
                      src="/api/placeholder/280/200"
                      alt="Research Workspace"
                      className="w-full h-32 sm:h-40 object-cover rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <img
                      src="/api/placeholder/280/400"
                      alt="Advanced Lab Setup"
                      className="w-full h-64 sm:h-80 object-cover rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats card */}
            <div className="mt-6 sm:mt-8 w-full max-w-4xl grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 animate-fade-in-up" style={{ animationDelay: '360ms' }}>
              {stats.map((s) => (
                <div key={s.label} className="bg-blue-900 rounded-lg p-3 sm:p-4 lg:p-6 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                    <CountUp start={0} end={Number(s.value)} duration={2.5} separator="," />
                  </div>
                  <div className="text-xs sm:text-sm text-blue-300 mt-1 text-center">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-6 sm:mt-8 animate-fade-in-up" style={{ animationDelay: '240ms' }}>
              <NavLink
                to="/book"
                className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-blue-900 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 sm:py-3 text-sm sm:text-base rounded-sm shadow-md transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg border border-blue-900"
                aria-label="Book Now"
              >
                Book Now
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </NavLink>

              <NavLink
                to="/contact"
                className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-transparent border border-blue-900 hover:bg-blue-900 hover:text-white text-blue-900 px-4 sm:px-6 py-3 sm:py-3 text-sm sm:text-base rounded-sm shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md"
                aria-label="Contact Us"
              >
                Contact Us
              </NavLink>
            </div>
          </div>

          {/* Right - Images card - Desktop only */}
          <div className="hidden lg:flex lg:w-5/12 items-center justify-center">
            <div className="bg-white rounded-3xl shadow-2xl p-6 w-full animate-scale-in hover:shadow-3xl transition-all duration-500" style={{ animationDelay: '200ms' }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src="/api/placeholder/280/200"
                    alt="Laboratory Equipment"
                    className="w-full h-48 object-cover rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105"
                  />
                  <img
                    src="/api/placeholder/280/200"
                    alt="Research Workspace"
                    className="w-full h-48 object-cover rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <img
                    src="/api/placeholder/280/400"
                    alt="Advanced Lab Setup"
                    className="w-full h-96 object-cover rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
