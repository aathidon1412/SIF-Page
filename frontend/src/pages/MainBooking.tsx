import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { fetchItems, fetchBookings } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaCog, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import BookingModal from '../components/BookingModal';

const MainBooking: React.FC = () => {
  const { user, signOut, signInWithGoogle } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const equipments = items.filter(i => i.type === 'equipment');
  const labs = items.filter(i => i.type === 'lab');
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'labs' | 'equipment'>('labs');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [userBookingRequests, setUserBookingRequests] = useState<any[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState('');

  // Filter results based on active tab, search query, and availability
  const filteredResults = useMemo(() => {
    const q = query.toLowerCase();
    if (activeTab === 'equipment') {
      return equipments.filter((eq) => {
        const available = eq.available !== false;
        return available && (eq.title || '').toLowerCase().includes(q);
      });
    } else {
      return labs.filter((lab) => {
        const available = lab.available !== false;
        return available && (lab.title || lab.name || '').toLowerCase().includes(q);
      });
    }
  }, [query, activeTab, equipments, labs]);

  // Load items once
  useEffect(() => {
    async function loadItems() {
      try {
        const data = await fetchItems();
        const normalized = data.map((d: any) => ({ ...d, id: d._id || d.id }));
        setItems(normalized);
      } catch (e) {
        // silently ignore
      }
    }
    loadItems();
  }, []);

  // Load user's booking requests from backend
  useEffect(() => {
    if (!user) { setUserBookingRequests([]); return; }
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchBookings(user!.email);
        if (cancelled) return;
        const normalized = data.map((r: any) => ({ ...r, id: r._id || r.id }));
        const sorted = normalized.sort((a: any, b: any) => {
          const dateA = new Date(a.reviewedAt || a.submittedAt).getTime();
          const dateB = new Date(b.reviewedAt || b.submittedAt).getTime();
          return dateB - dateA;
        });
        setUserBookingRequests(sorted);
      } catch {
        setUserBookingRequests([]);
      }
    }
    load();
    const interval = setInterval(load, 7000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [user]);

  // Get notification count (pending + recently reviewed)
  const getNotificationCount = () => {
    const recentlyReviewed = userBookingRequests.filter(req => {
      if (!req.reviewedAt) return false;
      const reviewedDate = new Date(req.reviewedAt);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return reviewedDate > oneDayAgo;
    });
    
    const pending = userBookingRequests.filter(req => req.status === 'pending');
    return pending.length + recentlyReviewed.length;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <FaCheckCircle className="text-green-600" />;
      case 'declined': return <FaTimesCircle className="text-red-600" />;
      default: return <FaClock className="text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-50 border-green-500';
      case 'declined': return 'bg-red-50 border-red-500';
      default: return 'bg-yellow-50 border-yellow-500';
    }
  };

  const handleBookingSuccess = (itemTitle: string) => {
    setSuccessMessageText(`Your booking request for "${itemTitle}" has been submitted successfully!`);
    setShowSuccessMessage(true);
    setShowBookingModal(false);
    setSelectedItem(null);
    
    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  const handleCardClick = async (item: any) => {
    if (!user) {
      try {
        await signInWithGoogle();
      } catch (error) {
        // If sign-in fails, just return
        return;
      }
    }
    setSelectedItem(item);
    setShowBookingModal(true);
  };

  return (
    <div className="min-h-screen bg-yellow-50">
      {/* Header */}
      <div className="bg-blue-950 text-white px-10 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Booking Portal</h1>
          
          <div className="flex items-center gap-4">
            {user && (
              <button 
                className="relative hover:text-yellow-200 transition-colors" 
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <FaBell size={20} />
                {getNotificationCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1 min-w-[16px] h-4 flex items-center justify-center">
                    {getNotificationCount()}
                  </span>
                )}
              </button>
            )}
            
            {/* Admin Login Button */}
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 text-sm border border-yellow-200 rounded-lg bg-transparent text-yellow-200 hover:text-yellow-400 hover:border-yellow-400 px-3 py-2 transition-colors"
              title="Admin Panel"
            >
              <FaCog size={16} />
              Admin
            </button>
            
            {user ? (
              <div className="flex items-center gap-2">
                <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
                <div className="text-sm">{user.name}</div>
                <button
                  onClick={signOut}
                  className="text-md border border-yellow-200 rounded-sm bg-transparent text-yellow-200 hover:text-yellow-400 hover:border-yellow-400 px-4 py-2 transition-colors"
                  >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-2 bg-yellow-200 text-blue-950 px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors font-medium"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications Side Panel */}
      {showNotifications && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowNotifications(false)}
          />
          
          {/* Side Panel */}
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="px-6 pt-6 pb-0 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-blue-950">Notifications</h2>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              {/* Notification Items */}
              <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide">
                {userBookingRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No notifications at the moment.</p>
                    <p className="text-sm text-gray-400 mt-1">Your booking requests will appear here.</p>
                  </div>
                ) : (
                  userBookingRequests.map((request: any) => (
                    <div key={request.id} className={`p-4 border-l-4 rounded ${getStatusColor(request.status)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg flex items-center">{getStatusIcon(request.status)}</span>
                            <h3 className="font-semibold text-gray-800">
                              Booking Request {request.status === 'pending' ? 'Submitted' : 
                                request.status === 'approved' ? 'Approved' : 'Declined'}
                            </h3>
                          </div>
                          
                          <p className="text-sm text-gray-700 font-medium mb-1">
                            {request.itemTitle}
                          </p>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            {formatDate(request.startDate)} 
                            {request.startTime && ` at ${formatTime(request.startTime)}`}
                            {request.endDate !== request.startDate && ` - ${formatDate(request.endDate)}`}
                          </p>

                          {request.status !== 'pending' && request.adminNote && (
                            <div className="bg-white bg-opacity-50 p-2 rounded text-sm mt-2">
                              <strong>Admin Note:</strong>
                              <p className="text-gray-700 mt-1">{request.adminNote}</p>
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {request.reviewedAt ? 
                                `Reviewed ${formatDate(request.reviewedAt)}` : 
                                `Submitted ${formatDate(request.submittedAt)}`
                              }
                            </span>
                            <span className="text-sm font-bold text-gray-800">
                              {request.totalCost.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        
                        {request.status === 'pending' && (
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 ml-3"></div>
                        )}
                        {request.reviewedAt && new Date(request.reviewedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-3"></div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Action Buttons */}
              {userBookingRequests.length > 0 && (
                <div className="mt-auto pb-6 space-y-2">
                  <button 
                    onClick={() => {
                      // In backend mode, we simply clear local state view.
                      setUserBookingRequests([]);
                      
                    }}
                    className="w-full bg-blue-950 text-white py-2 px-4 rounded-lg hover:bg-blue-900 transition-colors"
                  >
                    Clear Notifications
                  </button>
                  <div className="text-center">
                    <span className="text-xs text-gray-500">
                      {userBookingRequests.filter(r => r.status === 'pending').length} pending • {' '}
                      {userBookingRequests.filter(r => r.status === 'approved').length} approved • {' '}
                      {userBookingRequests.filter(r => r.status === 'declined').length} declined
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {!user && (
          <div className="bg-blue-50 border-l-4 border-blue-950 p-6 mb-8 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-950" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Sign in to book equipment and labs</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>You can browse available equipment and labs below, but you'll need to sign in with Google to make bookings and view notifications.</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={signInWithGoogle}
                    className="inline-flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Search and Toggle Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <div className="relative w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-blue-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder={`Search ${activeTab === 'labs' ? 'laboratories' : 'equipment'}...`}
                className="w-full pl-12 pr-4 py-3 border-2 border-blue-950 text-blue-950 placeholder-blue-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 bg-white shadow-lg transition-all duration-200"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-600 hover:text-blue-800"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Toggle Button */}
            <div className="flex bg-blue-950 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('labs')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'labs'
                    ? 'bg-yellow-50 text-blue-950'
                    : 'text-white hover:bg-blue-900'
                }`}
              >
                Labs
              </button>
              <button
                onClick={() => setActiveTab('equipment')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'equipment'
                    ? 'bg-yellow-50 text-blue-950'
                    : 'text-white hover:bg-blue-900'
                }`}
              >
                Equipment
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-blue-950">
              Available {activeTab === 'labs' ? 'Labs' : 'Equipment'}
            </h2>
            <div className="flex items-center space-x-4">
              {query && (
                <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} for "{query}"
                </div>
              )}
              <div className="text-sm text-gray-500">
                {filteredResults.length} {activeTab === 'labs' ? 'lab' : 'equipment'}{filteredResults.length !== 1 ? 's' : ''} available
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'equipment' ? (
              // Equipment Cards
              filteredResults.map((eq: any) => {
                const available = eq.available !== false;
                return (
                  <article 
                    key={eq.id} 
                    className={`bg-white rounded-2xl shadow-lg p-4 border transition-all duration-300 group ${available ? 'hover:shadow-2xl hover:scale-105 cursor-pointer' : 'opacity-60 grayscale cursor-not-allowed'}`}
                    onClick={() => available && handleCardClick(eq)}
                  >
                    <div className="relative rounded-lg overflow-hidden h-44 mb-4">
                      <img src={eq.image} alt={eq.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      <span className="absolute top-3 left-3 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">EQUIPMENT</span>
                      {available ? (
                        <span className="absolute top-3 right-3 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaCheckCircle size={10} /> Available</span>
                      ) : (
                        <span className="absolute top-3 right-3 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaTimesCircle size={10} /> Unavailable</span>
                      )}
                      {available && (
                        <div className="absolute inset-0 bg-blue-950 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <p className="text-sm font-medium">Click to Book</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-blue-950 mb-1 group-hover:text-blue-800 transition-colors">{eq.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{eq.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-blue-950">Rs: {eq.pricePerDay.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">/ day</div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (available) handleCardClick(eq);
                        }}
                        className={`px-4 py-2 rounded-lg transition-colors shadow-lg text-white font-medium ${available ? 'bg-blue-950 hover:bg-blue-900 hover:shadow-xl transform hover:-translate-y-1' : 'bg-gray-300 cursor-not-allowed'}`}
                        disabled={!available}
                      >
                        Book Now
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              // Lab Cards
              filteredResults.map((lab: any) => {
                const available = lab.available !== false;
                return (
                  <article 
                    key={lab.id} 
                    className={`bg-white rounded-2xl shadow-lg p-4 border transition-all duration-300 group ${available ? 'hover:shadow-2xl hover:scale-105 cursor-pointer' : 'opacity-60 grayscale cursor-not-allowed'}`}
                    onClick={() => available && handleCardClick(lab)}
                  >
                    <div className="relative rounded-lg overflow-hidden h-44 mb-4">
                      <img src={lab.image} alt={lab.title || lab.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      <span className="absolute top-3 left-3 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">LAB</span>
                      {available ? (
                        <span className="absolute top-3 right-3 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaCheckCircle size={10} /> Available</span>
                      ) : (
                        <span className="absolute top-3 right-3 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"><FaTimesCircle size={10} /> Unavailable</span>
                      )}
                      {available && (
                        <div className="absolute inset-0 bg-blue-950 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <p className="text-sm font-medium">Click to Book</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-blue-950 mb-1 group-hover:text-blue-800 transition-colors">{lab.title || lab.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{lab.desc}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-blue-950">Rs: {lab.pricePerHour.toFixed(0)}</div>
                        <div className="text-xs text-gray-500">/ hour · Capacity {lab.capacity}</div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (available) handleCardClick(lab);
                        }}
                        className={`px-4 py-2 rounded-lg transition-colors shadow-lg text-white font-medium ${available ? 'bg-blue-950 hover:bg-blue-900 hover:shadow-xl transform hover:-translate-y-1' : 'bg-gray-300 cursor-not-allowed'}`}
                        disabled={!available}
                      >
                        Book Lab
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {/* No Results Message */}
          {filteredResults.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No {activeTab} found
                </h3>
                <p className="text-gray-600 mb-4">
                  {query ? (
                    <>No {activeTab} match your search for "{query}". Try different keywords or browse all available options.</>
                  ) : (
                    <>No {activeTab} are currently available. Please check back later.</>
                  )}
                </p>
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="bg-blue-950 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedItem && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedItem(null);
          }}
          onSuccess={handleBookingSuccess}
          item={selectedItem}
          itemType={activeTab === 'labs' ? 'lab' : 'equipment'}
        />
      )}

      {/* Success Message Popup */}
      {showSuccessMessage && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            {/* Success Modal */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
              <div className="text-center">
                {/* Success Icon */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                {/* Success Title */}
                <h3 className="text-2xl font-bold text-blue-950 mb-3">
                  Booking Submitted!
                </h3>
                
                {/* Success Message */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {successMessageText}
                </p>
                
                {/* Additional Info */}
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>What happens next?</strong><br />
                    Our admin team will review your request and send you a confirmation email within 24 hours.
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => setShowSuccessMessage(false)}
                    className="w-full bg-blue-950 text-white py-3 px-6 rounded-xl hover:bg-blue-900 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    Continue Browsing
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowSuccessMessage(false);
                      setShowNotifications(true);
                    }}
                    className="w-full border-2 border-blue-950 text-blue-950 py-3 px-6 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium"
                  >
                    View Notifications
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MainBooking;
