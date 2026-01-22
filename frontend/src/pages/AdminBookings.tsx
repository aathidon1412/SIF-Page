import React from 'react';
import { FaEye, FaCheck, FaTimes, FaUndo } from 'react-icons/fa';
import type { BookingRequest } from '../types/booking';

type Props = any;

const AdminBookings: React.FC<Props> = (props) => {
  const {
    navigate,
    bookingRequests,
    filteredRequests,
    pagedRequests,
    currentPage,
    setCurrentPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterName,
    setFilterName,
    filterStartDate,
    setFilterStartDate,
    filterEndDate,
    setFilterEndDate,
    applyPreset,
    setSelectedRequest,
    handleBookingAction,
    getStatusColor,
    formatDateTime,
    formatDate,
    adminNote,
    setAdminNote,
    toast,
  } = props;

  return (
    <div>
      <button
        onClick={() => navigate('/admin')}
        className="mb-6 flex items-center gap-2 text-blue-950 hover:text-blue-700 font-medium transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </button>

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
              <p className="text-3xl font-bold text-yellow-600 mt-1">{bookingRequests.filter((r: BookingRequest) => r.status === 'pending').length}</p>
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
              <p className="text-3xl font-bold text-green-600 mt-1">{bookingRequests.filter((r: BookingRequest) => r.status === 'approved').length}</p>
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
              <p className="text-3xl font-bold text-red-600 mt-1">{bookingRequests.filter((r: BookingRequest) => r.status === 'declined').length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-950">Booking Requests</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Showing {filteredRequests.length} of {bookingRequests.length}</span>
        </div>
      </div>

      {/* Search & filters (keeps layout consistent) */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
        {/* Reuse same structure from Admin.tsx - props control state */}
        <h3 className="text-lg font-semibold text-blue-950 mb-4">Search & Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5 relative">
            <label className="block text-xs font-semibold text-blue-950 mb-2">Search</label>
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="User, email, item, type, status" className="w-full border-2 border-gray-200 text-blue-950 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all" />
            {searchTerm && (
              <button type="button" onClick={() => setSearchTerm('')} className="absolute right-2 top-9 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded">Clear</button>
            )}
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-blue-950 mb-2">Type</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full border-2 border-gray-200 text-blue-950 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all bg-white">
              <option value="all">All Types</option>
              <option value="lab">Labs</option>
              <option value="equipment">Equipment</option>
            </select>
          </div>
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-blue-950 mb-2">Name</label>
            <div className="relative">
              <input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="Lab/Equipment name" className="w-full border-2 border-gray-200 text-blue-950 rounded-xl px-4 py-2.5 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all" />
              {filterName && (<button type="button" onClick={() => setFilterName('')} className="absolute right-2 top-2.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded">Clear</button>)}
            </div>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-blue-950 mb-2">Start Date</label>
            <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} className="w-full border-2 border-gray-200 text-blue-950 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all" />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-blue-950 mb-2">End Date</label>
            <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} className="w-full border-2 border-gray-200 text-blue-950 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all" />
          </div>
          <div className="md:col-span-3 flex gap-2">
            <button type="button" onClick={() => { setFilterType('all'); setFilterName(''); setFilterStartDate(''); setFilterEndDate(''); setSearchTerm(''); }} className="flex-1 bg-gray-100 hover:bg-gray-200 text-blue-950 px-3 py-2.5 rounded-xl font-medium transition-colors">Clear All</button>
          </div>
          <div className="md:col-span-12 flex flex-wrap gap-2 mt-2 pt-4 border-t border-gray-100">
            <span className="text-xs font-semibold text-blue-950 self-center mr-2">Quick Filters:</span>
            <button type="button" onClick={() => applyPreset('pendingThisWeek')} className="px-3 py-1.5 text-sm rounded-lg bg-yellow-100 hover:bg-yellow-200 text-blue-950 border border-yellow-200 transition-colors">📋 Pending This Week</button>
            <button type="button" onClick={() => applyPreset('labsToday')} className="px-3 py-1.5 text-sm rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-950 border border-blue-200 transition-colors">🔬 Labs Today</button>
            <button type="button" onClick={() => applyPreset('equipmentToday')} className="px-3 py-1.5 text-sm rounded-lg bg-green-100 hover:bg-green-200 text-blue-950 border border-green-200 transition-colors">🛠️ Equipment Today</button>
          </div>
        </div>
      </div>

      {/* Main list and pagination */}
      {bookingRequests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <p className="text-gray-600 text-lg font-medium">No booking requests found</p>
          <p className="text-gray-400 text-sm mt-2">Booking requests will appear here once users submit them</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <p className="text-gray-600 text-lg font-medium">No booking requests match your search</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or clear them to see all requests</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {pagedRequests.map((request: BookingRequest) => (
              <div key={request.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className={`px-6 py-4 border-b ${request.status === 'approved' ? 'bg-green-50 border-green-100' : request.status === 'declined' ? 'bg-red-50 border-red-100' : 'bg-yellow-50 border-yellow-100'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(request.status)}`}>{request.status}</span>
                    <span className="text-xs font-medium text-gray-500">{request.itemType.toUpperCase()}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-blue-950 mb-2 truncate" title={request.itemTitle}>{request.itemTitle}</h3>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{request.userName}</p>
                        <p className="text-xs text-gray-500 truncate">{request.userEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <div className="flex-1 text-xs text-gray-700">
                        <div className="font-medium">{formatDateTime(request.startDate, request.startTime)}</div>
                        <div className="text-gray-500">to {formatDateTime(request.endDate, request.endTime)}</div>
                      </div>
                    </div>
                    {request.purpose && (<div className="flex items-start gap-2"><svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg><p className="text-xs text-gray-600 line-clamp-2 flex-1">{request.purpose}</p></div>)}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100"><span className="text-xs text-gray-500">Total Cost</span><span className="text-lg font-bold text-green-600">${request.totalCost.toFixed(2)}</span></div>
                    {request.hasConflict && request.conflictingBookings && request.conflictingBookings.length > 0 && (<div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg"><svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg><span className="text-xs font-medium text-amber-900">{request.conflictingBookings.length} conflict{request.conflictingBookings.length !== 1 ? 's' : ''}</span></div>)}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setSelectedRequest(request)} className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center justify-center gap-1" title="View details"><FaEye className="w-3.5 h-3.5" /><span>View</span></button>
                    {request.status === 'pending' && (<>
                      <button onClick={() => { if (request.hasConflict && request.conflictingBookings) { const conflictCount = request.conflictingBookings.filter((c:any) => c.status === 'pending').length; if (conflictCount > 0 && !confirm(`⚠️ WARNING: Approving this booking will automatically DECLINE ${conflictCount} conflicting pending booking(s). Do you want to proceed?`)) return; } setSelectedRequest(request); handleBookingAction(request.id, 'approved'); }} className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-1" title="Approve"><FaCheck className="w-3.5 h-3.5" /></button>
                      <button onClick={() => { setSelectedRequest(request); handleBookingAction(request.id, 'declined'); }} className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-1" title="Reject"><FaTimes className="w-3.5 h-3.5" /></button>
                    </>)}
                    {request.status === 'approved' && (<button onClick={() => { const reason = window.prompt('Enter revocation reason (required):'); if (!reason || !reason.trim()) { toast.error('Revocation reason required'); return; } setAdminNote(reason); setSelectedRequest(request); handleBookingAction(request.id, 'declined'); }} className="px-3 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-1" title="Revoke"><FaUndo className="w-3.5 h-3.5" /><span className="hidden sm:inline">Revoke</span></button>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl shadow-lg px-6 py-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Page <span className="font-bold text-blue-950">{currentPage}</span> of <span className="font-bold text-blue-950">{totalPages}</span></div>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage((p:number) => Math.max(1, p - 1))} disabled={currentPage === 1} className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>Previous</button>
                <button onClick={() => setCurrentPage((p:number) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>Next</button>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default AdminBookings;
