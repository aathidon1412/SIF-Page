/**
 * Booking Conflict Detection System
 * Detects overlapping bookings for the same item
 */

/**
 * Convert date and time to timestamp for comparison
 */
export const toTimestamp = (dateString, timeString = '00:00') => {
  const date = new Date(dateString);
  const [hours, minutes] = timeString.split(':').map(Number);
  date.setHours(hours, minutes, 0, 0);
  return date.getTime();
};

/**
 * Check if two time periods overlap
 * Returns true if there is ANY overlap between the two periods
 */
export const hasOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};

/**
 * Check if two bookings conflict (same item + overlapping time)
 * 
 * For equipment (date-based):
 *   - Compares date ranges
 *   - Any overlapping day is a conflict
 * 
 * For labs (time-based):
 *   - Compares exact timestamps (date + time)
 *   - Any overlapping time period is a conflict
 */
export const doBookingsConflict = (booking1, booking2) => {
  // Must be for the same item
  if (booking1.itemId !== booking2.itemId) {
    return false;
  }

  // Don't compare declined bookings
  if (booking1.status === 'declined' || booking2.status === 'declined') {
    return false;
  }

  // For equipment: date-based comparison (ignore time)
  if (booking1.itemType === 'equipment') {
    const start1 = new Date(booking1.startDate).setHours(0, 0, 0, 0);
    const end1 = new Date(booking1.endDate).setHours(23, 59, 59, 999);
    const start2 = new Date(booking2.startDate).setHours(0, 0, 0, 0);
    const end2 = new Date(booking2.endDate).setHours(23, 59, 59, 999);

    return hasOverlap(start1, end1, start2, end2);
  }

  // For labs: timestamp-based comparison (date + time)
  if (booking1.itemType === 'lab') {
    const start1 = toTimestamp(booking1.startDate, booking1.startTime || '00:00');
    const end1 = toTimestamp(booking1.endDate, booking1.endTime || '23:59');
    const start2 = toTimestamp(booking2.startDate, booking2.startTime || '00:00');
    const end2 = toTimestamp(booking2.endDate, booking2.endTime || '23:59');

    return hasOverlap(start1, end1, start2, end2);
  }

  return false;
};

/**
 * Find all bookings that conflict with a given booking
 * 
 * @param {Object} newBooking - The booking to check
 * @param {Array} existingBookings - Array of existing bookings to check against
 * @param {boolean} includeApprovedOnly - Only check against approved bookings
 * @returns {Array} Array of conflicting bookings with conflict details
 */
export const findConflictingBookings = (newBooking, existingBookings, includeApprovedOnly = false) => {
  const conflicts = [];

  for (const existing of existingBookings) {
    // Skip checking against itself
    if (existing._id && newBooking._id && existing._id.toString() === newBooking._id.toString()) {
      continue;
    }

    // Skip declined bookings
    if (existing.status === 'declined') {
      continue;
    }

    // If only checking approved bookings, skip others
    if (includeApprovedOnly && existing.status !== 'approved') {
      continue;
    }

    // Check for conflict
    if (doBookingsConflict(newBooking, existing)) {
      conflicts.push({
        bookingId: existing._id,
        userEmail: existing.userEmail,
        userName: existing.userName,
        status: existing.status,
        startDate: existing.startDate,
        endDate: existing.endDate,
        startTime: existing.startTime,
        endTime: existing.endTime,
        itemTitle: existing.itemTitle,
        conflictType: getConflictType(newBooking, existing)
      });
    }
  }

  return conflicts;
};

/**
 * Determine the type of conflict
 */
const getConflictType = (booking1, booking2) => {
  if (booking1.itemType === 'equipment') {
    const start1 = new Date(booking1.startDate);
    const end1 = new Date(booking1.endDate);
    const start2 = new Date(booking2.startDate);
    const end2 = new Date(booking2.endDate);

    if (start1.getTime() === start2.getTime() && end1.getTime() === end2.getTime()) {
      return 'exact_match';
    } else if (start1 >= start2 && end1 <= end2) {
      return 'fully_contained';
    } else if (start2 >= start1 && end2 <= end1) {
      return 'fully_contains';
    } else {
      return 'partial_overlap';
    }
  }

  if (booking1.itemType === 'lab') {
    const start1 = toTimestamp(booking1.startDate, booking1.startTime);
    const end1 = toTimestamp(booking1.endDate, booking1.endTime);
    const start2 = toTimestamp(booking2.startDate, booking2.startTime);
    const end2 = toTimestamp(booking2.endDate, booking2.endTime);

    if (start1 === start2 && end1 === end2) {
      return 'exact_match';
    } else if (start1 >= start2 && end1 <= end2) {
      return 'fully_contained';
    } else if (start2 >= start1 && end2 <= end1) {
      return 'fully_contains';
    } else {
      return 'partial_overlap';
    }
  }

  return 'unknown';
};

/**
 * Generate a human-readable conflict summary
 */
export const generateConflictSummary = (conflicts) => {
  if (conflicts.length === 0) {
    return null;
  }

  const approvedConflicts = conflicts.filter(c => c.status === 'approved');
  const pendingConflicts = conflicts.filter(c => c.status === 'pending');

  let summary = `Found ${conflicts.length} conflicting booking(s): `;
  
  if (approvedConflicts.length > 0) {
    summary += `${approvedConflicts.length} already approved`;
  }
  
  if (pendingConflicts.length > 0) {
    if (approvedConflicts.length > 0) summary += ', ';
    summary += `${pendingConflicts.length} pending review`;
  }

  return summary;
};

/**
 * Check if a booking has critical conflicts (with approved bookings)
 */
export const hasCriticalConflict = (conflicts) => {
  return conflicts.some(c => c.status === 'approved');
};

/**
 * Format conflict details for display
 */
export const formatConflictDetails = (conflict) => {
  const dateRange = conflict.startDate === conflict.endDate
    ? conflict.startDate
    : `${conflict.startDate} to ${conflict.endDate}`;

  let details = `${conflict.userName} (${conflict.userEmail}) - ${dateRange}`;

  if (conflict.startTime && conflict.endTime) {
    details += ` ${conflict.startTime}-${conflict.endTime}`;
  }

  details += ` [${conflict.status.toUpperCase()}]`;

  return details;
};
