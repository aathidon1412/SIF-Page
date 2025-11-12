import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  // If merged booking app isn't present, render a designed booking page
  // that follows the About page theme and showcases available equipment.
  const SAMPLE_EQUIPMENTS = [
    { id: 'e1', title: 'Advanced Microscopy System', description: 'High-resolution digital microscope with 4K imaging capabilities.', pricePerDay: 75.0, image: 'https://images.unsplash.com/photo-1581092918484-8313ead0b31f?w=800&h=520&fit=crop' },
    { id: 'e2', title: 'Professional 3D Printer', description: 'Industrial-grade 3D printer with multiple material support.', pricePerDay: 45.0, image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800&h=520&fit=crop' },
    { id: 'e3', title: 'Precision Analytical Balance', description: 'Ultra-precise analytical balance with 0.0001g accuracy.', pricePerDay: 35.0, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=520&fit=crop' },
    { id: 'e4', title: 'UV-Vis Spectrophotometer', description: 'Professional UV-Visible spectrophotometer for analytical work.', pricePerDay: 55.0, image: 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800&h=520&fit=crop' },
    { id: 'e5', title: 'High-Performance Laser Cutter', description: 'CO2 laser cutter with precision controls for prototyping.', pricePerDay: 95.0, image: 'https://images.unsplash.com/photo-1567789884554-0b844b597180?w=800&h=520&fit=crop' },
    { id: 'e6', title: 'Precision CNC Mill', description: 'Desktop CNC milling machine ideal for precision parts and prototypes.', pricePerDay: 65.0, image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&h=520&fit=crop' },
  ]

  const SAMPLE_LABS = [
    { id: 'l1', name: 'Electronics Lab', desc: 'Workstations for PCB assembly, soldering, and testing with oscilloscopes and power supplies.', image: 'https://images.unsplash.com/photo-1581091122025-1c8b7b2b8a8e?w=800&h=520&fit=crop', capacity: '6-12', pricePerHour: 20 },
    { id: 'l2', name: 'Fabrication Lab', desc: 'CNC routers, laser cutters and 3D printers for rapid prototyping and fabrication.', image: 'https://images.unsplash.com/photo-1581092334476-6d2f7a7c9f9b?w=800&h=520&fit=crop', capacity: '4-8', pricePerHour: 30 },
    { id: 'l3', name: 'Optics & Imaging Lab', desc: 'Optical benches, microscopes and imaging systems for precision experiments.', image: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=800&h=520&fit=crop', capacity: '3-6', pricePerHour: 25 },
    { id: 'l4', name: 'Materials Lab', desc: 'Material testing equipment including tensile testers, hardness testers and microscopes.', image: 'https://images.unsplash.com/photo-1582560479120-9b9f8b8d3a6c?w=800&h=520&fit=crop', capacity: '4-10', pricePerHour: 28 },
    { id: 'l5', name: 'Chemistry Lab', desc: 'Fume hoods, wet benches and analytical instruments for chemical experiments.', image: 'https://images.unsplash.com/photo-1581092162179-0b2c9e1f8f1a?w=800&h=520&fit=crop', capacity: '2-6', pricePerHour: 22 },
    { id: 'l6', name: 'Advanced Prototyping Lab', desc: 'High-end prototyping tools and dedicated benches for advanced builds and testing.', image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981d?w=800&h=520&fit=crop', capacity: '4-8', pricePerHour: 35 },
  ]

  return (
    <div className="bg-yellow-50 pt-14 dark:bg-yellow-50 min-h-screen">
      <div className="w-full">
        {/* Hero block removed per request */}
        

  {/* Equipment section (separate) */}
  <section className="w-full px-6 pb-12">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-blue-900 underline decoration-blue-950 decoration-2">Available Equipment</h2>
        <div>
          <button className="bg-blue-950 text-white px-4 py-2 rounded-lg">View more</button>
        </div>
      </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_EQUIPMENTS.map((eq) => (
          <article key={eq.id} className="bg-white rounded-2xl shadow p-4 border">
            <div className="relative rounded-lg overflow-hidden h-44 mb-4">
              <img src={eq.image} alt={eq.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">EQUIPMENT</span>
              <span className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs">● Available</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">{eq.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{eq.description}</p>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-900">${eq.pricePerDay.toFixed(2)}</div>
                <div className="text-xs text-gray-500">/ day</div>
              </div>
              <button onClick={async () => {
                try {
                  // Attempt sign-in then navigate to main booking
                  if (!auth.user) {
                    await auth.signInWithGoogle();
                  }
                } catch (e) {
                  // ignore
                }
                navigate('/main-booking');
              }} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Book Now</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>

  {/* Labs section (separate) - full-bleed (no left/right space) */}
  <section className="w-full ">
    <div className="w-full rounded-xl overflow-hidden bg-blue-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold underline decoration-blue-950 decoration-2">Available Labs</h2>
          <div>
            <button className="bg-[#fffdeb] text-blue-950 px-4 py-2 rounded-lg">View more</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_LABS.map((lab) => (
            <article key={lab.id} className="bg-[#fffdeb] text-blue-950 rounded-2xl p-4 shadow-md border">
              <div className="relative rounded-lg overflow-hidden h-44 mb-4">
                <img src={lab.image} alt={lab.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">LAB</span>
                <span className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs">● Available</span>
              </div>
              <h3 className="text-lg font-semibold text-blue-950 mb-1">{lab.name}</h3>
              <p className="text-sm text-slate-700 mb-3">{lab.desc}</p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-950">${lab.pricePerHour.toFixed(0)}</div>
                  <div className="text-xs text-slate-700">/ hour · Capacity {lab.capacity}</div>
                </div>
                <button className="bg-blue-950 text-white px-4 py-2 rounded-lg">Book Lab</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
      </div>
    </div>
  )
        }

        export default Booking