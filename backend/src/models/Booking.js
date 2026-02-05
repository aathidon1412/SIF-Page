import mongoose from 'mongoose';

// Helper: Parse a date/time in DD/MM/YYYY HH:MM and return a Date or null
const parseDDMMYYYY_HHMM = (dateString, timeString) => {
  if (!dateString || !timeString) return null;
  const combined = `${dateString.trim()} ${timeString.trim()}`;
  const re = /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/;
  const m = combined.match(re);
  if (!m) return null;
  const [, dd, mm, yyyy, HH, MM] = m;
  const day = parseInt(dd, 10);
  const month = parseInt(mm, 10) - 1;
  const year = parseInt(yyyy, 10);
  const hour = parseInt(HH, 10);
  const minute = parseInt(MM, 10);
  const d = new Date(year, month, day, hour, minute, 0);
  if (
    d.getFullYear() !== year ||
    d.getMonth() !== month ||
    d.getDate() !== day ||
    d.getHours() !== hour ||
    d.getMinutes() !== minute
  ) {
    return null;
  }
  return d;
};

// Helper: Check if a Date is a weekday (Mon-Fri)
const isWeekdayDate = (date) => {
  const day = date.getDay();
  return day >= 1 && day <= 5;
};

// Helper: Check if time (in minutes) is within business hours (9:00 - 18:00)
const isWithinBusinessHours = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const total = hours * 60 + minutes;
  return total >= 9 * 60 && total <= 18 * 60;
};

const bookingSchema = new mongoose.Schema({
  userId: String,
  userEmail: String,
  userName: String,
  itemId: String,
  itemTitle: String,
  itemType: { type: String, enum: ['lab', 'equipment'] },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
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
    type: { type: String },
    sentAt: String,
    status: String,
    message: String
  }],
  
  // QR Code verification fields
  verificationToken: { type: String, unique: true, sparse: true },
  qrCodeData: String,
  tokenGeneratedAt: String,
  verifiedAt: String,
  verifiedBy: String,
  verificationCount: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now }
});

// Validation: ensure combined date+time strings are valid DD/MM/YYYY HH:MM,
// fall on weekdays (Mon-Fri), within 9:00-18:00, and that start < end.
bookingSchema.pre('save', function(next) {
  // Parse start and end date-times in DD/MM/YYYY HH:MM format
  const startDateTime = parseDDMMYYYY_HHMM(this.startDate, this.startTime);
  const endDateTime = parseDDMMYYYY_HHMM(this.endDate, this.endTime);

  if (!startDateTime || !endDateTime) {
    return next(new Error('Date and time must be in format DD/MM/YYYY HH:MM'));
  }

  // Weekday checks
  if (!isWeekdayDate(startDateTime)) {
    return next(new Error('Start date must be a weekday (Monday-Friday)'));
  }
  if (!isWeekdayDate(endDateTime)) {
    return next(new Error('End date must be a weekday (Monday-Friday)'));
  }

  // Business hours checks (both start and end must be within 9:00-18:00)
  if (!isWithinBusinessHours(startDateTime)) {
    return next(new Error('Start time must be between 09:00 and 18:00'));
  }
  if (!isWithinBusinessHours(endDateTime)) {
    return next(new Error('End time must be between 09:00 and 18:00'));
  }

  // Ensure start < end strictly
  if (endDateTime <= startDateTime) {
    return next(new Error('End date-time must be later than start date-time'));
  }

  // Ensure no weekend days in the entire date range
  const current = new Date(startDateTime);
  const endDayBoundary = new Date(endDateTime);
  while (current <= endDayBoundary) {
    if (!isWeekdayDate(current)) {
      return next(new Error('Booking range cannot include weekends. Only Monday-Friday bookings are allowed.'));
    }
    current.setDate(current.getDate() + 1);
  }

  next();
});

export const Booking = mongoose.model('Booking', bookingSchema);
