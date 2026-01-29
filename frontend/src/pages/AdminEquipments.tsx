import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

type Props = any;

const AdminEquipments: React.FC<Props> = (props) => {
  const {
    navigate,
    equipments,
    searchQuery,
    setSearchQuery,
    newItemTitle,
    setNewItemTitle,
    newItemDesc,
    setNewItemDesc,
    newItemPrice,
    setNewItemPrice,
    newItemImage,
    setNewItemImage,
    addItem,
    handleEditItem,
    handleDeleteItem,
    updateItem,
    setItems,
  } = props;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter equipments
  const filteredEquipments = equipments.filter((item: any) => {
    const title = item.title;
    const desc = item.description || item.desc || '';
    const searchText = `${title} ${desc}`.toLowerCase();
    return searchText.includes(searchQuery.toLowerCase());
  });

  // Pagination logic
  const itemsPerPage = isMobile ? 4 : 8;
  const totalPages = Math.max(1, Math.ceil(filteredEquipments.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEquipments = filteredEquipments.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-blue-950 hover:bg-blue-950 hover:text-white font-medium transition-colors border-2 border-blue-950 px-4 py-2 rounded-xl"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Dashboard
        </button>
      </div>

      {/* <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-950">Manage Items</h2>
        <div className="flex items-center space-x-3">
          <button onClick={handleCreateBackup} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center space-x-2 shadow-lg" title="Create a complete backup of all items and bookings">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>
            <span>Backup</span>
          </button>
          <button onClick={handleRestoreBackup} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center space-x-2 shadow-lg" title="Restore items and bookings from a backup file">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            <span>Restore</span>
          </button>
          <button onClick={handleExportData} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center space-x-2 shadow-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span>Export Excel</span>
          </button>
        </div>
      </div> */}

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-xl shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-purple-700"><strong>Backup & Restore:</strong> Use <strong>"Backup"</strong> to download all system data. Use <strong>"Restore"</strong> to upload and restore from a backup file.</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-xl shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700"><strong>Data Persistence:</strong> Changes are saved to browser storage. Use <strong>"Export Excel"</strong> to download data for permanent backup.</p>
            </div>
          </div>
        </div>
      </div> */}

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8">
        <h3 className="text-xl font-bold text-blue-950 mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-950"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add New Item
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              placeholder="Enter item title"
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-all text-gray-900 placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Price (per day)
            </label>
            <input
              type="number"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(Number(e.target.value))}
              placeholder="Enter price"
              min="0"
              step="0.01"
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-all text-gray-900 placeholder-gray-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newItemDesc}
              onChange={(e) => setNewItemDesc(e.target.value)}
              placeholder="Enter item description"
              rows={2}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-all text-gray-900 placeholder-gray-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Image URL (optional)
            </label>
            <input
              type="url"
              value={newItemImage}
              onChange={(e) => setNewItemImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-all text-gray-900 placeholder-gray-400"
            />
          </div>
          <div className="md:col-span-2">
            <button
              onClick={() => addItem?.("equipment")}
              className="bg-blue-900 text-white px-6 py-3 rounded-xl hover:bg-blue-950 transition-colors font-semibold shadow-lg flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Equipment
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
        <div className="bg-blue-950 text-white px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Equipments</h3>
                <p className="text-blue-100 text-sm">
                  {equipments.length} items available
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search equipments by title or description..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-all text-gray-900 placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginatedEquipments
              .map((item: any, index: number) => {
                const available = item.available !== false;
                return (
                  <div
                    key={item.id || item._id || `equipment-${index}`}
                    className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 ${!available ? "opacity-60" : ""}`}
                  >
                    <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-20 h-20 text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                      {!available && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
                          <span className="bg-red-500 text-white text-sm px-4 py-2 rounded-full font-bold shadow-lg">
                            Under Maintenance
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4
                        className="text-lg font-bold text-gray-900 mb-1.5 truncate"
                        title={item.title}
                      >
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem] leading-snug">
                        {item.description || item.desc || 'No description'}
                      </p>
                      <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-gray-100">
                        <span className="text-2xl font-bold text-blue-950 tracking-tight">
                          ${item.pricePerDay}
                          <span className="text-sm font-medium text-gray-500">
                            /day
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2.5">
                        <button
                          onClick={async () => {
                            try {
                              const token =
                                localStorage.getItem("admin_token") || "";
                              const updated = await updateItem(token, item.id, {
                                available: !available,
                              });
                              setItems((prev: any) =>
                                prev.map((i: any) =>
                                  i.id === item.id
                                    ? { ...i, available: updated.available }
                                    : i,
                                ),
                              );
                              toast.success(
                                `Item marked as ${!available ? "available" : "unavailable"}`,
                              );
                            } catch (e: any) {
                              toast.error(
                                e.message || "Failed to update availability",
                              );
                            }
                          }}
                          className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${available ? "bg-green-100 text-green-700 hover:bg-green-200 hover:shadow-md" : "bg-red-100 text-red-700 hover:bg-red-200 hover:shadow-md"}`}
                        >
                          {available ? "✓ Available" : "✗ Unavailable"}
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="flex-1 bg-blue-900 text-white px-4 py-2.5 rounded-lg hover:bg-blue-950 transition-all text-sm font-semibold shadow-sm hover:shadow-md"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-all text-sm font-semibold shadow-sm hover:shadow-md"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {filteredEquipments.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">
                {searchQuery
                  ? `No equipment found matching "${searchQuery}"`
                  : "No equipment found"}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Add new equipment using the form above"}
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredEquipments.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-blue-100 text-blue-900 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-blue-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-blue-100 text-blue-900 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEquipments;
