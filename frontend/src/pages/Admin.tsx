import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { BookingRequest } from '../types/booking';
import { toast } from 'react-hot-toast';
import { adminLogin, fetchBookings, updateBookingStatus, fetchItems, createItem, deleteItem, updateItem, createBackup, restoreBackup, verifyBackup } from '../services/api';
import AdminBookings from './AdminBookings';
import AdminEquipments from './AdminEquipments';
import AdminLabs from './AdminLabs';
import { exportToExcel } from '../lib/exportExcel';

// Backend API handles admin credentials (seeded); env fallback removed.

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Items managed via backend API instead of local context
  const [items, setItems] = useState<any[]>([]);
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemType, setNewItemType] = useState<'lab' | 'equipment'>('equipment');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState<number>(0);
  const [newItemCapacity, setNewItemCapacity] = useState('');
  const [newItemImage, setNewItemImage] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Separate items by type
  const equipments = items.filter(i => i.type === 'equipment');
  const labs = items.filter(i => i.type === 'lab');
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
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
    if (auth) {
      loadBookings();
    }
  }, [auth]);

  async function loadBookings() {
    try {
      const data = await fetchBookings();
      const normalized = data.map((b: any) => ({ ...b, id: b.id || b._id }));
      const sorted = normalized.sort((a: BookingRequest, b: BookingRequest) => {
        const dateA = new Date(a.reviewedAt || a.submittedAt).getTime();
        const dateB = new Date(b.reviewedAt || b.submittedAt).getTime();
        return dateB - dateA;
      });
      setBookingRequests(sorted);
    } catch {
      toast.error('Failed to load bookings');
    }
  }

  // Auto-refresh bookings every 10 seconds for real-time updates
  useEffect(() => {
    if (!auth) return;
    
    const interval = setInterval(() => {
      loadBookings();
    }, 10000); // 10 seconds
    
    return () => clearInterval(interval);
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

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await adminLogin(user, pass);
      localStorage.setItem('admin_token', token);
      setAuth(true);
      toast.success('Admin login successful');
      const newLogs = [
        ...adminLogs,
        { type: 'login' as const, timestamp: new Date().toISOString() }
      ];
      setAdminLogs(newLogs);
    } catch {
      toast.error('Invalid credentials');
    }
  };

  const addItem = async () => {
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

    try {
      const token = localStorage.getItem('admin_token') || '';
      const created = await createItem(token, itemData);
      setItems(prev => [created, ...prev]);
      toast.success(`${newItemType} added successfully`);
    } catch (e:any) {
      toast.error(e.message || 'Failed to add item');
      return;
    }
    
    // Reset form
    setNewItemTitle('');
    setNewItemDesc('');
    setNewItemPrice(0);
    setNewItemCapacity('');
    setNewItemImage('');
    
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
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
    
    try {
      const token = localStorage.getItem('admin_token') || '';
      const updated = await updateItem(token, editingItem.id, updates);
      setItems(prev => prev.map(i => i._id === editingItem.id || i.id === editingItem.id ? updated : i));
      setShowEditModal(false);
      setEditingItem(null);
      toast.success('Item updated successfully');
    } catch (e:any) {
      toast.error(e.message || 'Failed to update item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Delete this item permanently?')) return;
    try {
      const token = localStorage.getItem('admin_token') || '';
      await deleteItem(token, id);
      setItems(prev => prev.filter(i => i._id !== id && i.id !== id));
      toast.success('Item deleted successfully');
    } catch (e:any) {
      toast.error(e.message || 'Failed to delete item');
    }
  };

  const handleExportData = () => {
    try {
      exportToExcel(items, bookingRequests);
      toast.success('Excel exported successfully');
    } catch {
      toast.error('Failed to export Excel');
    }
  };

  const handleCreateBackup = async () => {
    if (!window.confirm('Create a backup of all system data (items and bookings)? This will download a JSON file to your computer.')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('admin_token') || '';
      const backupData = await createBackup(token);
      
      // Download backup as JSON file
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${backupData.timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Backup created successfully! ${backupData.stats.totalItems} items, ${backupData.stats.totalBookings} bookings`);
    } catch (error: any) {
      console.error('Backup failed:', error);
      toast.error(error.message || 'Failed to create backup');
    }
  };

  const handleRestoreBackup = async () => {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const backupData = JSON.parse(text);
        
        // Verify backup first
        const token = localStorage.getItem('admin_token') || '';
        const verification = await verifyBackup(token, backupData);
        
        if (!verification.valid) {
          toast.error(`Invalid backup file: ${verification.errors.join(', ')}`);
          return;
        }
        
        // Show warnings if any
        if (verification.warnings && verification.warnings.length > 0) {
          const warningMsg = verification.warnings.join('\n');
          if (!window.confirm(`Backup has warnings:\n${warningMsg}\n\nContinue with restore?`)) {
            return;
          }
        }
        
        // Confirm restore action
        const confirmMsg = `⚠️ WARNING: This will REPLACE ALL existing data!\n\n` +
          `Backup contains:\n` +
          `- ${verification.stats.totalItems} items (${verification.stats.labs} labs, ${verification.stats.equipment} equipment)\n` +
          `- ${verification.stats.totalBookings} bookings (${verification.stats.pendingBookings} pending, ${verification.stats.approvedBookings} approved, ${verification.stats.declinedBookings} declined)\n\n` +
          `Current data will be PERMANENTLY DELETED.\n\n` +
          `Are you absolutely sure you want to proceed?`;
        
        if (!window.confirm(confirmMsg)) {
          return;
        }
        
        // Double confirmation
        if (!window.confirm('This is your FINAL confirmation. Restore backup and delete all current data?')) {
          return;
        }
        
        // Perform restore
        const result = await restoreBackup(token, backupData);
        
        // Show warnings if any
        if (result.warnings && result.warnings.length > 0) {
          console.warn('Restore warnings:', result.warnings);
        }
        
        toast.success(`Restore successful! ${result.restored.items} items, ${result.restored.bookings} bookings restored`);
        
        // Reload data
        await loadBookings();
        const itemData = await fetchItems();
        const normalizedItems = itemData.map((d: any) => ({ ...d, id: d._id || d.id }));
        setItems(normalizedItems);
        
      } catch (error: any) {
        console.error('Restore failed:', error);
        toast.error(error.message || 'Failed to restore backup');
      }
    };
    
    input.click();
  };
  
  // Load items when authenticated
  useEffect(() => {
    async function load() {
      if (!auth) return;
      try {
        const data = await fetchItems();
        // Normalize id for React keys
        const normalized = data.map((d: any) => ({ ...d, id: d._id || d.id }));
        setItems(normalized);
      } catch {
        toast.error('Failed to load items');
      }
    }
    load();
  }, [auth]);

  const handleBookingAction = async (requestId: string, action: 'approved' | 'declined') => {
    // Validate request exists and is actionable
    const target = bookingRequests.find(r => r.id === requestId);
    if (!target) {
      toast.error('Request not found');
      return;
    }
    
    // Allow declining approved bookings (revocation)
    const isRevocation = target.status === 'approved' && action === 'declined';
    
    // Only require admin note for status changes (optional for initial approval)
    if (isRevocation && !adminNote.trim()) {
      const confirmed = confirm('You are about to REVOKE a previously approved booking. This will notify the user immediately. Please add a reason in the admin note field before proceeding.');
      if (!confirmed) {
        return;
      }
      toast.error('Please add a revocation reason in the admin note before proceeding');
      return;
    }
    try {
      const token = localStorage.getItem('admin_token') || '';
      const updated = await updateBookingStatus(token, requestId, action, adminNote);
      const next = bookingRequests.map(r => r.id === requestId ? { ...r, ...updated } : r);
      const sortedRequests = next.sort((a, b) => {
        const dateA = new Date(a.reviewedAt || a.submittedAt).getTime();
        const dateB = new Date(b.reviewedAt || b.submittedAt).getTime();
        return dateB - dateA;
      });
      setBookingRequests(sortedRequests);
      setSelectedRequest(null);
      setAdminNote('');
      toast[action === 'approved' ? 'success' : 'error'](`Booking request ${action}`);
    } catch {
      toast.error('Failed to update booking');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDateTime = (dateString: string, timeString?: string) => {
    try {
      const timePart = timeString || '00:00';
      const dt = new Date(`${dateString}T${timePart}`);
      return dt.toLocaleString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return dateString;
    }
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

  // Pagination for requests (8 per page)
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / itemsPerPage));
  const pagedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to first page when filters/search change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredRequests.length, searchTerm, filterType, filterName, filterStartDate, filterEndDate]);

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
      {/* Compact Header */}
      <div className="bg-blue-950 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/main-booking')}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 border border-white border-opacity-30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Booking</span>
              </button>
              <button 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors font-medium shadow-lg flex items-center space-x-2" 
                onClick={() => { 
                  setAuth(false); 
                  toast.success('Logged out');
                  localStorage.removeItem('admin_token');
                  const newLogs = [
                    ...adminLogs,
                    { type: 'logout' as const, timestamp: new Date().toISOString() }
                  ];
                  setAdminLogs(newLogs);
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
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-950 to-blue-900 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome, Administrator</h2>
              <p className="text-blue-100 text-lg">SIF-FAB LAB Management Portal</p>
              <p className="text-blue-200 text-sm mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-yellow-400 bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Render content based on route */}
        {currentPath === '/admin' ? (
          /* Main Dashboard - Card Navigation */
          <>
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Requests</p>
                    <p className="text-3xl font-bold text-blue-950 mt-1">{bookingRequests.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-1">{bookingRequests.filter(r => r.status === 'pending').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">{bookingRequests.filter(r => r.status === 'approved').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Declined</p>
                    <p className="text-3xl font-bold text-red-600 mt-1">{bookingRequests.filter(r => r.status === 'declined').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Cards */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-blue-950 mb-6">Management Sections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Booking Requests Card */}
                <div
                  onClick={() => navigate('/admin/bookings')}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-200 hover:border-blue-600 transform hover:-translate-y-1 text-left group cursor-pointer"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Booking Requests</h3>
                    <p className="text-blue-100 text-xs">Review and manage bookings</p>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total</span>
                      <span className="font-bold text-blue-950">{bookingRequests.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Pending</span>
                      <span className="font-bold text-yellow-600">{bookingRequests.filter(r => r.status === 'pending').length}</span>
                    </div>
                    <div className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                      <span>Manage Bookings</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Equipment Management Card */}
                <div
                  onClick={() => navigate('/admin/equipments')}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-200 hover:border-purple-600 transform hover:-translate-y-1 text-left group cursor-pointer"
                >
                  <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Equipment</h3>
                    <p className="text-purple-100 text-xs">Manage equipment inventory</p>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Items</span>
                      <span className="font-bold text-purple-700">{equipments.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Available</span>
                      <span className="font-bold text-green-600">{equipments.filter(i => i.available !== false).length}</span>
                    </div>
                    <div className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                      <span>Manage Equipment</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Lab Management Card */}
                <div
                  onClick={() => navigate('/admin/labs')}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-200 hover:border-green-600 transform hover:-translate-y-1 text-left group cursor-pointer"
                >
                  <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Lab Spaces</h3>
                    <p className="text-green-100 text-xs">Manage lab facilities</p>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Labs</span>
                      <span className="font-bold text-green-700">{labs.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Available</span>
                      <span className="font-bold text-green-600">{labs.filter(i => i.available !== false).length}</span>
                    </div>
                    <div className="w-full bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                      <span>Manage Labs</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Data Management Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200">
                  <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Data Management</h3>
                    <p className="text-gray-100 text-sm">Backup, restore, and export data</p>
                  </div>
                  <div className="p-6 space-y-3">
                    <button
                      onClick={handleCreateBackup}
                      className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                      Backup Data
                    </button>
                    <button
                      onClick={handleRestoreBackup}
                      className="w-full bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Restore Data
                    </button>
                    <button
                      onClick={handleExportData}
                      className="w-full bg-green-100 hover:bg-green-200 text-green-700 px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export Excel
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-xl shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-purple-700">
                      <strong>Quick Tip:</strong> Click on the cards above to navigate to different management sections.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-xl shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Data Persistence:</strong> All changes are automatically saved to the system.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : currentPath === '/admin/bookings' ? (
          <AdminBookings
            navigate={navigate}
            bookingRequests={bookingRequests}
            filteredRequests={filteredRequests}
            pagedRequests={pagedRequests}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            filterName={filterName}
            setFilterName={setFilterName}
            filterStartDate={filterStartDate}
            setFilterStartDate={setFilterStartDate}
            filterEndDate={filterEndDate}
            setFilterEndDate={setFilterEndDate}
            applyPreset={applyPreset}
            setSelectedRequest={setSelectedRequest}
            handleBookingAction={handleBookingAction}
            getStatusColor={getStatusColor}
            formatDateTime={formatDateTime}
            formatDate={formatDate}
            adminNote={adminNote}
            setAdminNote={setAdminNote}
            toast={toast}
          />
        ) : currentPath === '/admin/equipments' ? (
          <AdminEquipments
            navigate={navigate}
            handleCreateBackup={handleCreateBackup}
            handleRestoreBackup={handleRestoreBackup}
            handleExportData={handleExportData}
            equipments={equipments}
            labs={labs}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            newItemType={newItemType}
            setNewItemType={setNewItemType}
            newItemTitle={newItemTitle}
            setNewItemTitle={setNewItemTitle}
            newItemDesc={newItemDesc}
            setNewItemDesc={setNewItemDesc}
            newItemPrice={newItemPrice}
            setNewItemPrice={setNewItemPrice}
            newItemCapacity={newItemCapacity}
            setNewItemCapacity={setNewItemCapacity}
            newItemImage={newItemImage}
            setNewItemImage={setNewItemImage}
            addItem={addItem}
            handleEditItem={handleEditItem}
            handleDeleteItem={handleDeleteItem}
            updateItem={updateItem}
            items={items}
            setItems={setItems}
          />
        ) : currentPath === '/admin/labs' ? (
          <AdminLabs
            navigate={navigate}
            labs={labs}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleEditItem={handleEditItem}
            handleDeleteItem={handleDeleteItem}
            updateItem={updateItem}
            setItems={setItems}
          />
        ) : null}
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
