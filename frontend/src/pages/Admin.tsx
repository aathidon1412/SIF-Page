import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BookingRequest } from '../types/booking';
import { toast } from 'react-hot-toast';
import { useItems } from '../lib/itemsContext';
import { exportDataAsJson } from '../lib/dataManager';

const ADMIN_USER = import.meta.env.VITE_ADMIN_USER || 'thiganth';
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || 'thiganth';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { equipments, labs, addItem: addItemToContext, removeItem: removeItemFromContext, updateItem: updateItemInContext } = useItems();
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [activeTab, setActiveTab] = useState<'items' | 'bookings'>('bookings');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemType, setNewItemType] = useState<'lab' | 'equipment'>('equipment');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState<number>(0);
  const [newItemCapacity, setNewItemCapacity] = useState('');
  const [newItemImage, setNewItemImage] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [itemFilter, setItemFilter] = useState<'equipment' | 'labs'>('equipment');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get all items
  const allItems = [...equipments, ...labs];
  
  // Filter items based on search query and toggle selection
  const baseFilteredItems = itemFilter === 'equipment' ? equipments : labs;
  const filteredItems = baseFilteredItems.filter(item => {
    const title = 'title' in item ? item.title : (item as any).name;
    const desc = 'description' in item ? item.description : (item as any).desc;
    const searchText = `${title} ${desc}`.toLowerCase();
    return searchText.includes(searchQuery.toLowerCase());
  });
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>(() => {
    try {
      const raw = localStorage.getItem('booking_requests');
      if (raw) {
        const requests = JSON.parse(raw);
        // Sort by most recent activity (reviewedAt or submittedAt)
        return requests.sort((a: BookingRequest, b: BookingRequest) => {
          const dateA = new Date(a.reviewedAt || a.submittedAt).getTime();
          const dateB = new Date(b.reviewedAt || b.submittedAt).getTime();
          return dateB - dateA; // Most recent first
        });
      }
      return [];
    } catch {
      return [];
    }
  });
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [adminLogs, setAdminLogs] = useState<{ type: 'login' | 'logout'; timestamp: string }[]>(() => {
    try {
      const raw = localStorage.getItem('admin_logs');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'lab' | 'equipment'>('all');
  const [filterName, setFilterName] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  useEffect(() => {
    // Refresh booking requests when admin panel is loaded
    if (auth) {
      const raw = localStorage.getItem('booking_requests');
      if (raw) {
        const requests = JSON.parse(raw);
        // Sort by most recent activity (reviewedAt or submittedAt)
        const sortedRequests = requests.sort((a: BookingRequest, b: BookingRequest) => {
          const dateA = new Date(a.reviewedAt || a.submittedAt).getTime();
          const dateB = new Date(b.reviewedAt || b.submittedAt).getTime();
          return dateB - dateA; // Most recent first
        });
        setBookingRequests(sortedRequests);
      }
    }
  }, [auth]);

  // Hydrate saved filters on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('admin_filters');
      if (raw) {
        const f = JSON.parse(raw);
        setSearchTerm(f.searchTerm ?? '');
        setFilterType(f.filterType ?? 'all');
        setFilterName(f.filterName ?? '');
        setFilterStartDate(f.filterStartDate ?? '');
        setFilterEndDate(f.filterEndDate ?? '');
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist filters on change
  useEffect(() => {
    const payload = {
      searchTerm,
      filterType,
      filterName,
      filterStartDate,
      filterEndDate,
    };
    try {
      localStorage.setItem('admin_filters', JSON.stringify(payload));
    } catch {
      // ignore
    }
  }, [searchTerm, filterType, filterName, filterStartDate, filterEndDate]);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      setAuth(true);
      toast.success('Admin login successful');
      const newLogs = [
        ...adminLogs,
        { type: 'login' as const, timestamp: new Date().toISOString() }
      ];
      setAdminLogs(newLogs);
      localStorage.setItem('admin_logs', JSON.stringify(newLogs));
    } else {
      toast.error('Invalid credentials');
    }
  };

  const addItem = () => {
    if (!newItemTitle.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    const itemData: any = {
      title: newItemTitle,
      type: newItemType,
      desc: newItemDesc || 'No description provided'
    };

    // Add type-specific properties
    if (newItemType === 'equipment') {
      itemData.pricePerDay = newItemPrice || 50;
    } else {
      itemData.pricePerHour = newItemPrice || 25;
      itemData.capacity = newItemCapacity || '4-8';
    }

    if (newItemImage) {
      itemData.image = newItemImage;
    }

    addItemToContext(itemData);
    
    // Reset form
    setNewItemTitle('');
    setNewItemDesc('');
    setNewItemPrice(0);
    setNewItemCapacity('');
    setNewItemImage('');
    
    toast.success(`${newItemType} added successfully`);
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    
    const updates: any = {};
    
    if ('title' in editingItem) {
      // Equipment item
      updates.title = editingItem.title;
      updates.description = editingItem.description;
      updates.pricePerDay = editingItem.pricePerDay;
    } else {
      // Lab item
      updates.title = editingItem.name;
      updates.desc = editingItem.desc;
      updates.pricePerHour = editingItem.pricePerHour;
      updates.capacity = editingItem.capacity;
    }
    
    if (editingItem.image) {
      updates.image = editingItem.image;
    }
    
    updateItemInContext(editingItem.id, updates);
    
    setShowEditModal(false);
    setEditingItem(null);
    toast.success('Item updated successfully');
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      removeItemFromContext(id);
      toast.success('Item deleted successfully');
    }
  };

  const handleExportData = async () => {
    try {
      await exportDataAsJson();
      toast.success('Data exported successfully! Replace /src/data/items.json with the downloaded file to persist changes.');
    } catch (error) {
      toast.error('Failed to export data');
      console.error('Export error:', error);
    }
  };

  const handleBookingAction = (requestId: string, action: 'approved' | 'declined') => {
    // Validate request exists and is actionable
    const target = bookingRequests.find(r => r.id === requestId);
    if (!target) {
      toast.error('Request not found');
      return;
    }
    if (target.status !== 'pending') {
      toast.error('Action invalid: already processed');
      return;
    }
    if (!adminNote.trim()) {
      toast.error('Please add an admin note before proceeding');
      return;
    }
    const updatedRequests = bookingRequests.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          status: action,
          adminNote: adminNote,
          reviewedAt: new Date().toISOString()
        };
      }
      return request;
    });

    // Sort updated requests by most recent activity
    const sortedRequests = updatedRequests.sort((a, b) => {
      const dateA = new Date(a.reviewedAt || a.submittedAt).getTime();
      const dateB = new Date(b.reviewedAt || b.submittedAt).getTime();
      return dateB - dateA; // Most recent first
    });

    setBookingRequests(sortedRequests);
    localStorage.setItem('booking_requests', JSON.stringify(updatedRequests));
    setSelectedRequest(null);
    setAdminNote('');
    
    // In a real app, you would send an email notification to the user here
    if (action === 'approved') {
      toast.success('Booking request approved');
    } else {
      toast.error('Booking request declined');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'declined': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  // Helpers for quick filter presets
  const formatInputDate = (d: Date) => d.toISOString().slice(0, 10);
  const getToday = () => formatInputDate(new Date());
  const getWeekRange = () => {
    const now = new Date();
    const day = now.getDay(); // 0 Sun - 6 Sat
    const diffToMonday = ((day + 6) % 7); // 0 for Mon, 6 for Sun
    const start = new Date(now);
    start.setDate(now.getDate() - diffToMonday);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start: formatInputDate(start), end: formatInputDate(end) };
  };

  const applyPreset = (preset: 'pendingThisWeek' | 'labsToday' | 'equipmentToday') => {
    if (preset === 'pendingThisWeek') {
      const { start, end } = getWeekRange();
      setFilterStartDate(start);
      setFilterEndDate(end);
      setFilterType('all');
      setFilterName('');
      setSearchTerm('pending');
      return;
    }
    if (preset === 'labsToday') {
      const t = getToday();
      setFilterStartDate(t);
      setFilterEndDate(t);
      setFilterType('lab');
      setFilterName('');
      return;
    }
    if (preset === 'equipmentToday') {
      const t = getToday();
      setFilterStartDate(t);
      setFilterEndDate(t);
      setFilterType('equipment');
      setFilterName('');
    }
  };

  // Filter booking requests based on search term + filters (date range, type, name)
  const filteredRequests = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const n = filterName.trim().toLowerCase();

    const hasStart = !!filterStartDate;
    const hasEnd = !!filterEndDate;
    const fStart = hasStart ? new Date(filterStartDate + 'T00:00:00') : null;
    const fEnd = hasEnd ? new Date(filterEndDate + 'T23:59:59') : null;

    const matchesDate = (r: BookingRequest) => {
      if (!hasStart && !hasEnd) return true;
      const rs = new Date(r.startDate);
      const re = new Date(r.endDate);
      if (hasStart && hasEnd) {
        // overlap: re >= fStart && rs <= fEnd
        return (re >= (fStart as Date)) && (rs <= (fEnd as Date));
      }
      if (hasStart) return re >= (fStart as Date);
      // only end
      return rs <= (fEnd as Date);
    };

    return bookingRequests.filter(r => {
      // search across multiple fields
      const matchesSearch = !q || (
        r.userName.toLowerCase().includes(q) ||
        r.userEmail.toLowerCase().includes(q) ||
        r.itemTitle.toLowerCase().includes(q) ||
        r.itemType.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
      );

      // type filter
      const matchesType = filterType === 'all' || r.itemType === filterType;

      // name filter (lab/equipment title)
      const matchesName = !n || r.itemTitle.toLowerCase().includes(n);

      return matchesSearch && matchesType && matchesName && matchesDate(r);
    });
  }, [bookingRequests, searchTerm, filterType, filterName, filterStartDate, filterEndDate]);

  if (!auth) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-blue-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-950 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-blue-950 mb-2">Admin Portal</h1>
            <p className="text-blue-800">SIF-FAB LAB Management System</p>
          </div>
          
          <form onSubmit={login} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-blue-950 mb-2">Username</label>
              <input 
                value={user} 
                onChange={(e) => setUser(e.target.value)} 
                placeholder="Enter your username"
                required
                className="w-full border-2 border-blue-200 text-blue-950 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-colors" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-950 mb-2">Password</label>
              <input 
                value={pass} 
                onChange={(e) => setPass(e.target.value)} 
                placeholder="Enter your password"
                type="password" 
                required
                className="w-full border-2 border-blue-200 text-blue-950 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-colors" 
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-blue-950 text-white py-3 px-4 rounded-lg hover:bg-blue-900 transition-colors font-medium text-lg shadow-lg hover:shadow-xl"
            >
              Sign In to Admin Panel
            </button>
          </form>
          
          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-gray-600">Secure access to booking management</p>
            <button
              onClick={() => navigate('/main-booking')}
              className="inline-flex items-center space-x-2 text-blue-950 hover:text-blue-800 transition-colors font-medium text-sm border border-blue-200 hover:border-blue-300 px-4 py-2 rounded-lg hover:bg-blue-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50">
      {/* Enhanced Header */}
      <div className="bg-blue-950 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-blue-100 text-sm">SIF-FAB LAB Management Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/main-booking')}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 border border-white border-opacity-30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Booking</span>
              </button>
              <div className="text-right">
                <div className="text-sm text-blue-100">Welcome, Administrator</div>
                <div className="text-xs text-blue-200">{new Date().toLocaleDateString()}</div>
              </div>
              <button 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-colors font-medium shadow-lg flex items-center space-x-2" 
                onClick={() => { 
                  setAuth(false); 
                  toast.success('Logged out'); 
                  const newLogs = [
                    ...adminLogs,
                    { type: 'logout' as const, timestamp: new Date().toISOString() }
                  ];
                  setAdminLogs(newLogs);
                  localStorage.setItem('admin_logs', JSON.stringify(newLogs));
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-3xl font-bold text-blue-950">{bookingRequests.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{bookingRequests.filter(r => r.status === 'pending').length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600">{bookingRequests.filter(r => r.status === 'approved').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Declined</p>
                <p className="text-3xl font-bold text-red-600">{bookingRequests.filter(r => r.status === 'declined').length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admin Sessions</p>
                <p className="text-3xl font-bold text-blue-950">{adminLogs.filter(l => l.type === 'login').length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-600 space-y-1">
              <div><strong>Last Login:</strong> {adminLogs.filter(l => l.type === 'login').length === 0 ? '—' : new Date([...adminLogs.filter(l => l.type === 'login')].slice(-1)[0].timestamp).toLocaleString()}</div>
              <div><strong>Last Logout:</strong> {adminLogs.filter(l => l.type === 'logout').length === 0 ? '—' : new Date([...adminLogs.filter(l => l.type === 'logout')].slice(-1)[0].timestamp).toLocaleString()}</div>
            </div>
          </div>
        </div>
        {/* Enhanced Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 border border-blue-100">
          <div className="flex">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'bookings'
                  ? 'bg-blue-950 text-white shadow-lg'
                  : 'text-blue-950 hover:bg-blue-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Booking Requests</span>
              {bookingRequests.filter(r => r.status === 'pending').length > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  activeTab === 'bookings' ? 'bg-yellow-400 text-blue-950' : 'bg-blue-950 text-white'
                }`}>
                  {bookingRequests.filter(r => r.status === 'pending').length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('items')}
              className={`flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'items'
                  ? 'bg-blue-950 text-white shadow-lg'
                  : 'text-blue-950 hover:bg-blue-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Manage Items</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                activeTab === 'items' ? 'bg-yellow-400 text-blue-950' : 'bg-blue-100 text-blue-950'
              }`}>
                {allItems.length}
              </span>
            </button>
          </div>
        </div>

        {activeTab === 'bookings' ? (
          /* Booking Requests Tab */
          <div>
            <h2 className="text-2xl font-semibold text-blue-950 mb-6">Booking Requests</h2>
            {/* Search + Filters */}
            <div className="bg-white rounded-xl p-4 mb-6 border border-blue-100 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5 relative">
                  <label className="block text-xs font-semibold text-blue-950 mb-1">Search</label>
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="User, email, item, type, status"
                    className="w-full border-2 border-blue-200 text-blue-950 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-colors"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2 bottom-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-900 px-2 py-1 rounded"
                    >
                      Clear
                    </button>
                  )}
                  <svg className="w-5 h-5 absolute right-12 bottom-2.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M9.5 17A7.5 7.5 0 109.5 2a7.5 7.5 0 000 15z" />
                  </svg>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-blue-950 mb-1">Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as 'all' | 'lab' | 'equipment')}
                    className="w-full border-2 border-blue-200 text-blue-950 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-colors bg-white"
                  >
                    <option value="all">All</option>
                    <option value="lab">Labs</option>
                    <option value="equipment">Equipment</option>
                  </select>
                </div>

                <div className="md:col-span-4">
                  <label className="block text-xs font-semibold text-blue-950 mb-1">Name</label>
                  <div className="relative">
                    <input
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                      placeholder="Lab/Equipment name"
                      className="w-full border-2 border-blue-200 text-blue-950 rounded-lg px-4 py-2 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-colors"
                    />
                    {filterName && (
                      <button
                        type="button"
                        onClick={() => setFilterName('')}
                        className="absolute right-2 bottom-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-900 px-2 py-1 rounded"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-blue-950 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    className="w-full border-2 border-blue-200 text-blue-950 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-colors"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-blue-950 mb-1">End Date</label>
                  <input
                    type="date"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    className="w-full border-2 border-blue-200 text-blue-950 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-colors"
                  />
                </div>

                <div className="md:col-span-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setFilterType('all'); setFilterName(''); setFilterStartDate(''); setFilterEndDate(''); }}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-950 px-3 py-2 rounded-lg font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="md:col-span-12 flex flex-wrap gap-2 mt-2">
                  <span className="text-xs font-semibold text-blue-950 self-center">Quick Filters:</span>
                  <button
                    type="button"
                    onClick={() => applyPreset('pendingThisWeek')}
                    className="px-3 py-1.5 text-sm rounded-lg bg-yellow-100 hover:bg-yellow-200 text-blue-950 border border-yellow-200"
                  >
                    Pending This Week
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('labsToday')}
                    className="px-3 py-1.5 text-sm rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-950 border border-blue-200"
                  >
                    Labs Today
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('equipmentToday')}
                    className="px-3 py-1.5 text-sm rounded-lg bg-green-100 hover:bg-green-200 text-blue-950 border border-green-200"
                  >
                    Equipment Today
                  </button>
                </div>

                <div className="md:col-span-12 text-sm text-blue-950 font-medium">
                  Showing {filteredRequests.length} of {bookingRequests.length} requests
                </div>
              </div>
            </div>
            {bookingRequests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600 text-lg">No booking requests found.</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600 text-lg">No booking requests match your search.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="bg-white rounded-2xl shadow-lg p-6 border">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-blue-950">{request.itemTitle}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                            {request.status.toUpperCase()}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {request.itemType.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">Requested by: <strong>{request.userName}</strong> ({request.userEmail})</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Dates:</strong> {formatDate(request.startDate)} - {formatDate(request.endDate)}
                          </div>
                          {request.startTime && (
                            <div>
                              <strong>Time:</strong> {request.startTime} - {request.endTime}
                            </div>
                          )}
                          <div>
                            <strong>Total Cost:</strong> <span className="text-2xl font-bold text-green-600">${request.totalCost.toFixed(2)}</span>
                          </div>
                          <div>
                            <strong>Submitted:</strong> {formatDate(request.submittedAt)}
                          </div>
                        </div>

                        <div className="mt-4">
                          <strong>Purpose:</strong>
                          <p className="text-gray-600 mt-1">{request.purpose}</p>
                        </div>

                        {request.additionalNotes && (
                          <div className="mt-4">
                            <strong>Additional Notes:</strong>
                            <p className="text-gray-600 mt-1">{request.additionalNotes}</p>
                          </div>
                        )}

                        {request.adminNote && (
                          <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                            <div className="flex items-start space-x-3">
                              <div className="p-2 bg-blue-200 rounded-lg">
                                <svg className="w-4 h-4 text-blue-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-blue-950 mb-2">Admin Note</h4>
                                <p className="text-blue-800 leading-relaxed">{request.adminNote}</p>
                                {request.reviewedAt && (
                                  <p className="text-xs text-blue-600 mt-3 font-medium">
                                    Reviewed: {formatDate(request.reviewedAt)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {request.status === 'pending' && (
                      <div className="border-t border-blue-100 pt-6 mt-6 bg-blue-50 -mx-6 px-6 pb-6 rounded-b-2xl">
                        <div className="mb-4">
                          <label className="flex items-center space-x-2 text-sm font-semibold text-blue-950 mb-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Admin Note (optional)</span>
                          </label>
                          <textarea
                            value={selectedRequest?.id === request.id ? adminNote : ''}
                            onChange={(e) => {
                              setAdminNote(e.target.value);
                              setSelectedRequest(request);
                            }}
                            placeholder="Add a personalized note for the client (e.g., special instructions, conditions, or feedback)..."
                            rows={3}
                            className="w-full border-2 border-blue-200 text-blue-950 placeholder-blue-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-colors resize-none"
                          />
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              handleBookingAction(request.id, 'approved');
                            }}
                            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Approve Request</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              handleBookingAction(request.id, 'declined');
                            }}
                            className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl hover:bg-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Decline Request</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Items Management Tab */
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-blue-950">Manage Items</h2>
              <button
                onClick={handleExportData}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export Data</span>
              </button>
            </div>

            {/* Data Persistence Info */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Data Persistence:</strong> Changes are saved to browser storage and persist between sessions. 
                    To make changes permanent across deployments, use the <strong>"Export Data"</strong> button to download the updated JSON file, 
                    then replace <code className="bg-blue-100 px-1 rounded">/src/data/items.json</code> with the downloaded file.
                  </p>
                </div>
              </div>
            </div>

            {/* Add Item Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border mb-8">
              <h3 className="text-lg font-semibold text-blue-950 mb-4">Add New Item</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Item Type</label>
                  <select
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value as 'lab' | 'equipment')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-colors text-gray-900 placeholder-gray-500"
                  >
                    <option value="equipment">Equipment</option>
                    <option value="lab">Lab</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    placeholder="Enter item title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-colors text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    placeholder="Enter item description"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-colors text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ({newItemType === 'equipment' ? 'per day' : 'per hour'})
                  </label>
                  <input
                    type="number"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-colors text-gray-900 placeholder-gray-500"
                  />
                </div>
                {newItemType === 'lab' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                    <input
                      type="text"
                      value={newItemCapacity}
                      onChange={(e) => setNewItemCapacity(e.target.value)}
                      placeholder="e.g., 4-8"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-colors text-gray-900 placeholder-gray-500"
                    />
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (optional)</label>
                  <input
                    type="url"
                    value={newItemImage}
                    onChange={(e) => setNewItemImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-colors text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    onClick={addItem}
                    className="bg-blue-950 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition-colors font-medium"
                  >
                    Add {newItemType}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-blue-950">All Items</h3>
                <div className="text-sm text-gray-600">
                  {allItems.length} total items ({equipments.length} equipment, {labs.length} labs)
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search items by title or description..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-colors text-gray-900 placeholder-gray-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Filter Toggle */}
              <div className="flex justify-center">
                <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                  <button
                    onClick={() => setItemFilter('equipment')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      itemFilter === 'equipment'
                        ? 'bg-blue-950 text-white shadow-lg'
                        : 'text-gray-600 hover:text-blue-950 hover:bg-white'
                    }`}
                  >
                    Equipment ({equipments.length})
                  </button>
                  <button
                    onClick={() => setItemFilter('labs')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      itemFilter === 'labs'
                        ? 'bg-blue-950 text-white shadow-lg'
                        : 'text-gray-600 hover:text-blue-950 hover:bg-white'
                    }`}
                  >
                    Labs ({labs.length})
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => {
                  const isEquipment = 'title' in item;
                  const title = isEquipment ? item.title : (item as any).name;
                  const desc = isEquipment ? item.description : (item as any).desc;
                  const price = isEquipment ? `$${(item as any).pricePerDay}/day` : `$${(item as any).pricePerHour}/hour`;
                  const image = (item as any).image;
                  
                  return (
                    <div key={item.id} className="bg-white rounded-2xl shadow-lg border overflow-hidden">
                      {/* Item Image */}
                      <div className="relative h-48 bg-gray-100">
                        {image ? (
                          <img 
                            src={image} 
                            alt={title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-gray-500">No Image</span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                            {isEquipment ? 'EQUIPMENT' : 'LAB'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Item Details */}
                      <div className="p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{desc}</p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-lg font-bold text-blue-950">{price}</div>
                          {!isEquipment && (item as any).capacity && (
                            <div className="text-sm text-gray-500">Capacity: {(item as any).capacity}</div>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="bg-red-50 text-red-700 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {filteredItems.length === 0 && (
                <div className="text-center py-12 col-span-full">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">
                    {searchQuery ? 
                      `No ${itemFilter === 'equipment' ? 'equipment' : 'labs'} found matching "${searchQuery}"` :
                      itemFilter === 'equipment' ? 'No equipment found' : 'No labs found'}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    {searchQuery ? 
                      'Try adjusting your search terms or clear the search to see all items' :
                      'Add new items using the form above or switch to the other category'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-blue-950">Edit Item</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title/Name</label>
                <input
                  type="text"
                  value={'title' in editingItem ? editingItem.title : editingItem.name}
                  onChange={(e) => setEditingItem((prev: any) => 
                    'title' in prev 
                      ? { ...prev, title: e.target.value }
                      : { ...prev, name: e.target.value }
                  )}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-blue-950 text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={'description' in editingItem ? editingItem.description : editingItem.desc}
                  onChange={(e) => setEditingItem((prev: any) => 
                    'description' in prev 
                      ? { ...prev, description: e.target.value }
                      : { ...prev, desc: e.target.value }
                  )}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-blue-950 text-gray-900"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ({'title' in editingItem ? 'per day' : 'per hour'})
                  </label>
                  <input
                    type="number"
                    value={'title' in editingItem ? editingItem.pricePerDay : editingItem.pricePerHour}
                    onChange={(e) => setEditingItem((prev: any) => 
                      'title' in prev 
                        ? { ...prev, pricePerDay: Number(e.target.value) }
                        : { ...prev, pricePerHour: Number(e.target.value) }
                    )}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-blue-950 text-gray-900"
                  />
                </div>
                
                {'capacity' in editingItem && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                    <input
                      type="text"
                      value={editingItem.capacity}
                      onChange={(e) => setEditingItem((prev: any) => ({ ...prev, capacity: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-blue-950 text-gray-900"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={editingItem.image || ''}
                  onChange={(e) => setEditingItem((prev: any) => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-blue-950 text-gray-900"
                />
              </div>
              
              <div className="flex gap-4 pt-6">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-blue-950 text-white py-3 px-6 rounded-lg hover:bg-blue-900 transition-colors font-medium"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
