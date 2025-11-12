import React, { useMemo, useState } from 'react';
import { useAuth } from '../lib/auth';
import { FaBell } from 'react-icons/fa';
import { SAMPLE_EQUIPMENTS, SAMPLE_LABS } from '../lib/data';

const MainBooking: React.FC = () => {
  const { user, signOut } = useAuth();
  const [query, setQuery] = useState('');
  const [showLabs, setShowLabs] = useState(true);
  const [showEquipment, setShowEquipment] = useState(true);
  // notifications toggle is handled inline

  // use shared data
  const sampleCombined = useMemo(() => ({
    equipments: SAMPLE_EQUIPMENTS.map((e) => ({ id: e.id, title: e.title })),
    labs: SAMPLE_LABS.map((l) => ({ id: l.id, name: l.name })),
  }), []);

  const results = useMemo(() => {
    const eq = showEquipment ? sampleCombined.equipments.filter((x) => x.title.toLowerCase().includes(query.toLowerCase())) : [];
    const labs = showLabs ? sampleCombined.labs.filter((x) => x.name.toLowerCase().includes(query.toLowerCase())) : [];
    return { eq, labs };
  }, [query, showLabs, showEquipment, sampleCombined]);

  if (!user) return null; // should be protected route

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search labs or equipment" className="border rounded px-3 py-2" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={showLabs} onChange={() => setShowLabs((s) => !s)} /> Labs
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={showEquipment} onChange={() => setShowEquipment((s) => !s)} /> Equipment
          </label>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative" onClick={() => { /* toggle notifications - placeholder */ }}>
            <FaBell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1">3</span>
          </button>
          <div className="flex items-center gap-2">
            <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
            <div className="text-sm">{user.name}</div>
            <button onClick={signOut} className="text-sm text-blue-700">Sign out</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Equipment</h3>
          <ul className="space-y-2">
            {results.eq.map((e) => (
              <li key={e.id} className="p-3 bg-white rounded shadow">{e.title}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Labs</h3>
          <ul className="space-y-2">
            {results.labs.map((l) => (
              <li key={l.id} className="p-3 bg-white rounded shadow">{l.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainBooking;
