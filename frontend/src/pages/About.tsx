import React from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';



const About: React.FC = () => {
  return (
    <div className="bg-yellow-50 pt-14 dark:bg-yellow-50">
      <div className="w-full ">
        {/* Header Section */}
        <ScrollReveal>
          <div className="mb-16 mt-8 mx-4 sm:mx-6 lg:mx-8 border-2 border-blue-950 rounded-2xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-black inline-block border-b-4 border-blue-950">
                  About <span className="text-blue-950 dark:text-blue-950">SIF-FABLAB</span>
                </h1>
                <p className="mt-10 text-xl max-w-4xl text-black dark:text-black leading-loose">
                Discover our mission, our history, and the team that makes innovation happen every day.
                At SIF-FABLAB, we are passionate about <span className="bg-blue-950/20 px-2 py-0 rounded border border-blue-950/30">empowering creators and entrepreneurs</span> by providing access to <span className="bg-blue-950/20 px-2 py-0 rounded border border-blue-950/30">cutting-edge digital fabrication tools</span> and collaborative spaces. 
                Our journey began with a vision to bridge the gap between ideas and execution, fostering a vibrant community where innovation thrives. 
                Through workshops, mentorship, and interdisciplinary projects, we nurture creativity and drive <span className="bg-blue-950/20 px-2 py-0  rounded border border-blue-950/30">impactful solutions</span> that reshape industries and enrich lives.
              </p>
              </div>
              <div className="flex justify-center lg:justify-end">
                <img 
                  src="https://picsum.photos/600/500?random=10" 
                  alt="SIF-FABLAB Innovation" 
                  className="rounded-xl shadow-lg w-full max-w-md lg:max-w-lg object-cover"
                />
              </div>
            </div>
          </div>

        </ScrollReveal>

        {/* Mission Section */}
        <div className="w-full mb-0 bg-blue-950">
          <ScrollReveal>
            <div className="mx-4 sm:mx-6 lg:mx-8 py-8">
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center p-8 lg:p-12 border-2 rounded-2xl" style={{ borderColor: '#fffdeb' }}>
                <div className="flex justify-center">
                  <img src="https://picsum.photos/800/600?random=2" alt="Mission - Lab collaboration" className="rounded-2xl shadow-lg w-full object-cover"/>
                </div>
                <div className="text-white">
                  <section aria-labelledby="mission-heading">
                    <h2 id="mission-heading" className="text-3xl md:text-4xl font-bold mb-6 text-yellow-300 inline-block border-b-4 border-yellow-300">Our Mission</h2>
                    <p className="text-lg leading-relaxed text-blue-100 mb-6">
                      To democratize access to digital fabrication technologies, fostering innovation, collaboration, and lifelong learning.
                    </p>
                    <p className="text-base leading-relaxed text-blue-100 mb-6">
                      We envision a world where creative ideas are not limited by access to tools or technical expertise, where every individual has the opportunity to transform concepts into reality through hands-on experimentation and digital fabrication.
                    </p>
                    <div className="space-y-3 text-blue-100">
                      <ul className="space-y-3 text-base">
                        <li className="flex items-start">
                          <span className="text-yellow-300 mr-3 mt-1">•</span>
                          <span><span className="text-yellow-300 font-medium">Universal Access</span> - Making cutting-edge tools available to everyone</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-yellow-300 mr-3 mt-1">•</span>
                          <span><span className="text-yellow-300 font-medium">Inclusive Learning</span> - Creating environments where experimentation thrives</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-yellow-300 mr-3 mt-1">•</span>
                          <span><span className="text-yellow-300 font-medium">Breaking Barriers</span> - Empowering creators from all backgrounds</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-yellow-300 mr-3 mt-1">•</span>
                          <span><span className="text-yellow-300 font-medium">Community Building</span> - Fostering collaboration and knowledge sharing</span>
                        </li>
                      </ul>
                    </div>
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
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center p-8 lg:p-12 border-2 rounded-2xl border-blue-950">
                <div className="text-blue-950">
                  <section aria-labelledby="vision-heading">
                    <h2 id="vision-heading" className="text-3xl md:text-4xl font-bold mb-6 text-blue-950 inline-block border-b-4 border-blue-950">Our Vision</h2>
                    <p className="text-lg leading-relaxed text-blue-900 mb-6">
                      To be a <span className="bg-blue-950/20 px-2 py-0 rounded border border-blue-950/30">leading hub for digital fabrication</span> and interdisciplinary research, recognized for its contribution to education, entrepreneurship, and community development.
                    </p>
                    <p className="text-base leading-relaxed text-blue-900 mb-6">
                      We strive to become a beacon of innovation where groundbreaking research meets practical application, inspiring the <span className="bg-blue-950/20 px-2 py-0 rounded border border-blue-950/30">next generation of makers</span>, researchers, and entrepreneurs to shape the future.
                    </p>
                    <div className="space-y-3 text-blue-900">
                      <ul className="space-y-3 text-base">
                        <li className="flex items-start">
                          <span className="text-blue-950 mr-3 mt-1">•</span>
                          <span><span className="text-blue-950 font-medium">Research Excellence</span> - Driving interdisciplinary innovation and discovery</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-950 mr-3 mt-1">•</span>
                          <span><span className="text-blue-950 font-medium">Educational Impact</span> - Transforming learning through hands-on experience</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-950 mr-3 mt-1">•</span>
                          <span><span className="text-blue-950 font-medium">Entrepreneurial Growth</span> - Nurturing startups and business innovation</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-950 mr-3 mt-1">•</span>
                          <span><span className="text-blue-950 font-medium">Community Leadership</span> - Inspiring regional and global development</span>
                        </li>
                      </ul>
                    </div>
                  </section>
                </div>
                <div className="flex justify-center">
                  <img src="https://picsum.photos/800/600?random=3" alt="Vision - Future innovation" className="rounded-2xl shadow-lg w-full object-cover"/>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
        {/* Our Team Section */}
        <div className="w-full  bg-blue-950">
          <ScrollReveal>
            <div className="mx-4 sm:mx-6 lg:mx-8 py-8">
              <div className="border-4 rounded-2xl p-6 lg:p-8" style={{ borderColor: '#fffdeb' }}>
                {/* Section Header */}
                <div className="text-center mb-6">
                  <h2 className="text-4xl md:text-5xl font-bold text-yellow-300 inline-block border-b-4 border-yellow-300 pb-2">
                    Our Team
                  </h2>
                  <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
                    Meet the visionary leaders driving innovation and fostering the next generation of makers at SIF-FABLAB.
                  </p>
                </div>

                {/* Team Grid with Divider */}
                <div className="relative grid md:grid-cols-2 gap-0 min-h-[400px]">
                  {/* Founder Section */}
                  <div className="flex flex-col items-center justify-start p-3 lg:p-4">
                    <div className="w-40 h-40 lg:w-48 lg:h-48 mb-4">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                        alt="Dr. Rahman Al-Farisi - Founder" 
                        className="w-full h-full rounded-full object-cover border-4 shadow-2xl"
                        style={{ borderColor: '#fffdeb' }}
                      />
                    </div>
                    <div className="text-center text-white max-w-sm">
                      <h3 className="text-2xl lg:text-3xl font-bold text-yellow-300 mb-2">Dr. Rahman Al-Farisi</h3>
                      <p className="text-lg text-yellow-200 mb-4 font-medium">Founder & Director</p>
                      
                      <div className="space-y-2 text-sm text-blue-200">
                        <p>• PhD in Mechanical Engineering</p>
                        <p>• Former MIT Research Fellow</p>
                        <p>• 20+ Patents in Digital Fabrication</p>
                      </div>
                    </div>
                  </div>

                  {/* Vertical Divider */}
                  <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 transform -translate-x-1/2" style={{ backgroundColor: '#fffdeb' }}></div>
                  
                  {/* Horizontal Divider for Mobile */}
                  <div className="md:hidden w-full h-1 my-8" style={{ backgroundColor: '#fffdeb' }}></div>

                  {/* Co-Founder Section */}
                  <div className="flex flex-col items-center justify-start p-3 lg:p-4">
                    <div className="w-40 h-40 lg:w-48 lg:h-48 mb-4">
                      <img 
                        src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3461&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                        alt="Dr. Maya Patel - Co-Founder" 
                        className="w-full h-full rounded-full object-cover border-4 shadow-2xl"
                        style={{ borderColor: '#fffdeb' }}
                      />
                    </div>
                    <div className="text-center text-white max-w-sm">
                      <h3 className="text-2xl lg:text-3xl font-bold text-yellow-300 mb-2">Dr. Maya Patel</h3>
                      <p className="text-lg text-yellow-200 mb-4 font-medium">Co-Founder & Innovation Lead</p>
                      
                      <div className="space-y-2 text-sm text-blue-200">
                        <p>• MBA from Stanford Business School</p>
                        <p>• Serial Tech Entrepreneur</p>
                        <p>• 3 Successful Exits in DeepTech</p>
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
