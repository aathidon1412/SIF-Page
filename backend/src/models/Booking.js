import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: String,
  userEmail: String,
  userName: String,
  itemId: String,
  itemTitle: String,
  itemType: { type: String, enum: ['lab', 'equipment'] },
  startDate: String,
  endDate: String,
  startTime: String,
  endTime: String,
  purpose: String,
  contactInfo: String,
  additionalNotes: String,
  status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },
  adminNote: String,
  totalCost: Number,
  submittedAt: { type: String },
  reviewedAt: String,
  createdAt: { type: Date, default: Date.now }
});

export const Booking = mongoose.model('Booking', bookingSchema);
