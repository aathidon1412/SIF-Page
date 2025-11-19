import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../lib/auth';
import { fetchItems } from '../services/api';

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const equipments = items.filter(item => item.type === 'equipment').slice(0, 6);
  const labs = items.filter(item => item.type === 'lab').slice(0, 6);

  // Load items from backend API (same as MainBooking)
  useEffect(() => {
    async function loadItems() {
      try {
        const data = await fetchItems();
        const normalized = data.map((d: any) => ({ ...d, id: d._id || d.id }));
        setItems(normalized);
      } catch (e) {
        console.error('Failed to load items:', e);
        // Fallback to empty arrays if API fails
        setItems([]);
      }
    }
    loadItems();
  }, []);

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
                <button
                  type="button"
                  onClick={handleCardClick}
                  className="bg-blue-950 text-[#fffdeb] px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors"
                >
                  View more
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipments.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500">
                    {items.length === 0 ? 'Loading equipment...' : 'No equipment available at the moment.'}
                  </div>
                </div>
              ) : (
                equipments.map((eq) => {
                  // Check availability (same logic as MainBooking)
                  const available = eq.available !== false;
                  return (
                    <article key={eq.id} role="button" tabIndex={0} onClick={handleCardClick} onKeyDown={(e) => { if (e.key === 'Enter') handleCardClick(); }} className={`bg-white rounded-2xl shadow p-4 border cursor-pointer transition-all duration-300 ${available ? 'hover:shadow-lg' : 'opacity-60 grayscale cursor-not-allowed'}`}>
                      <div className="relative rounded-lg overflow-hidden h-44 mb-4">
                        <img src={eq.image} alt={eq.title} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">EQUIPMENT</span>
                        <span className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          <FaCheckCircle className={available ? "text-green-600" : "text-gray-400"} size={10} />
                          {available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">{eq.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{eq.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-slate-900">Rs: {eq.pricePerDay ? eq.pricePerDay.toFixed(2) : '0.00'}</div>
                          <div className="text-xs text-gray-500">/ day</div>
                        </div>
                        <button 
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (!available) return;
                            try {
                              if (!auth.user) {
                                await auth.signInWithGoogle();
                              }
                            } catch (e) {
                              // ignore
                            }
                            navigate('/main-booking');
                          }} 
                          disabled={!available}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            available 
                              ? 'bg-blue-950 text-[#fffdeb] hover:bg-blue-900' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {available ? 'Book Now' : 'Unavailable'}
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* Labs section (separate) - full-bleed (no left/right space) */}
        <section className="w-full">
          <div className="w-full rounded-xl overflow-hidden bg-blue-950 text-white">
            <div className="max-w-7xl mx-auto px-6 py-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold underline decoration-blue-950 decoration-2">Available Labs</h2>
                <div>
                  <button
                    type="button"
                    onClick={handleCardClick}
                    className="bg-yellow-50 text-blue-950 px-4 py-2 rounded-lg hover:bg-yellow-100 transition-colors"
                  >
                    View more
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {labs.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-500">
                      {items.length === 0 ? 'Loading labs...' : 'No labs available at the moment.'}
                    </div>
                  </div>
                ) : (
                  labs.map((lab) => {
                    // Check availability (same logic as MainBooking)
                    const available = lab.available !== false;
                    const labName = lab.name || lab.title;
                    return (
                      <article key={lab.id} role="button" tabIndex={0} onClick={() => available && handleCardClick()} onKeyDown={(e) => { if (e.key === 'Enter' && available) handleCardClick(); }} className={`bg-[#fffdeb] text-blue-950 rounded-2xl p-4 shadow-md border transition-all duration-300 ${available ? 'cursor-pointer hover:shadow-lg' : 'opacity-60 grayscale cursor-not-allowed'}`}>
                        <div className="relative rounded-lg overflow-hidden h-44 mb-4">
                          <img src={lab.image} alt={labName} className="w-full h-full object-cover" />
                          <span className="absolute top-3 left-3 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">LAB</span>
                          <span className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            <FaCheckCircle className={available ? "text-green-600" : "text-gray-400"} size={10} />
                            {available ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-blue-950 mb-1">{labName}</h3>
                        <p className="text-sm text-slate-700 mb-3">{lab.desc || lab.description}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-blue-950">Rs: {lab.pricePerHour ? lab.pricePerHour.toFixed(0) : '0'}</div>
                            <div className="text-xs text-slate-700">/ hour · Capacity {lab.capacity || 'N/A'}</div>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (available) handleCardClick();
                            }}
                            disabled={!available}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              available 
                                ? 'bg-blue-950 text-[#fffdeb] hover:bg-blue-900' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {available ? 'Book Lab' : 'Unavailable'}
                          </button>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Booking;