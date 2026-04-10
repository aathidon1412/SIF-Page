import React from "react";
import { NavLink } from "react-router-dom";
import CountUp from "react-countup";
import hero1Image from "../../assets/hero1.jpeg";
import hero2Image from "../../assets/hero2.png";
import hero3Image from "../../assets/hero3.png";

const stats = [
  { label: "Available Labs", value: "6", suffix: "", to: { pathname: '/main-booking', state: { tab: 'labs' } } },
  { label: "Equipment", value: "20", suffix: "+", to: { pathname: '/main-booking', state: { tab: 'equipment' } } },
  { label: "Bookings Today", value: "34", suffix: "" },
  { label: "Active Projects", value: "15", suffix: "+" },
];

const HeroSection: React.FC = () => {
  // No rotating logo here anymore (moved to Navbar)
  return (
    <section
      className="min-h w-full font-sans flex items-center py-8 relative"
      style={{ backgroundColor: "#fffdeb" }}
    >
      {/* Rotating logo moved to navbar */}

      <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col-reverse lg:flex-row gap-6 lg:gap-8 items-stretch">
          {/* Left - Content */}
          <div className="lg:w-6/12 flex flex-col justify-center">
            <h1
              className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-relaxed animate-fade-in-up mt-0"
              style={{ animationDelay: "0ms" }}
            >
              Where ideas transform into{" "}
              <span className="text-blue-900 px-1 rounded">prototypes</span> and
              prototypes become{" "}
              <span className="text-blue-900 px-1 rounded">innovation</span>.
            </h1>

            <p
              className="text-slate-700 max-w-2xl mt-6 sm:mt-8 text-base sm:text-lg leading-relaxed text-justify animate-fade-in-up"
              style={{ animationDelay: "120ms" }}
            >
              <span className="font-medium text-blue-900 px-1 rounded">
                Our FAB LAB is a hands-on innovation space
              </span>{" "}
              equipped with modern and advanced fabrication tools that enable
              learners, students, entrepreneurs, and startups to design, build,
              and test real-world prototypes.
            </p>

            <p
              className="text-slate-700 max-w-2xl mt-4 sm:mt-4 text-base sm:text-lg leading-relaxed text-justify animate-fade-in-up"
              style={{ animationDelay: "120ms" }}
            >
              <span className="font-medium text-blue-900 px-1 rounded">
                It acts as a launchpad for innovation, research, and startup
                development
              </span>
              {", "}
              empowering innovators to transform ideas into functional,
              practical solutions.
            </p>

            {/* Images card - Mobile only */}
            <div className="lg:hidden mt-6 sm:mt-8 flex items-center justify-center">
              <div
                className="bg-white rounded-2xl shadow-2xl p-4 w-full max-w-md animate-scale-in hover:shadow-3xl transition-all duration-500"
                style={{ animationDelay: "200ms" }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-3">
                    <img
                      src={hero1Image}
                      alt="Laboratory Equipment"
                      className="w-full h-32 sm:h-40 object-cover rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
                    />
                    <img
                      src={hero2Image}
                      alt="Research Workspace"
                      className="w-full h-32 sm:h-40 object-cover rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <img
                      src={hero3Image}
                      alt="Advanced Lab Setup"
                      className="w-full h-64 sm:h-80 object-cover rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats card */}
            <div
              className="mt-6 sm:mt-8 w-full max-w-4xl grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 animate-fade-in-up"
              style={{ animationDelay: "360ms" }}
            >
              {stats.map((s) => {
                const card = (
                  <div className="bg-blue-900 rounded-lg p-3 sm:p-4 lg:p-6 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                      <CountUp start={0} end={Number(s.value)} duration={2} separator="," />
                      {s.suffix}
                    </div>
                    <div className="text-xs sm:text-sm text-blue-300 mt-1 text-center">{s.label}</div>
                  </div>
                );

                return s.to ? (
                  <NavLink key={s.label} to={s.to} aria-label={s.label} className="block">
                    {card}
                  </NavLink>
                ) : (
                  <div key={s.label}>{card}</div>
                );
              })}
            </div>

            <div
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-6 sm:mt-8 animate-fade-in-up"
              style={{ animationDelay: "240ms" }}
            >
              <NavLink
                to="/booking"
                className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-blue-900 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 sm:py-3 text-sm sm:text-base rounded-sm shadow-md transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg border border-blue-900"
                aria-label="Book Now"
              >
                Book Now
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
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
          <div className="hidden lg:flex lg:w-6/12 items-center justify-center">
            <div
              className="bg-white rounded-3xl shadow-2xl p-8 w-full animate-scale-in hover:shadow-3xl transition-all duration-500"
              style={{ animationDelay: "200ms" }}
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <img
                    src={hero1Image}
                    alt="Laboratory Equipment"
                    className="w-full h-56 object-cover rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105"
                  />
                  <img
                    src={hero2Image}
                    alt="Research Workspace"
                    className="w-full h-56 object-cover rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <img
                    src={hero3Image}
                    alt="Advanced Lab Setup"
                    className="w-full h-[28rem] object-cover rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105"
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
