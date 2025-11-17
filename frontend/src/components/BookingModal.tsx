import React, { useState } from 'react';
import type { BookingFormData, BookingRequest } from '../types/booking';
import { createBooking } from '../services/api';
import { useAuth } from '../lib/auth';
import TimePicker from './ui/TimePicker';
import { isWeekdayString, getMinAllowedDate } from '../lib/bookingValidation';

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
    startTime: itemType === 'lab' ? '09:00' : undefined,
    endTime: itemType === 'lab' ? '10:00' : undefined,
    purpose: '',
    contactInfo: user?.email || '',
    additionalNotes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

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

    // Clear previous validation errors
    setValidationError('');
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
        startTime: itemType === 'lab' ? '09:00' : undefined,
        endTime: itemType === 'lab' ? '10:00' : undefined,
        purpose: '',
        contactInfo: user?.email || '',
        additionalNotes: ''
      });
      setValidationError('');
    } catch (error: any) {
      // Display backend validation error
      const errorMessage = error.response?.data?.message || error.message || 'Error submitting booking request. Please try again.';
      setValidationError(errorMessage);
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
                ? `Rs: ${item.pricePerDay?.toFixed(2)}/day` 
                : `Rs: ${item.pricePerHour}/hour`}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Validation Error Message */}
            {validationError && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">{validationError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Business Hours Notice */}
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Booking Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM only
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-950 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    if (!newDate || isWeekdayString(newDate)) {
                      setFormData(prev => ({ ...prev, startDate: newDate }));
                      setValidationError('');
                    } else {
                      setValidationError('Bookings are only available Monday-Friday');
                    }
                  }}
                  min={getMinAllowedDate()}
                  required
                  className="w-full border-2 border-blue-950 text-blue-950 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-950"
                />
                <p className="text-xs text-gray-600 mt-1">Weekdays only</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-950 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    if (!newDate || isWeekdayString(newDate)) {
                      setFormData(prev => ({ ...prev, endDate: newDate }));
                      setValidationError('');
                    } else {
                      setValidationError('Bookings are only available Monday-Friday');
                    }
                  }}
                  min={formData.startDate || getMinAllowedDate()}
                  required
                  className="w-full border-2 border-blue-950 text-blue-950 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-950"
                />
                <p className="text-xs text-gray-600 mt-1">Weekdays only</p>
              </div>
            </div>

            {itemType === 'lab' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TimePicker
                  label="Start Time"
                  value={formData.startTime || '09:00'}
                  onChange={(value) => {
                    setFormData(prev => ({ ...prev, startTime: value }));
                    setValidationError('');
                  }}
                  required
                  minTime="09:00"
                  maxTime="18:00"
                />

                <TimePicker
                  label="End Time"
                  value={formData.endTime || '10:00'}
                  onChange={(value) => {
                    setFormData(prev => ({ ...prev, endTime: value }));
                    setValidationError('');
                  }}
                  required
                  minTime="09:00"
                  maxTime="18:00"
                />
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
                  <span className="text-2xl font-bold text-blue-950">Rs: {totalCost.toFixed(2)}</span>
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