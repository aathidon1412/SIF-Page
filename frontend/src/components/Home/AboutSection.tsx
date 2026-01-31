import React from "react";
import ScrollReveal from "../ui/ScrollReveal";

const AboutSection: React.FC = () => {
  return (
    <section className="min-h-screen bg-blue-950 flex flex-col">
      <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-10 flex-1 flex flex-col">
        {/* Section 1: About SIF - 50% of screen */}
        <div className="flex-1 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-8 lg:py-16">
          <ScrollReveal>
            <div className="text-left">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 inline-block border-b-4 border-yellow-300">
                About <span className="text-yellow-300">SIF</span>
              </h2>
              <p className="text-base lg:text-lg text-blue-100 leading-relaxed text-justify mb-6">
                <span className="font-bold text-yellow-300">
                  Sona Incubation Foundation (SIF)
                </span>{" "}
                is a dynamic innovation and entrepreneurship hub that empowers
                students, startups, and early-stage innovators to transform
                ideas into scalable ventures. The foundation offers strong
                value-added support through structured incubation, expert
                mentorship, and access to advanced infrastructure. By{" "}
                <span className="font-bold text-yellow-300">
                  bridging academia, industry, and startups
                </span>
                , SIF fosters{" "}
                <span className="font-bold text-yellow-300">
                  technology-driven innovation and sustainable entrepreneurship
                </span>
                .
              </p>

              <div>
                <a
                  href="https://www.sonaincubations.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Read more about SIF (opens in a new tab)"
                  className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-6 py-3 text-base font-medium rounded-sm shadow-md transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Read more about SIF
                </a>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <img
              src="https://picsum.photos/800/600?random=11"
              alt="SIF Logo"
              className="rounded-xl shadow-lg w-full h-auto object-cover max-h-[400px]"
            />
          </ScrollReveal>
        </div>

        {/* Section 2: About FABLAB - 50% of screen */}
        <div className="flex-1 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-8 lg:py-16">
          <ScrollReveal className="order-2 lg:order-1">
            <img
              src="https://picsum.photos/800/600?random=22"
              alt="FABLAB Logo"
              className="rounded-xl shadow-lg w-full h-auto object-cover max-h-[400px]"
            />
          </ScrollReveal>
          <ScrollReveal delay={150} className="order-1 lg:order-2">
            <div className="text-left">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 inline-block border-b-4 border-yellow-300">
                About <span className="text-yellow-300">FABLAB</span>
              </h2>
              <p className="text-base lg:text-lg text-blue-100 leading-relaxed text-justify mb-6">
                <span className="font-bold text-yellow-300">
                  Fabrication Lab (FAB LAB)
                </span>{" "}
                is a space where ideas come to life—an{" "}
                <span className="font-bold text-yellow-300">
                  advanced fabrication and innovation facility
                </span>{" "}
                designed to support hands-on exploration, rapid prototyping, and
                product development. Equipped with cutting-edge tools and
                technologies, it empowers students, startups, and innovators to
                convert concepts into{" "}
                <span className="font-bold text-yellow-300">
                  functional, market-ready prototypes
                </span>{" "}
                while nurturing creativity, experimentation, and innovation.
              </p>

              <div className="mb-8">
                <h3 className="text-lg lg:text-xl font-bold text-yellow-300 mb-4">
                  Key Advantages of the FABLAB
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <span className="text-yellow-300 font-bold text-xl flex-shrink-0">
                      ✓
                    </span>
                    <div>
                      <h4 className="text-base lg:text-lg font-bold text-white mb-1">
                        Hands-on Innovation Environment
                      </h4>
                      <p className="text-sm lg:text-base text-blue-100 leading-relaxed">
                        Provides practical exposure to{" "}
                        <span className="font-semibold text-yellow-300">
                          fabrication, electronics, and digital manufacturing
                          tools
                        </span>
                        , bridging the gap between theory and real-world
                        application.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="text-yellow-300 font-bold text-xl flex-shrink-0">
                      ✓
                    </span>
                    <div>
                      <h4 className="text-base lg:text-lg font-bold text-white mb-1">
                        End-to-End Prototyping Support
                      </h4>
                      <p className="text-sm lg:text-base text-blue-100 leading-relaxed">
                        Enables{" "}
                        <span className="font-semibold text-yellow-300">
                          complete product development
                        </span>{" "}
                        from idea validation and design to prototyping and
                        testing under one roof.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="text-yellow-300 font-bold text-xl flex-shrink-0">
                      ✓
                    </span>
                    <div>
                      <h4 className="text-base lg:text-lg font-bold text-white mb-1">
                        Startup & Skill Development Focused
                      </h4>
                      <p className="text-sm lg:text-base text-blue-100 leading-relaxed">
                        Supports startups and student innovators with{" "}
                        <span className="font-semibold text-yellow-300">
                          technical guidance, mentorship access, and
                          infrastructure
                        </span>{" "}
                        to accelerate innovation and entrepreneurial growth.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <a
                  href="#/about"
                  aria-label="Learn more about FABLAB (opens About page)"
                  className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-6 py-3 text-base font-medium rounded-sm shadow-md transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Learn more about FABLAB
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
