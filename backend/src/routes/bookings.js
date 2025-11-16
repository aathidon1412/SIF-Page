import express from 'express';
import { Booking } from '../models/Booking.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// List all bookings (admin) or filter by userEmail query param
router.get('/', async (req, res) => {
  const { userEmail } = req.query;
  const filter = userEmail ? { userEmail } : {};
  const bookings = await Booking.find(filter).sort({ reviewedAt: -1, submittedAt: -1 });
  res.json(bookings);
});

// Create booking
router.post('/', async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, submittedAt: new Date().toISOString(), status: 'pending' });
    res.status(201).json(booking);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Update booking status + admin note
router.patch('/:id', adminAuth, async (req, res) => {
  const { status, adminNote } = req.body;
  if (!['approved', 'declined', 'pending'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const updated = await Booking.findByIdAndUpdate(
    req.params.id,
    { status, adminNote, reviewedAt: new Date().toISOString() },
    { new: true }
  );
  res.json(updated);
});

export default router;
