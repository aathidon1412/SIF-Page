/**
 * Server-side Booking Validation
 * Ensures bookings comply with business hours (Monday-Friday, 9 AM - 6 PM)
 */

/**
 * Check if a date is a weekday (Monday-Friday)
 */
export const isWeekday = (date) => {
  const day = date.getDay();
  return day >= 1 && day <= 5; // 0 = Sunday, 6 = Saturday
};

/**
 * Get the day name for error messages
 */
export const getDayName = (date) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

/**
 * Validate that a date string is a weekday
 */
export const validateWeekday = (dateString) => {
  if (!dateString) {
    return { isValid: false, error: 'Date is required' };
  }
  // Accept either ISO (YYYY-MM-DD) or DD/MM/YYYY
  const isoMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const ddmmyyyyMatch = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  let date = null;
  if (isoMatch) {
    date = new Date(dateString);
  } else if (ddmmyyyyMatch) {
    const [, dd, mm, yyyy] = ddmmyyyyMatch;
    date = new Date(parseInt(yyyy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10));
  } else {
    return { isValid: false, error: 'Invalid date format. Use DD/MM/YYYY or YYYY-MM-DD' };
  }

  if (!date || isNaN(date.getTime())) return { isValid: false, error: 'Invalid date' };
  if (!isWeekday(date)) return { isValid: false, error: `Bookings are only available Monday-Friday. ${getDayName(date)} is not allowed.` };
  return { isValid: true };
};

// Parse a date string in DD/MM/YYYY or YYYY-MM-DD into a Date object (local timezone)
const parseDateString = (dateString) => {
  if (!dateString) return null;
  const isoMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const ddmmyyyyMatch = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  let date = null;
  if (isoMatch) {
    // YYYY-MM-DD -> safe ISO date
    const [y, m, d] = [parseInt(isoMatch[1], 10), parseInt(isoMatch[2], 10), parseInt(isoMatch[3], 10)];
    date = new Date(y, m - 1, d);
  } else if (ddmmyyyyMatch) {
    const [, dd, mm, yyyy] = ddmmyyyyMatch;
    date = new Date(parseInt(yyyy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10));
  } else {
    // Fallback to Date constructor (best-effort)
    const d = new Date(dateString);
    if (!isNaN(d.getTime())) date = d;
  }
  return date && !isNaN(date.getTime()) ? date : null;
};

/**
 * Validate time is within business hours (9:00 AM - 6:00 PM)
 */
export const validateBusinessHours = (timeString) => {
  if (!timeString) {
    return { isValid: false, error: 'Time is required' };
  }

  // Parse time in HH:mm format (24-hour)
  const [hours, minutes] = timeString.split(':').map(Number);

  if (isNaN(hours) || isNaN(minutes)) {
    return { isValid: false, error: 'Invalid time format' };
  }

  const totalMinutes = hours * 60 + minutes;
  const minMinutes = 9 * 60; // 9:00 AM
  const maxMinutes = 18 * 60; // 6:00 PM

  if (totalMinutes < minMinutes) {
    return { 
      isValid: false, 
      error: 'Booking time must be at or after 9:00 AM' 
    };
  }

  if (totalMinutes > maxMinutes) {
    return { 
      isValid: false, 
      error: 'Booking time must be at or before 6:00 PM' 
    };
  }

  return { isValid: true };
};

/**
 * Validate date range (all dates must be weekdays)
 */
export const validateDateRange = (startDate, endDate) => {
  const startValidation = validateWeekday(startDate);
  if (!startValidation.isValid) {
    return { isValid: false, error: `Start date: ${startValidation.error}` };
  }

  const endValidation = validateWeekday(endDate);
  if (!endValidation.isValid) {
    return { isValid: false, error: `End date: ${endValidation.error}` };
  }

  const start = parseDateString(startDate);
  const end = parseDateString(endDate);

  if (end < start) {
    return { isValid: false, error: 'End date must be after or equal to start date' };
  }

  // Check all dates in the range are weekdays
  const current = new Date(start);
  while (current <= end) {
    if (!isWeekday(current)) {
      return { 
        isValid: false, 
        error: `Booking range includes weekend (${getDayName(current)}). Only Monday-Friday bookings are allowed.` 
      };
    }
    current.setDate(current.getDate() + 1);
  }

  return { isValid: true };
};

/**
 * Validate time range is within business hours
 */
export const validateTimeRange = (startTime, endTime) => {
  const startValidation = validateBusinessHours(startTime);
  if (!startValidation.isValid) {
    return { isValid: false, error: `Start time: ${startValidation.error}` };
  }

  const endValidation = validateBusinessHours(endTime);
  if (!endValidation.isValid) {
    return { isValid: false, error: `End time: ${endValidation.error}` };
  }

  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  if (endTotalMinutes <= startTotalMinutes) {
    return { isValid: false, error: 'End time must be after start time' };
  }

  return { isValid: true };
};

/**
 * Validate date-time combination (single unified validation)
 */
export const validateDateTimeCombination = (startDate, endDate, startTime, endTime, itemType) => {
  // Basic validation
  if (!startDate || !endDate) {
    return { isValid: false, error: 'Start date and end date are required' };
  }

  // Helper to parse DD/MM/YYYY HH:MM -> Date or null
  const parseDDMMYYYY_HHMM = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;
    const combined = `${dateStr.trim()} ${timeStr.trim()}`;
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
    ) return null;
    return d;
  };

  // For equipment bookings (date only)
  if (itemType === 'equipment') {
    const start = parseDateString(startDate);
    const end = parseDateString(endDate);
    
    if (!start || !end) {
      return { isValid: false, error: 'Invalid date format' };
    }
    
    // Single check: end must be after or equal to start
    if (end < start) {
      return { isValid: false, error: 'End date must be after or equal to start date' };
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start < today) {
      return { isValid: false, error: 'Start date cannot be in the past' };
    }
    
    return { isValid: true };
  }

  // For lab bookings (date + time)
  if (itemType === 'lab') {
    if (!startTime || !endTime) {
      return { isValid: false, error: 'Start time and end time are required for lab bookings' };
    }

    // Parse using DD/MM/YYYY HH:MM (strict)
    const startDT = parseDDMMYYYY_HHMM(startDate, startTime);
    const endDT = parseDDMMYYYY_HHMM(endDate, endTime);
    if (!startDT || !endDT) {
      return { isValid: false, error: 'Date and time must be in format DD/MM/YYYY HH:MM' };
    }

    // Strict: end must be after start
    if (endDT <= startDT) return { isValid: false, error: 'End date-time must be later than start date-time' };

    // Not allowed in the past
    const now = new Date();
    if (startDT < now) return { isValid: false, error: 'Booking cannot be in the past' };

    // Business hours checks (both must be within 09:00-18:00)
    const startTotal = startDT.getHours() * 60 + startDT.getMinutes();
    const endTotal = endDT.getHours() * 60 + endDT.getMinutes();
    if (startTotal < 9 * 60 || startTotal > 18 * 60) return { isValid: false, error: 'Start time must be between 09:00 and 18:00' };
    if (endTotal < 9 * 60 || endTotal > 18 * 60) return { isValid: false, error: 'End time must be between 09:00 and 18:00' };

    // Minimum 1 hour duration
    const durationHours = (endDT - startDT) / (1000 * 60 * 60);
    if (durationHours < 1) return { isValid: false, error: 'Minimum booking duration is 1 hour' };

    // Maximum 9 hours same-day
    if (startDate === endDate && durationHours > 9) return { isValid: false, error: 'Maximum booking duration per day is 9 hours' };

    // Ensure weekdays across range
    const currentDate = new Date(startDT);
    const endBoundary = new Date(endDT);
    while (currentDate <= endBoundary) {
      if (!isWeekday(currentDate)) return { isValid: false, error: `Booking includes ${getDayName(currentDate)}. Only Monday-Friday allowed.` };
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return { isValid: true };
};

/**
 * Complete booking validation for backend
 */
export const validateBooking = (bookingData) => {
  const { startDate, endDate, startTime, endTime, itemType } = bookingData;

  // Validate required fields
  if (!startDate || !endDate) {
    return { isValid: false, error: 'Start date and end date are required' };
  }

  // Validate dates are weekdays
  const dateValidation = validateDateRange(startDate, endDate);
  if (!dateValidation.isValid) {
    return dateValidation;
  }

  // Use ONLY the unified date-time combination validation
  // This properly handles multi-day bookings where end time < start time
  const dateTimeCombinationValidation = validateDateTimeCombination(
    startDate, 
    endDate, 
    startTime, 
    endTime, 
    itemType
  );
  if (!dateTimeCombinationValidation.isValid) {
    return dateTimeCombinationValidation;
  }

  return { isValid: true };
};
