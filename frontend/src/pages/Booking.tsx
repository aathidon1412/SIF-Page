import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { SAMPLE_EQUIPMENTS, SAMPLE_LABS } from '../lib/data';

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleCardClick = async () => {
    try {
      if (!auth.user) {
        await auth.signInWithGoogle();
      }
    } catch (e) {
      // ignore sign-in errors for now
    }
    navigate('/main-booking');
  };

  // now sourced from shared data module

  return (
    <div className="bg-yellow-50 pt-14 dark:bg-yellow-50 min-h-screen">
      <div className="w-full">
        {/* Hero block removed per request */}
        

  {/* Equipment section (separate) */}
  <section className="w-full">
    <div className="max-w-7xl mx-auto px-6 pb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-blue-900 underline decoration-blue-950 decoration-2">Available Equipment</h2>
        <div>
          <button className="bg-blue-950 text-[#fffdeb] px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors">View more</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_EQUIPMENTS.map((eq) => (
          <article key={eq.id} role="button" tabIndex={0} onClick={handleCardClick} onKeyDown={(e) => { if (e.key === 'Enter') handleCardClick(); }} className="bg-white rounded-2xl shadow-md border cursor-pointer flex flex-col h-full">
            <div className="relative rounded-lg overflow-hidden h-44 mb-4">
              <img src={eq.image} alt={eq.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">EQUIPMENT</span>
              <span className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs">● Available</span>
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{eq.title}</h3>
              <p className="text-sm text-gray-600 mb-4 flex-grow">{eq.description}</p>
              <div className="flex items-center justify-between mt-auto">
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
                }} className="bg-blue-950 text-[#fffdeb] px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors">Book Now</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>

  {/* Labs section (separate) */}
  <section className="w-full">
    <div className="w-full bg-blue-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold underline decoration-blue-950 decoration-2">Available Labs</h2>
          <div>
            <button className="bg-blue-950 text-[#fffdeb] px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors">View more</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_LABS.map((lab) => (
            <article key={lab.id} role="button" tabIndex={0} onClick={handleCardClick} onKeyDown={(e) => { if (e.key === 'Enter') handleCardClick(); }} className="bg-[#fffdeb] text-blue-950 rounded-2xl shadow-md border cursor-pointer flex flex-col h-full">
              <div className="relative rounded-lg overflow-hidden h-44 mb-4">
                <img src={lab.image} alt={lab.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">LAB</span>
                <span className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs">● Available</span>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-blue-950 mb-2">{lab.name}</h3>
                <p className="text-sm text-slate-700 mb-4 flex-grow">{lab.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <div className="text-2xl font-bold text-blue-950">${lab.pricePerHour.toFixed(0)}</div>
                    <div className="text-xs text-slate-700">/ hour · Capacity {lab.capacity}</div>
                  </div>
                  <button className="bg-blue-950 text-[#fffdeb] px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors">Book Lab</button>
                </div>
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