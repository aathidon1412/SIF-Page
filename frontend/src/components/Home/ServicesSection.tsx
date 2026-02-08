import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScrollReveal from '../ui/ScrollReveal';
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { fetchItems } from '../../services/api';
import { useAuth } from '../../lib/auth';

interface Service {
  title: string;
  description: string;
  searchTerm: string; // Term to match equipment/lab
  type: 'equipment' | 'lab';
}

const services: Service[] = [
  {
    title: 'Digital Fabrication Facilities',
    description: 'Advanced fabrication tools including CNC milling machines, CNC laser cutters, 3-axis CNC routers, FDM and DLP 3D printers, along with power and woodworking tools for precision cutting and finishing.',
    searchTerm: 'Fabrication',
    type: 'equipment'
  },
  {
    title: 'Electronics & Embedded Systems Lab',
    description: 'Comprehensive electronics lab with Arduino, Raspberry Pi, IoT boards, sensors, testing instruments, and soldering tools for embedded and IoT development.',
    searchTerm: 'Electronics',
    type: 'lab'
  },
  {
    title: 'Prototyping & Product Development Tools',
    description: 'Complete set of electronic components, motors, robotic parts, hand tools, and measuring instruments to build and refine functional prototypes.',
    searchTerm: 'Prototyping',
    type: 'equipment'
  },
  {
    title: 'Mechanical & Fabrication Tools',
    description: 'Mechanical tools including drilling machines, grinders, welding equipment, air compressors, workbenches, and precision alignment tools.',
    searchTerm: 'Mechanical',
    type: 'equipment'
  },
  {
    title: 'Design & Innovation Resources',
    description: 'Dedicated space for design thinking, ideation, CAD/CAM-based workflows, rapid iteration, and prototype testing.',
    searchTerm: 'Design',
    type: 'lab'
  },
  {
    title: 'Student, Startup & Innovator Support Services',
    description: 'Technical guidance, mentorship, prototype validation, and access to incubation, co-working spaces, and innovation ecosystems.',
    searchTerm: 'Startup',
    type: 'lab'
  },
  {
    title: 'Training & Skill Development',
    description: 'Hands-on workshops, machine operation and safety training, project-based learning, and industry-oriented skill development programs.',
    searchTerm: 'Training',
    type: 'lab'
  }
];


const ServicesSection: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [allItems, setAllItems] = useState<any[]>([]);

  useEffect(() => {
    async function loadItems() {
      try {
        const data = await fetchItems();
        const normalized = data.map((d: any) => ({ ...d, id: d._id || d.id }));
        setAllItems(normalized);
      } catch (e) {
        console.error('Failed to load items for services:', e);
      }
    }
    loadItems();
  }, []);

  const handleServiceClick = async (service: Service) => {
    // Check if user is logged in first
    try {
      if (!auth.user) {
        await auth.signInWithGoogle();
      }
    } catch (e) {
      // If sign-in fails or is cancelled, don't proceed
      console.error('Sign-in failed:', e);
      return;
    }

    // Find matching equipment or lab
    const matchedItem = allItems.find(item => 
      item.type === service.type && 
      (item.title?.toLowerCase().includes(service.searchTerm.toLowerCase()) ||
       item.name?.toLowerCase().includes(service.searchTerm.toLowerCase()))
    );

    if (matchedItem) {
      // Navigate with pre-selected item
      navigate('/main-booking', {
        state: {
          preselectedItem: matchedItem,
          openBookingModal: true,
          tab: service.type === 'lab' ? 'labs' : 'equipment'
        }
      });
    } else {
      // Navigate to booking page with appropriate tab
      navigate('/main-booking', {
        state: {
          tab: service.type === 'lab' ? 'labs' : 'equipment'
        }
      });
    }
  };

  const items = services.map((s) => ({
    title: s.title,
    description: s.description,
    link: "#",
    onClick: () => handleServiceClick(s),
  }));
  
  const topItems = items.slice(0, 4);
  const bottomItems = items.slice(4, 7);
  
  return (
    <section className="py-20" style={{ backgroundColor: '#fffdeb' }}>
      <div className=".container-fluid mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 inline-block border-b-4 border-blue-900">
              Our <span className="text-blue-900">Facilities</span> & <span className="text-blue-900">Services</span>
            </h2>
            <p className="mt-4 text-lg text-slate-700">
              Everything you need to<span className="font-medium text-blue-900 px-1 rounded">build</span>anything.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <div className="max-w-7xl mx-auto">
            <HoverEffect items={topItems} className="gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4" />
            <HoverEffect items={bottomItems} className="gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ServicesSection;
