import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScrollReveal from './ui/ScrollReveal';
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { fetchItems } from '../services/api';
import { useAuth } from '../lib/auth';

interface Service {
  icon: string;
  title: string;
  description: string;
  searchTerm: string; // Term to match equipment/lab
  type: 'equipment' | 'lab';
}

const services: Service[] = [
  {
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    title: '3D Printing',
    description: 'Bring digital models to life with our high-precision FDM and Resin 3D printers.',
    searchTerm: '3D Printer',
    type: 'equipment'
  },
  {
    icon: 'M5 13l4 4L19 7',
    title: 'Laser Cutting & Engraving',
    description: 'Cut and engrave intricate designs on various materials like wood, acrylic, and fabric.',
    searchTerm: 'Laser',
    type: 'equipment'
  },
  {
    icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V4m0 16v-2M8 9a4 4 0 100-8 4 4 0 000 8z',
    title: 'Electronics Workbench',
    description: 'Access soldering stations, oscilloscopes, and components for your electronic projects.',
    searchTerm: 'Electronics',
    type: 'lab'
  },
  {
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    title: 'PCB Milling',
    description: 'Create custom printed circuit boards for your prototypes and final products.',
    searchTerm: 'PCB',
    type: 'equipment'
  },
  {
    icon: 'M17 20h5V4h-5v16zM3 20h5V4H3v16z',
    title: 'Workshops & Training',
    description: 'Join our regular workshops to learn new skills and master the lab equipment.',
    searchTerm: 'Workshop',
    type: 'lab'
  },
  {
    icon: 'M12 6.253v11.494m-9-5.747h18',
    title: 'Project Consultation',
    description: 'Get expert advice and guidance from our lab managers for your projects.',
    searchTerm: 'Makerspace',
    type: 'lab'
  },
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
  return (
    <section className="py-20" style={{ backgroundColor: '#fffdeb' }}>
      <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-10">
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
          <HoverEffect items={items} className="gap-6" />
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ServicesSection;
