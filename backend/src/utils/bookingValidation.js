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

  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }

  if (!isWeekday(date)) {
    return { 
      isValid: false, 
      error: `Bookings are only available Monday-Friday. ${getDayName(date)} is not allowed.` 
    };
  }

  return { isValid: true };
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

  const start = new Date(startDate);
  const end = new Date(endDate);

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

  // For equipment bookings (date only)
  if (itemType === 'equipment') {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
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

    // Validate time format
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return { isValid: false, error: 'Invalid time format. Use HH:mm format' };
    }

    // Create complete date-time objects
    const startDateTime = new Date(`${startDate}T${startTime}:00`);
    const endDateTime = new Date(`${endDate}T${endTime}:00`);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      return { isValid: false, error: 'Invalid date or time combination' };
    }

    // Single unified check: end date-time must be after start date-time
    if (endDateTime <= startDateTime) {
      return { 
        isValid: false, 
        error: 'End date and time must be after start date and time' 
      };
    }

    // Check if booking is in the past
    const now = new Date();
    if (startDateTime < now) {
      return { isValid: false, error: 'Booking cannot be in the past' };
    }

    // Validate business hours (9 AM - 6 PM)
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    if (startTotalMinutes < 540 || startTotalMinutes > 1080) {
      return { isValid: false, error: 'Start time must be between 9:00 AM and 6:00 PM' };
    }
    if (endTotalMinutes < 540 || endTotalMinutes > 1080) {
      return { isValid: false, error: 'End time must be between 9:00 AM and 6:00 PM' };
    }

    // Minimum 1 hour duration
    const durationHours = (endDateTime - startDateTime) / (1000 * 60 * 60);
    if (durationHours < 1) {
      return { isValid: false, error: 'Minimum booking duration is 1 hour' };
    }

    // Maximum 9 hours for single day
    if (startDate === endDate && durationHours > 9) {
      return { isValid: false, error: 'Maximum booking duration per day is 9 hours' };
    }

    // Validate weekdays in range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const currentDate = new Date(start);
    while (currentDate <= end) {
      if (!isWeekday(currentDate)) {
        return {
          isValid: false,
          error: `Booking includes ${getDayName(currentDate)}. Only Monday-Friday allowed.`
        };
      }
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
