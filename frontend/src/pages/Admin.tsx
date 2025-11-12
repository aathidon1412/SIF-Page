import React, { useEffect, useState } from 'react';

type Item = { id: string; title: string; type: 'lab' | 'equipment'; desc?: string };

const ADMIN_USER = import.meta.env.VITE_ADMIN_USER || 'thiganth';
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || 'thiganth';

const Admin: React.FC = () => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [items, setItems] = useState<Item[]>(() => {
    try {
      const raw = localStorage.getItem('admin_items');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('admin_items', JSON.stringify(items));
  }, [items]);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      setAuth(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const addItem = () => {
    const id = 'i' + Date.now();
    setItems((s) => [...s, { id, title: 'New Item', type: 'equipment', desc: 'Description' }]);
  };

  const removeItem = (id: string) => setItems((s) => s.filter((it) => it.id !== id));

  if (!auth) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
        <form onSubmit={login} className="space-y-3">
          <input value={user} onChange={(e) => setUser(e.target.value)} placeholder="username" className="w-full border px-3 py-2" />
          <input value={pass} onChange={(e) => setPass(e.target.value)} placeholder="password" type="password" className="w-full border px-3 py-2" />
          <button className="bg-blue-950 text-white px-4 py-2 rounded">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Admin Panel</h2>
        <div>
          <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => setAuth(false)}>Logout</button>
        </div>
      </div>

      <div className="mb-4">
        <button className="bg-blue-950 text-white px-3 py-1 rounded" onClick={addItem}>Add Item</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((it) => (
          <div key={it.id} className="p-4 bg-white rounded shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{it.title}</div>
                <div className="text-xs text-gray-500">{it.type}</div>
                <div className="text-sm text-gray-700">{it.desc}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="text-red-500" onClick={() => removeItem(it.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
