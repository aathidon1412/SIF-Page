import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['lab', 'equipment'], required: true },
  desc: String,
  pricePerDay: Number,
  pricePerHour: Number,
  capacity: String,
  image: String,
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const Item = mongoose.model('Item', itemSchema);
