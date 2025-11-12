import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BookingRequest } from '../types/booking';

type Item = { id: string; title: string; type: 'lab' | 'equipment'; desc?: string };

const ADMIN_USER = import.meta.env.VITE_ADMIN_USER || 'thiganth';
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || 'thiganth';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [activeTab, setActiveTab] = useState<'items' | 'bookings'>('bookings');
  const [items, setItems] = useState<Item[]>(() => {
    try {
      const raw = localStorage.getItem('admin_items');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
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

  useEffect(() => {
    localStorage.setItem('admin_items', JSON.stringify(items));
  }, [items]);

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

  const handleBookingAction = (requestId: string, action: 'approved' | 'declined') => {
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
    alert(`Booking request ${action}. User will be notified via email.`);
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
                onClick={() => setAuth(false)}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                {items.length}
              </span>
            </button>
          </div>
        </div>

        {activeTab === 'bookings' ? (
          /* Booking Requests Tab */
          <div>
            <h2 className="text-2xl font-semibold text-blue-950 mb-6">Booking Requests</h2>
            
            {bookingRequests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600 text-lg">No booking requests found.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {bookingRequests.map((request) => (
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
                                    📅 Reviewed: {formatDate(request.reviewedAt)}
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
                className="bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors" 
                onClick={addItem}
              >
                Add Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((it) => (
                <div key={it.id} className="bg-white rounded-2xl shadow-lg p-6 border">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900">{it.title}</h3>
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mt-2">
                        {it.type.toUpperCase()}
                      </span>
                      {it.desc && (
                        <p className="text-sm text-gray-600 mt-2">{it.desc}</p>
                      )}
                    </div>
                    <button 
                      className="ml-4 text-red-500 hover:text-red-700 px-3 py-1 border border-red-500 rounded-lg hover:bg-red-50 transition-colors" 
                      onClick={() => removeItem(it.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              
              {items.length === 0 && (
                <div className="col-span-2 text-center py-12 bg-white rounded-lg">
                  <p className="text-gray-600 text-lg">No items found. Add some items to get started.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
