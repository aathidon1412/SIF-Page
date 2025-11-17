import express from 'express';
import { Booking } from '../models/Booking.js';
import { adminAuth } from '../middleware/auth.js';
import { validateBooking } from '../utils/bookingValidation.js';
import { bookingSecurityMiddleware, bookingRateLimiter } from '../middleware/bookingSecurity.js';

const router = express.Router();

// Apply security middleware to all booking routes
router.use(bookingSecurityMiddleware);
router.use(bookingRateLimiter);

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
    // Validate booking constraints (Monday-Friday, 9 AM - 6 PM)
    const validation = validateBooking(req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: validation.error 
      });
    }

    const booking = await Booking.create({ 
      ...req.body, 
      submittedAt: new Date().toISOString(), 
      status: 'pending' 
    });
    
    console.log(`[BOOKING SUCCESS] Created booking ID: ${booking._id} for ${booking.userEmail}`);
    res.status(201).json(booking);
  } catch (e) {
    console.error(`[BOOKING ERROR] ${e.message}`, { error: e.stack });
    res.status(400).json({ 
      error: 'Booking creation failed',
      message: e.message 
    });
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
