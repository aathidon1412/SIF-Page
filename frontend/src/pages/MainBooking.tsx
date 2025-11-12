import React, { useMemo, useState } from 'react';
import { useAuth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaCog } from 'react-icons/fa';
import { SAMPLE_EQUIPMENTS, SAMPLE_LABS } from '../lib/data';
import BookingModal from '../components/BookingModal';

const MainBooking: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'labs' | 'equipment'>('labs');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [userBookingRequests, setUserBookingRequests] = useState<any[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState('');

  // Filter results based on active tab and search query
  const filteredResults = useMemo(() => {
    if (activeTab === 'equipment') {
      return SAMPLE_EQUIPMENTS.filter((eq) => 
        eq.title.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      return SAMPLE_LABS.filter((lab) => 
        lab.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  }, [query, activeTab]);

  // Load user's booking requests
  React.useEffect(() => {
    if (user) {
      const loadUserBookings = () => {
        try {
          const allRequests = JSON.parse(localStorage.getItem('booking_requests') || '[]');
          const userRequests = allRequests
            .filter((req: any) => req.userEmail === user.email)
            .sort((a: any, b: any) => {
              // Sort by most recent activity (reviewedAt or submittedAt)
              const dateA = new Date(a.reviewedAt || a.submittedAt).getTime();
              const dateB = new Date(b.reviewedAt || b.submittedAt).getTime();
              return dateB - dateA; // Most recent first
            });
          setUserBookingRequests(userRequests);
        } catch {
          setUserBookingRequests([]);
        }
      };
      
      loadUserBookings();
      
      // Set up interval to check for updates every 5 seconds
      const interval = setInterval(loadUserBookings, 5000);
      
      return () => clearInterval(interval);
    }
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
      case 'approved': return '✅';
      case 'declined': return '❌';
      default: return '⏳';
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

  if (!user) return null; // should be protected route

  return (
    <div className="min-h-screen bg-yellow-50">
      {/* Header */}
      <div className="bg-blue-950 text-white px-10 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Booking Portal</h1>
          
          <div className="flex items-center gap-4">
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
            
            {/* Admin Login Button */}
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 text-sm border border-yellow-200 rounded-lg bg-transparent text-yellow-200 hover:text-yellow-400 hover:border-yellow-400 px-3 py-2 transition-colors"
              title="Admin Panel"
            >
              <FaCog size={16} />
              Admin
            </button>
            
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
                            <span className="text-lg">{getStatusIcon(request.status)}</span>
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
                              ${request.totalCost.toFixed(2)}
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
                      // Mark all as read (remove notification dots)
                      setShowNotifications(false);
                    }}
                    className="w-full bg-blue-950 text-white py-2 px-4 rounded-lg hover:bg-blue-900 transition-colors"
                  >
                    Close Notifications
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
              filteredResults.map((eq: any) => (
                <article 
                  key={eq.id} 
                  className="bg-white rounded-2xl shadow-lg p-4 border hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group"
                  onClick={() => {
                    setSelectedItem(eq);
                    setShowBookingModal(true);
                  }}
                >
                  <div className="relative rounded-lg overflow-hidden h-44 mb-4">
                    <img src={eq.image} alt={eq.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <span className="absolute top-3 left-3 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">EQUIPMENT</span>
                    <span className="absolute top-3 right-3 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">● Available</span>
                    <div className="absolute inset-0 bg-blue-950 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <p className="text-sm font-medium">Click to Book</p>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-950 mb-1 group-hover:text-blue-800 transition-colors">{eq.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{eq.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-950">${eq.pricePerDay.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">/ day</div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(eq);
                        setShowBookingModal(true);
                      }}
                      className="bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      Book Now
                    </button>
                  </div>
                </article>
              ))
            ) : (
              // Lab Cards
              filteredResults.map((lab: any) => (
                <article 
                  key={lab.id} 
                  className="bg-white rounded-2xl shadow-lg p-4 border hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group"
                  onClick={() => {
                    setSelectedItem(lab);
                    setShowBookingModal(true);
                  }}
                >
                  <div className="relative rounded-lg overflow-hidden h-44 mb-4">
                    <img src={lab.image} alt={lab.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <span className="absolute top-3 left-3 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">LAB</span>
                    <span className="absolute top-3 right-3 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">● Available</span>
                    <div className="absolute inset-0 bg-blue-950 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <p className="text-sm font-medium">Click to Book</p>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-950 mb-1 group-hover:text-blue-800 transition-colors">{lab.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{lab.desc}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-950">${lab.pricePerHour.toFixed(0)}</div>
                      <div className="text-xs text-gray-500">/ hour · Capacity {lab.capacity}</div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(lab);
                        setShowBookingModal(true);
                      }}
                      className="bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      Book Lab
                    </button>
                  </div>
                </article>
              ))
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
