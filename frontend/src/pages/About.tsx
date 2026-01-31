import React from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import { FaLinkedin } from 'react-icons/fa6';



const About: React.FC = () => {
  return (
    <div className="bg-yellow-50 pt-1 dark:bg-yellow-50">
      <div className="w-full ">
        {/* Header Section */}
        <ScrollReveal>
          <div className="mb-16 mt-8 mx-4 sm:mx-6 lg:mx-8 rounded-2xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-black inline-block border-b-4 border-blue-950">
                  About <span className="text-blue-950 dark:text-blue-950">FABLAB</span>
                </h1>
                <p className="mt-10 text-lg max-w-4xl text-black dark:text-black leading-relaxed text-justify">
                The FABLAB is an <span className="bg-blue-950/20 px-2 py-0 rounded border border-blue-950/30 font-semibold">innovation and fabrication space</span> designed to support hands-on learning, rapid prototyping, and product development. It enables students, innovators, startups, and project developers to transform ideas into <span className="bg-blue-950/20 px-2 py-0 rounded border border-blue-950/30 font-semibold">functional prototypes</span> using advanced fabrication, electronics, and digital manufacturing tools. The lab bridges the gap between theoretical knowledge and real-world application by providing practical exposure, modern infrastructure, and expert guidance.
              </p>
              <p className="mt-6 text-lg max-w-4xl text-black dark:text-black leading-relaxed text-justify">
                The FABLAB supports academic projects, research activities, startup prototyping, and skill development initiatives. By fostering <span className="bg-blue-950/20 px-2 py-0 rounded border border-blue-950/30 font-semibold">creativity, collaboration, and experimentation</span>, the lab plays a key role in developing industry-relevant skills, encouraging innovation, and nurturing an entrepreneurial mindset among learners and innovators.
              </p>
              </div>
              <div className="flex justify-center lg:justify-end">
                <img 
                  src="https://picsum.photos/600/500?random=10" 
                  alt="SIF-FABLAB Innovation" 
                  className="rounded-xl shadow-lg w-full max-w-lg lg:max-w-2xl object-cover h-[350px]"
                />
              </div>
            </div>
          </div>

        </ScrollReveal>

        {/* Mission Section */}
        <div className="w-full mb-0 bg-blue-950">
          <ScrollReveal>
            <div className="mx-4 sm:mx-6 lg:mx-8 py-8">
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center p-8 lg:p-12 rounded-2xl">
                <div className="flex justify-center order-last md:order-first">
                    <img src="https://picsum.photos/800/600?random=2" alt="Mission - Lab collaboration" className="rounded-2xl shadow-lg w-full object-cover h-[280px]"/>
                  </div>
                  <div className="text-white order-first md:order-last">
                  <section aria-labelledby="mission-heading">
                    <h2 id="mission-heading" className="text-3xl md:text-4xl font-bold mb-6 text-yellow-300 inline-block border-b-4 border-yellow-300">Our Mission</h2>
                    <p className="text-lg leading-relaxed text-blue-100 text-justify mb-6">
                      The mission of the FABLAB is to promote <span className="font-bold text-yellow-300">innovation, creativity, and experiential learning</span> by providing access to advanced fabrication and prototyping facilities. The lab empowers users to design, build, test, and refine ideas in a practical environment, enabling <span className="font-bold text-yellow-300">real-world problem-solving and skill development</span>. It supports multidisciplinary collaboration, academic excellence, and startup innovation while fostering a safe, inclusive, and technology-driven culture.
                    </p>
                  </section>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        
        {/* Vision Section */}
        <div className="w-full mb-0" style={{ backgroundColor: '#fffdeb' }}>
          <ScrollReveal delay={200}>
            <div className="mx-4 sm:mx-6 lg:mx-8 py-8">
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center p-8 lg:p-12 rounded-2xl">
                <div className="text-blue-950">
                  <section aria-labelledby="vision-heading">
                    <h2 id="vision-heading" className="text-3xl md:text-4xl font-bold mb-6 text-blue-950 inline-block border-b-4 border-blue-950">Our Vision</h2>
                    <p className="text-lg leading-relaxed text-blue-900 text-justify mb-6">
                      The vision of the FABLAB is to become a <span className="bg-blue-950/20 px-2 py-0 rounded border border-blue-950/30 font-bold">center of excellence for innovation and technology-driven creation</span>. The lab aspires to build a dynamic ecosystem where ideas evolve into <span className="bg-blue-950/20 px-2 py-0 rounded border border-blue-950/30 font-bold">impactful solutions</span> that address real-world challenges. By encouraging collaboration, embracing emerging technologies, and supporting sustainable innovation, the FABLAB aims to develop <span className="bg-blue-950/20 px-2 py-0 rounded border border-blue-950/30 font-bold">future-ready innovators</span> and contribute to technological and entrepreneurial growth.
                    </p>
                  </section>
                </div>
                <div className="flex justify-center">
                  <img src="https://picsum.photos/800/600?random=3" alt="Vision - Future innovation" className="rounded-2xl shadow-lg w-full object-cover h-[280px]"/>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
        {/* Our Team Section */}
        <div className="w-full  bg-blue-950">
          <ScrollReveal>
            <div className="mx-4 sm:mx-6 lg:mx-8 py-8">
              <div className="rounded-2xl p-6 lg:p-8">
                {/* Section Header */}
                <div className="text-center mb-8">
                  <h2 className="text-4xl md:text-5xl font-bold text-yellow-300 inline-block border-b-4 border-yellow-300 pb-2">
                    Our Team
                  </h2>
                  <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
                    Meet the dedicated team driving innovation and supporting makers at the FABLAB.
                  </p>
                </div>

                {/* Team Grid */}
                <div className="max-w-6xl mx-auto">
                  {/* First 3 members */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                    {/* Head & CEO */}
                    <div className="flex flex-col items-center justify-start p-4">
                      <div className="w-32 h-32 lg:w-40 lg:h-40 mb-4 relative">
                        <img 
                          src="/src/assets/OurTeam/sathya_murthy.jpeg" 
                          alt="Mr. Sathya Murthy V" 
                          className="w-full h-full rounded-full object-cover shadow-2xl"
                        />
                      </div>
                      <div className="text-center text-white">
                        <h3 className="text-xl lg:text-2xl font-bold text-yellow-300 mb-2">Mr. Sathya Murthy V</h3>
                        <p className="text-base text-yellow-200 font-medium mb-2">Head & CEO</p>
                        <a href="https://www.linkedin.com/in/sathyavibes/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center hover:opacity-80 transition-opacity">
                          <FaLinkedin className="w-6 h-6 text-yellow-50" />
                        </a>
                      </div>
                    </div>

                    {/* Incubations Manager 1 */}
                    <div className="flex flex-col items-center justify-start p-4">
                      <div className="w-32 h-32 lg:w-40 lg:h-40 mb-4 relative">
                        <img 
                          src="/src/assets/OurTeam/brabasuthan.jpeg" 
                          alt="Mr. Brabasuthan M" 
                          className="w-full h-full rounded-full object-cover shadow-2xl"
                        />
                      </div>
                      <div className="text-center text-white">
                        <h3 className="text-xl lg:text-2xl font-bold text-yellow-300 mb-2">Mr. Brabasuthan M</h3>
                        <p className="text-base text-yellow-200 font-medium mb-2">Incubations Manager</p>
                        <a href="https://www.linkedin.com/in/brabasuthan-murugesan/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center hover:opacity-80 transition-opacity">
                          <FaLinkedin className="w-6 h-6 text-yellow-50" />
                        </a>
                      </div>
                    </div>

                    {/* Incubations Manager 2 */}
                    <div className="flex flex-col items-center justify-start p-4">
                      <div className="w-32 h-32 lg:w-40 lg:h-40 mb-4 relative">
                        <img 
                          src="/src/assets/OurTeam/sharveshwar.jpeg" 
                          alt="Mr. Sharveshwar R" 
                          className="w-full h-full rounded-full object-cover shadow-2xl"
                        />
                      </div>
                      <div className="text-center text-white">
                        <h3 className="text-xl lg:text-2xl font-bold text-yellow-300 mb-2">Mr. Sharveshwar R</h3>
                        <p className="text-base text-yellow-200 font-medium mb-2">Incubations Manager</p>
                        <a href="https://www.linkedin.com/in/sharveshwar/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center hover:opacity-80 transition-opacity">
                          <FaLinkedin className="w-6 h-6 text-yellow-50" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Last 2 members - centered */}
                  <div className="flex flex-wrap justify-center gap-8">
                    {/* Project Associate 1 */}
                    <div className="flex flex-col items-center justify-start p-4">
                      <div className="w-32 h-32 lg:w-40 lg:h-40 mb-4 relative">
                        <img 
                          src="/src/assets/OurTeam/jayasurya.jpeg" 
                          alt="Mr. Jayasurya M" 
                          className="w-full h-full rounded-full object-cover shadow-2xl"
                        />
                      </div>
                      <div className="text-center text-white">
                        <h3 className="text-xl lg:text-2xl font-bold text-yellow-300 mb-2">Mr. Jayasurya M</h3>
                        <p className="text-base text-yellow-200 font-medium mb-2">Project Associate</p>
                        <a href="https://www.linkedin.com/in/jayasurya-marudhasalamoorthi-06516027b/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center hover:opacity-80 transition-opacity">
                          <FaLinkedin className="w-6 h-6 text-yellow-50" />
                        </a>
                      </div>
                    </div>

                    {/* Project Associate 2 */}
                    <div className="flex flex-col items-center justify-start p-4">
                      <div className="w-32 h-32 lg:w-40 lg:h-40 mb-4">
                        <img 
                          src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3461&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                          alt="Ms. Sakthi Priyadarshini" 
                          className="w-full h-full rounded-full object-cover shadow-2xl"
                        />
                      </div>
                      <div className="text-center text-white">
                        <h3 className="text-xl lg:text-2xl font-bold text-yellow-300 mb-2">Ms. Sakthi Priyadarshini</h3>
                        <p className="text-base text-yellow-200 font-medium">Project Associate</p>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center hover:opacity-80 transition-opacity">
                          <FaLinkedin className="w-6 h-6 text-yellow-50" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        
      </div>

    </div>
  );
};

export default About;
