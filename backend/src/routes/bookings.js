import express from 'express';
import { Booking } from '../models/Booking.js';
import { adminAuth } from '../middleware/auth.js';
import { validateBooking } from '../utils/bookingValidation.js';
import { bookingSecurityMiddleware, bookingRateLimiter } from '../middleware/bookingSecurity.js';
import { findConflictingBookings, generateConflictSummary, hasCriticalConflict } from '../utils/conflictDetection.js';
import { notifyBookingConflict, notifyAdminOfConflict, recordNotification } from '../utils/notifications.js';

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

    // Check for conflicts with existing bookings
    const existingBookings = await Booking.find({
      itemId: req.body.itemId,
      status: { $ne: 'declined' } // Exclude declined bookings
    });

    const conflicts = findConflictingBookings(req.body, existingBookings);
    const hasConflicts = conflicts.length > 0;
    const criticalConflict = hasCriticalConflict(conflicts);

    // Create the booking with conflict information
    const booking = await Booking.create({ 
      ...req.body, 
      submittedAt: new Date().toISOString(), 
      status: 'pending',
      hasConflict: hasConflicts,
      conflictingBookings: conflicts
    });

    console.log(`[BOOKING SUCCESS] Created booking ID: ${booking._id} for ${booking.userEmail}`);

    // If there are conflicts, notify user and admin
    if (hasConflicts) {
      console.log(`[CONFLICT DETECTED] ${conflicts.length} conflict(s) found for booking ${booking._id}`);
      console.log(`  - Critical conflicts (approved): ${criticalConflict ? 'YES' : 'NO'}`);
      console.log(`  - ${generateConflictSummary(conflicts)}`);

      // Notify user about conflict
      const userNotification = await notifyBookingConflict(booking, conflicts);
      await recordNotification(Booking, booking._id, userNotification);

      // Notify admin about conflict
      await notifyAdminOfConflict(booking, conflicts);

      // Update conflicting bookings to reference this new booking
      for (const conflict of conflicts) {
        if (conflict.bookingId) {
          await Booking.findByIdAndUpdate(conflict.bookingId, {
            $set: { hasConflict: true },
            $addToSet: {
              conflictingBookings: {
                bookingId: booking._id,
                userEmail: booking.userEmail,
                userName: booking.userName,
                status: booking.status,
                startDate: booking.startDate,
                endDate: booking.endDate,
                startTime: booking.startTime,
                endTime: booking.endTime,
                conflictType: conflict.conflictType,
                itemTitle: booking.itemTitle
              }
            }
          });
        }
      }
    }

    res.status(201).json({
      ...booking.toObject(),
      conflictWarning: hasConflicts ? generateConflictSummary(conflicts) : null
    });
    
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
  try {
    const { status, adminNote } = req.body;
    
    if (!['approved', 'declined', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Get the current booking state
    const currentBooking = await Booking.findById(req.params.id);
    
    if (!currentBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const oldStatus = currentBooking.status;
    const wasApproved = oldStatus === 'approved';
    const isBeingDeclined = status === 'declined';
    const declinedAfterApproval = wasApproved && isBeingDeclined;

    // Update the booking
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        adminNote, 
        reviewedAt: new Date().toISOString(),
        previousStatus: oldStatus,
        wasApprovedBefore: wasApproved || currentBooking.wasApprovedBefore,
        declinedAfterApproval: declinedAfterApproval || currentBooking.declinedAfterApproval
      },
      { new: true }
    );

    console.log(`[STATUS UPDATE] Booking ${req.params.id}: ${oldStatus} → ${status} ${declinedAfterApproval ? '(REVOKED)' : ''}`);

    // Send notification to user
    const { notifyBookingStatusChange, recordNotification } = await import('../utils/notifications.js');
    const notification = await notifyBookingStatusChange(updated, oldStatus);
    await recordNotification(Booking, updated._id, notification);
    
    // Enhanced logging for revoked bookings
    if (declinedAfterApproval) {
      console.log(`[REVOCATION NOTIFICATION] User ${updated.userEmail} notified about revoked booking ${updated._id}`);
      console.log(`[REVOCATION DETAILS] Item: ${updated.itemTitle}, Dates: ${updated.startDate} - ${updated.endDate}`);
      console.log(`[ADMIN NOTE] Reason: ${updated.adminNote || 'No reason provided'}`);
    }

    // Handle cascading effects based on status change
    if (status === 'approved') {
      // When a booking is approved, decline all conflicting pending bookings
      if (updated.hasConflict && updated.conflictingBookings.length > 0) {
        console.log(`[CASCADE] Approving booking ${updated._id} - checking ${updated.conflictingBookings.length} conflicts`);
        
        for (const conflict of updated.conflictingBookings) {
          if (conflict.status === 'pending' && conflict.bookingId) {
            // Decline the conflicting pending booking
            await Booking.findByIdAndUpdate(conflict.bookingId, {
              status: 'declined',
              adminNote: `Automatically declined due to approved booking by ${updated.userName} for ${updated.itemTitle}`,
              reviewedAt: new Date().toISOString(),
              previousStatus: 'pending'
            });

            // Notify the user of the conflicting booking
            const conflictingBooking = await Booking.findById(conflict.bookingId);
            if (conflictingBooking) {
              const conflictNotification = await notifyBookingStatusChange(conflictingBooking, 'pending');
              await recordNotification(Booking, conflictingBooking._id, conflictNotification);
              console.log(`[CASCADE] Auto-declined conflicting booking ${conflict.bookingId} for ${conflict.userEmail}`);
            }
          }
        }
      }
    }

    if (declinedAfterApproval) {
      // When an approved booking is declined, check if conflicting bookings can be approved
      console.log(`[REVOCATION] Booking ${updated._id} was approved and is now declined`);
      
      if (updated.hasConflict && updated.conflictingBookings.length > 0) {
        console.log(`[CASCADE] Checking ${updated.conflictingBookings.length} conflicting bookings for potential approval`);
        
        // Get all conflicting bookings that are still pending
        for (const conflict of updated.conflictingBookings) {
          if (conflict.bookingId) {
            const conflictBooking = await Booking.findById(conflict.bookingId);
            
            if (conflictBooking && conflictBooking.status === 'pending') {
              // Check if this conflicting booking now has no approved conflicts
              const stillHasConflicts = await Booking.find({
                itemId: conflictBooking.itemId,
                status: 'approved',
                _id: { $ne: conflictBooking._id },
                $or: [
                  {
                    startDate: { $lte: conflictBooking.endDate },
                    endDate: { $gte: conflictBooking.startDate }
                  }
                ]
              });

              if (stillHasConflicts.length === 0) {
                console.log(`[CASCADE OPPORTUNITY] Booking ${conflictBooking._id} now has no conflicts - admin should review`);
                // Notify admin that this booking can now be approved
                const { notifyAdminOfConflict } = await import('../utils/notifications.js');
                await notifyAdminOfConflict(conflictBooking, [{
                  ...conflict,
                  status: 'declined',
                  note: 'Previously conflicting booking was declined - this can now be approved'
                }]);
              }
            }
          }
        }
      }
    }

    // Update conflict status for all related bookings
    if (isBeingDeclined && updated.conflictingBookings.length > 0) {
      for (const conflict of updated.conflictingBookings) {
        if (conflict.bookingId) {
          // Remove this booking from the conflicting booking's conflict list
          await Booking.findByIdAndUpdate(conflict.bookingId, {
            $pull: {
              conflictingBookings: { bookingId: updated._id }
            }
          });

          // Recalculate hasConflict flag
          const conflictBooking = await Booking.findById(conflict.bookingId);
          if (conflictBooking) {
            const hasRemainingConflicts = conflictBooking.conflictingBookings.filter(
              c => c.bookingId.toString() !== updated._id.toString()
            ).length > 0;

            await Booking.findByIdAndUpdate(conflict.bookingId, {
              hasConflict: hasRemainingConflicts
            });
          }
        }
      }
    }

    res.json({
      ...updated.toObject(),
      notification: notification.success ? 'Notification sent' : 'Notification failed'
    });

  } catch (error) {
    console.error(`[STATUS UPDATE ERROR] ${error.message}`, { error: error.stack });
    res.status(500).json({ 
      error: 'Failed to update booking status',
      message: error.message 
    });
  }
});

export default router;
