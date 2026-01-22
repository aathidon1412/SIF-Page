import React, { useState } from 'react';
// icons removed (not used in table view)
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
    setAdminNote,
    toast,
  } = props;

  const [localSelected, setLocalSelected] = useState<BookingRequest | null>(null);

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
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 min-w-[200px]">Name</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 min-w-[220px]">Equipment/Lab</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 min-w-[260px]">Time Slot</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 min-w-[160px]">Purpose</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 min-w-[220px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedRequests.map((request: BookingRequest) => {
                    const start = new Date(`${request.startDate}T${request.startTime || '00:00'}`);
                    const end = new Date(`${request.endDate}T${request.endTime || '00:00'}`);
                    const formatSlot = (d: Date) => d.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
                    return (
                      <tr key={request.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-5 align-top min-w-[200px]">
                          <div className="text-sm font-medium text-gray-900 break-words whitespace-normal">{request.userName}</div>
                          <div className="text-xs text-gray-500 break-words whitespace-normal">{request.userEmail}</div>
                        </td>
                        <td className="px-6 py-5 align-top min-w-[220px]">
                          <div className="text-sm font-medium text-blue-950 break-words whitespace-normal" title={request.itemTitle}>{request.itemTitle}</div>
                          <div className="text-xs text-gray-500">{request.itemType}</div>
                        </td>
                        <td className="px-6 py-5 align-top min-w-[260px] text-sm text-gray-700 whitespace-normal">
                          {formatSlot(start)} — {formatSlot(end)}
                        </td>
                        <td className="px-6 py-5 align-top min-w-[160px] text-sm text-gray-700 break-words whitespace-normal">{request.purpose || '—'}</td>
                        <td className="px-6 py-5 align-top min-w-[220px] text-sm">
                          <div className="flex items-center gap-2">
                            <button onClick={() => { setSelectedRequest(request); setLocalSelected(request); }} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-sm">View More</button>
                            {request.status === 'pending' && (
                              <>
                                <button onClick={() => { if (request.hasConflict && request.conflictingBookings) { const conflictCount = request.conflictingBookings.filter((c:any) => c.status === 'pending').length; if (conflictCount > 0 && !confirm(`⚠️ WARNING: Approving this booking will automatically DECLINE ${conflictCount} conflicting pending booking(s). Do you want to proceed?`)) return; } setSelectedRequest(request); handleBookingAction(request.id, 'approved'); }} className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm">Approve</button>
                                <button onClick={() => { setSelectedRequest(request); handleBookingAction(request.id, 'declined'); }} className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm">Reject</button>
                              </>
                            )}
                            {request.status === 'approved' && (
                              <button onClick={() => { const reason = window.prompt('Enter revocation reason (required):'); if (!reason || !reason.trim()) { toast.error('Revocation reason required'); return; } setAdminNote(reason); setSelectedRequest(request); handleBookingAction(request.id, 'declined'); }} className="px-3 py-1.5 bg-orange-600 text-white rounded-md text-sm">Revoke</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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

      {/* Detail modal */}
      {localSelected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => setLocalSelected(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-11/12 md:w-3/5 max-h-[90vh] overflow-y-auto z-10">
            <div className="p-6 border-b flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-blue-950">{localSelected.itemTitle}</h3>
                <p className="text-xs text-gray-500">{localSelected.itemType}</p>
              </div>
              <button onClick={() => setLocalSelected(null)} className="text-gray-400 hover:text-gray-600">Close</button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Requested By</p>
                  <p className="font-medium">{localSelected.userName} — <span className="text-xs text-gray-500">{localSelected.userEmail}</span></p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="font-medium capitalize">{localSelected.status}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time Slot</p>
                  <p className="font-medium">
                    {new Date(`${localSelected.startDate}T${localSelected.startTime || '00:00'}`).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                    {' '}—{' '}
                    {new Date(`${localSelected.endDate}T${localSelected.endTime || '00:00'}`).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Cost</p>
                  <p className="font-medium text-green-600">${localSelected.totalCost.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-500">Purpose</p>
                <p className="text-sm text-gray-700">{localSelected.purpose || '—'}</p>
              </div>

              {localSelected.hasConflict && localSelected.conflictingBookings && localSelected.conflictingBookings.length > 0 && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
                  <p className="text-xs font-semibold text-amber-900">Conflicts ({localSelected.conflictingBookings.length})</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t flex items-center gap-2 justify-end">
              <button onClick={() => setLocalSelected(null)} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Close</button>
              {localSelected.status === 'pending' && (
                <>
                  <button onClick={() => { if (localSelected.hasConflict && localSelected.conflictingBookings) { const conflictCount = localSelected.conflictingBookings.filter((c:any) => c.status === 'pending').length; if (conflictCount > 0 && !confirm(`⚠️ WARNING: Approving this booking will automatically DECLINE ${conflictCount} conflicting pending booking(s). Do you want to proceed?`)) return; } setSelectedRequest(localSelected); handleBookingAction(localSelected.id, 'approved'); setLocalSelected(null); }} className="px-4 py-2 rounded-lg bg-green-600 text-white">Approve</button>
                  <button onClick={() => { setSelectedRequest(localSelected); handleBookingAction(localSelected.id, 'declined'); setLocalSelected(null); }} className="px-4 py-2 rounded-lg bg-red-600 text-white">Reject</button>
                </>
              )}
              {localSelected.status === 'approved' && (
                <button onClick={() => { const reason = window.prompt('Enter revocation reason (required):'); if (!reason || !reason.trim()) { toast.error('Revocation reason required'); return; } setAdminNote(reason); setSelectedRequest(localSelected); handleBookingAction(localSelected.id, 'declined'); setLocalSelected(null); }} className="px-4 py-2 rounded-lg bg-orange-600 text-white">Revoke</button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBookings;
