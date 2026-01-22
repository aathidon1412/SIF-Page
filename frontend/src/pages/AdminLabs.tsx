import React from 'react';
import { toast } from 'react-hot-toast';

type Props = any;

const AdminLabs: React.FC<Props> = (props) => {
  const { navigate, labs, searchQuery, setSearchQuery, handleEditItem, handleDeleteItem, updateItem, setItems } = props;

  return (
    <div>
      <button onClick={() => navigate('/admin')} className="mb-6 flex items-center gap-2 text-blue-950 hover:text-blue-700 font-medium transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </button>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>
              <div>
                <h3 className="text-2xl font-bold">Labs</h3>
                <p className="text-green-100 text-sm">{labs.length} labs available</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search labs by name or description..." className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all text-gray-900 placeholder-gray-400" />
            {searchQuery && (<button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {labs.filter((item:any) => {
              const title = (item as any).name;
              const desc = (item as any).desc;
              const searchText = `${title} ${desc}`.toLowerCase();
              return searchText.includes(searchQuery.toLowerCase());
            }).map((item:any) => {
              const available = item.available !== false;
              return (
                <div key={item.id} className={`bg-gray-50 rounded-xl border-2 border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 ${!available ? 'opacity-60' : ''}`}>
                  <div className="relative h-40 bg-gradient-to-br from-green-100 to-green-50">
                    {(item as any).image ? (<img src={(item as any).image} alt={(item as any).name} className="w-full h-full object-cover" />) : (<div className="w-full h-full flex items-center justify-center"><svg className="w-16 h-16 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>)}
                    {!available && (<div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"><span className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-bold">Under Maintenance</span></div>)}
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-bold text-gray-900 mb-1 truncate" title={(item as any).name}>{(item as any).name}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">{(item as any).desc}</p>
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200"><span className="text-xl font-bold text-green-600">${(item as any).pricePerHour}/hr</span><span className="text-xs text-gray-500">Capacity: {(item as any).capacity}</span></div>
                    <div className="flex items-center gap-2 mb-3"><button onClick={async () => { try { const token = localStorage.getItem('admin_token') || ''; const updated = await updateItem(token, item.id, { available: !available }); setItems((prev:any) => prev.map((i:any) => i.id === item.id ? { ...i, available: updated.available } : i)); toast.success(`Item marked as ${!available ? 'available' : 'unavailable'}`); } catch (e:any) { toast.error(e.message || 'Failed to update availability'); } }} className={`flex-1 inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${available ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>{available ? '✓ Available' : '✗ Unavailable'}</button></div>
                    <div className="flex gap-2"><button onClick={() => handleEditItem(item)} className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium">Edit</button><button onClick={() => handleDeleteItem(item.id)} className="bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium">Delete</button></div>
                  </div>
                </div>
              );
            })}
          </div>

          {labs.filter((item:any) => {
            const title = (item as any).name;
            const desc = (item as any).desc;
            const searchText = `${title} ${desc}`.toLowerCase();
            return searchText.includes(searchQuery.toLowerCase());
          }).length === 0 && (
            <div className="text-center py-12"><div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div><p className="text-gray-500 text-lg">{searchQuery ? `No labs found matching "${searchQuery}"` : 'No labs found'}</p><p className="text-gray-400 text-sm mt-2">{searchQuery ? 'Try adjusting your search terms' : 'Add new labs using the form above'}</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLabs;
