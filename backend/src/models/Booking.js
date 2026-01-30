import mongoose from 'mongoose';

// Helper: Check if date is a weekday
const isWeekday = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDay();
  return day >= 1 && day <= 5;
};

// Helper: Check if time is within business hours (9 AM - 6 PM)
const isBusinessHours = (timeString) => {
  if (!timeString) return true; // Optional field
  const [hours, minutes] = timeString.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  return totalMinutes >= 9 * 60 && totalMinutes <= 18 * 60;
};

const bookingSchema = new mongoose.Schema({
  userId: String,
  userEmail: String,
  userName: String,
  itemId: String,
  itemTitle: String,
  itemType: { type: String, enum: ['lab', 'equipment'] },
  startDate: { 
    type: String,
    required: true,
    validate: {
      validator: isWeekday,
      message: 'Start date must be a weekday (Monday-Friday)'
    }
  },
  endDate: { 
    type: String,
    required: true,
    validate: {
      validator: isWeekday,
      message: 'End date must be a weekday (Monday-Friday)'
    }
  },
  startTime: {
    type: String,
    validate: {
      validator: isBusinessHours,
      message: 'Start time must be between 9:00 AM and 6:00 PM'
    }
  },
  endTime: {
    type: String,
    validate: {
      validator: isBusinessHours,
      message: 'End time must be between 9:00 AM and 6:00 PM'
    }
  },
  purpose: String,
  contactInfo: String,
  additionalNotes: String,
  status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },
  adminNote: String,
  totalCost: Number,
  submittedAt: { type: String },
  reviewedAt: String,
  
  // Conflict detection fields
  hasConflict: { type: Boolean, default: false },
  conflictingBookings: [{
    bookingId: mongoose.Schema.Types.ObjectId,
    userEmail: String,
    userName: String,
    status: String,
    startDate: String,
    endDate: String,
    startTime: String,
    endTime: String,
    conflictType: String,
    itemTitle: String
  }],
  
  // Status change tracking
  previousStatus: String,
  wasApprovedBefore: { type: Boolean, default: false },
  declinedAfterApproval: { type: Boolean, default: false },
  
  // Notification tracking
  notificationSent: { type: Boolean, default: false },
  lastNotificationAt: String,
  notificationHistory: [{
    type: String,
    sentAt: String,
    status: String,
    message: String
  }],
  
  createdAt: { type: Date, default: Date.now }
});

// Additional validation to ensure date range doesn't span weekends
bookingSchema.pre('save', function(next) {
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);
  
  // Check all dates in range are weekdays
  const current = new Date(start);
  while (current <= end) {
    const day = current.getDay();
    if (day === 0 || day === 6) {
      return next(new Error('Booking range cannot include weekends. Only Monday-Friday bookings are allowed.'));
    }
    current.setDate(current.getDate() + 1);
  }
  
  // Validate time range for lab bookings
  if (this.itemType === 'lab' && this.startTime && this.endTime) {
    // Validate complete date-time combination
    const startDateTime = new Date(`${this.startDate}T${this.startTime}:00`);
    const endDateTime = new Date(`${this.endDate}T${this.endTime}:00`);
    
    // Check date-time validity
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      return next(new Error('Invalid date or time format'));
    }
    
    // Critical: Check end date-time is after start date-time
    if (endDateTime <= startDateTime) {
      if (this.startDate === this.endDate) {
        return next(new Error('End time must be after start time on the same date'));
      } else {
        return next(new Error('End date-time must be after start date-time'));
      }
    }
    
    // Validate business hours (9 AM - 6 PM)
    const [startHours, startMinutes] = this.startTime.split(':').map(Number);
    const [endHours, endMinutes] = this.endTime.split(':').map(Number);
    
    const startTotal = startHours * 60 + startMinutes;
    const endTotal = endHours * 60 + endMinutes;
    const businessStart = 9 * 60;
    const businessEnd = 18 * 60;
    
    if (startTotal < businessStart || startTotal > businessEnd) {
      return next(new Error('Start time must be between 9:00 AM and 6:00 PM'));
    }
    if (endTotal < businessStart || endTotal > businessEnd) {
      return next(new Error('End time must be between 9:00 AM and 6:00 PM'));
    }
    
    // Check minimum duration (1 hour)
    const durationMs = endDateTime.getTime() - startDateTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    
    if (durationHours < 1) {
      return next(new Error('Minimum booking duration is 1 hour'));
    }
    
    // Check maximum single-day duration (9 hours)
    if (this.startDate === this.endDate && durationHours > 9) {
      return next(new Error('Maximum booking duration per day is 9 hours'));
    }
  }
  
  // For equipment bookings, validate date order
  if (this.itemType === 'equipment') {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    
    if (end < start) {
      return next(new Error('End date cannot be before start date'));
    }
  }
  
  next();
});

export const Booking = mongoose.model('Booking', bookingSchema);
