import React, { useState } from 'react';
import type { BookingFormData, BookingRequest } from '../types/booking';
import { createBooking } from '../services/api';
import { useAuth } from '../lib/auth';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (itemTitle: string) => void;
  item: {
    id: string;
    title?: string;
    name?: string;
    pricePerDay?: number;
    pricePerHour?: number;
  };
  itemType: 'lab' | 'equipment';
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onSuccess, item, itemType }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<BookingFormData>({
    startDate: '',
    endDate: '',
    startTime: itemType === 'lab' ? '' : undefined,
    endTime: itemType === 'lab' ? '' : undefined,
    purpose: '',
    contactInfo: user?.email || '',
    additionalNotes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateCost = (): number => {
    if (!formData.startDate || !formData.endDate) return 0;
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    if (itemType === 'equipment' && item.pricePerDay) {
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return days * item.pricePerDay;
    } else if (itemType === 'lab' && item.pricePerHour && formData.startTime && formData.endTime) {
      const startTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endTime = new Date(`${formData.endDate}T${formData.endTime}`);
      const hours = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
      return hours * item.pricePerHour;
    }
    
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    
    const bookingRequest: BookingRequest = {
      id: 'req_' + Date.now(),
      userId: user.email, // Using email as userId
      userEmail: user.email,
      userName: user.name,
      itemId: item.id,
      itemTitle: item.title || item.name || '',
      itemType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      purpose: formData.purpose,
      contactInfo: formData.contactInfo,
      additionalNotes: formData.additionalNotes,
      status: 'pending',
      totalCost: calculateCost(),
      submittedAt: new Date().toISOString(),
    };

    try {
      await createBooking(bookingRequest);
      if (onSuccess) {
        onSuccess(bookingRequest.itemTitle);
      } else {
        alert('Booking request submitted successfully! You will receive a confirmation email once reviewed.');
        onClose();
      }
      setFormData({
        startDate: '',
        endDate: '',
        startTime: itemType === 'lab' ? '' : undefined,
        endTime: itemType === 'lab' ? '' : undefined,
        purpose: '',
        contactInfo: user?.email || '',
        additionalNotes: ''
      });
    } catch (error) {
      alert('Error submitting booking request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const totalCost = calculateCost();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-950">
              Book {itemType === 'lab' ? 'Lab' : 'Equipment'}
            </h2>
            <button
              onClick={onClose}
              className="text-blue-950 hover:text-blue-800 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-950 mb-2">
              {item.title || item.name}
            </h3>
            <p className="text-sm text-blue-950">
              {itemType === 'equipment' 
                ? `$${item.pricePerDay?.toFixed(2)}/day` 
                : `$${item.pricePerHour}/hour`}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-950 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full border-2 border-blue-950 text-blue-950 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-950"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-950 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  required
                  className="w-full border-2 border-blue-950 text-blue-950 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-950"
                />
              </div>
            </div>

            {itemType === 'lab' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-950 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    required
                    className="w-full border-2 border-blue-950 text-blue-950 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-950"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-950 mb-1">
                    End Time *
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    required
                    className="w-full border-2 border-blue-950 text-blue-950 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-950"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-blue-950 mb-1">
                Purpose of Use *
              </label>
              <textarea
                value={formData.purpose}
                onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                placeholder="Describe how you plan to use this equipment/lab..."
                required
                rows={3}
                className="w-full border-2 border-blue-950 text-blue-950 placeholder-blue-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-950"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-950 mb-1">
                Contact Information *
              </label>
              <input
                type="email"
                value={formData.contactInfo}
                onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
                placeholder="your.email@example.com"
                required
                className="w-full border-2 border-blue-950 text-blue-950 placeholder-blue-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-950"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-950 mb-1">
                Additional Notes
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                placeholder="Any special requirements or additional information..."
                rows={2}
                className="w-full border-2 border-blue-950 text-blue-950 placeholder-blue-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-950"
              />
            </div>

            {totalCost > 0 && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-blue-950">Estimated Total Cost:</span>
                  <span className="text-2xl font-bold text-blue-950">${totalCost.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border-2 border-blue-950 rounded-lg text-blue-950 hover:bg-blue-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || totalCost === 0}
                className="flex-1 py-3 px-4 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;