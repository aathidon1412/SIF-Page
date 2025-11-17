/**
 * Booking Validation Utilities
 * Ensures bookings are only allowed Monday-Friday, 9:00 AM - 6:00 PM
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Check if a date is a weekday (Monday-Friday)
 */
export const isWeekday = (date: Date): boolean => {
  const day = date.getDay();
  return day >= 1 && day <= 5; // 0 = Sunday, 6 = Saturday
};

/**
 * Check if a date string is a weekday
 */
export const isWeekdayString = (dateString: string): boolean => {
  const date = new Date(dateString);
  return isWeekday(date);
};

/**
 * Get the day name for error messages
 */
export const getDayName = (date: Date): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

/**
 * Validate that a date is a weekday (Monday-Friday only)
 */
export const validateWeekday = (dateString: string): ValidationResult => {
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
 * Validate time is within allowed hours (9:00 AM - 6:00 PM)
 */
export const validateBusinessHours = (timeString: string): ValidationResult => {
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
      error: 'Booking time must be after 9:00 AM' 
    };
  }

  if (totalMinutes > maxMinutes) {
    return { 
      isValid: false, 
      error: 'Booking time must be before 6:00 PM' 
    };
  }

  return { isValid: true };
};

/**
 * Validate date range (start and end dates must be weekdays)
 */
export const validateDateRange = (startDate: string, endDate: string): ValidationResult => {
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
    return { isValid: false, error: 'End date must be after start date' };
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
export const validateTimeRange = (startTime: string, endTime: string): ValidationResult => {
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
 * Complete booking validation
 */
export const validateBooking = (
  startDate: string,
  endDate: string,
  startTime?: string,
  endTime?: string,
  isLabBooking: boolean = false
): ValidationResult => {
  // Validate dates
  const dateValidation = validateDateRange(startDate, endDate);
  if (!dateValidation.isValid) {
    return dateValidation;
  }

  // Validate times for lab bookings
  if (isLabBooking && startTime && endTime) {
    const timeValidation = validateTimeRange(startTime, endTime);
    if (!timeValidation.isValid) {
      return timeValidation;
    }
  }

  return { isValid: true };
};

/**
 * Get minimum allowed date (today or next weekday)
 */
export const getMinAllowedDate = (): string => {
  const today = new Date();
  
  // If today is a weekday, return today
  if (isWeekday(today)) {
    return today.toISOString().split('T')[0];
  }
  
  // Otherwise, find next Monday
  const daysUntilMonday = (8 - today.getDay()) % 7;
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilMonday);
  
  return nextMonday.toISOString().split('T')[0];
};

/**
 * Check if a specific date should be disabled in date picker
 */
export const isDateDisabled = (date: Date): boolean => {
  // Disable weekends
  return !isWeekday(date);
};

/**
 * Format time from 24-hour to 12-hour format for display
 */
export const formatTime12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};
