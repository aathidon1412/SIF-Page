/**
 * Security Middleware for Booking Validation Logging
 * Logs all booking attempts and validation failures for security monitoring
 */

import { validateBooking } from '../utils/bookingValidation.js';

/**
 * Middleware to validate and log booking requests
 */
export const bookingSecurityMiddleware = (req, res, next) => {
  // Only apply to POST requests (booking creation)
  if (req.method !== 'POST') {
    return next();
  }

  const bookingData = req.body;
  const timestamp = new Date().toISOString();
  const clientIP = req.ip || req.connection.remoteAddress;

  // Validate booking
  const validation = validateBooking(bookingData);

  // Log all booking attempts
  console.log(`[BOOKING ATTEMPT] ${timestamp}`, {
    ip: clientIP,
    userEmail: bookingData.userEmail,
    itemType: bookingData.itemType,
    itemTitle: bookingData.itemTitle,
    startDate: bookingData.startDate,
    endDate: bookingData.endDate,
    startTime: bookingData.startTime,
    endTime: bookingData.endTime,
    valid: validation.isValid
  });

  // If validation fails, log the security event
  if (!validation.isValid) {
    console.warn(`[SECURITY] Invalid booking attempt blocked`, {
      timestamp,
      ip: clientIP,
      userEmail: bookingData.userEmail,
      error: validation.error,
      attemptedData: {
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime
      }
    });

    // Track potential bypass attempts
    const isWeekend = bookingData.startDate && (new Date(bookingData.startDate).getDay() === 0 || new Date(bookingData.startDate).getDay() === 6);
    const isOutsideHours = bookingData.startTime && (
      parseInt(bookingData.startTime.split(':')[0]) < 9 || 
      parseInt(bookingData.startTime.split(':')[0]) > 18
    );

    if (isWeekend || isOutsideHours) {
      console.error(`[SECURITY ALERT] Potential bypass attempt detected!`, {
        timestamp,
        ip: clientIP,
        userEmail: bookingData.userEmail,
        isWeekendAttempt: isWeekend,
        isOutsideHoursAttempt: isOutsideHours
      });
    }
  }

  next();
};

/**
 * Rate limiting for booking endpoints
 * Prevents spam and automated attacks
 */
const bookingAttempts = new Map();
const MAX_ATTEMPTS = 10; // Maximum booking attempts per user per hour
const TIME_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

export const bookingRateLimiter = (req, res, next) => {
  if (req.method !== 'POST') {
    return next();
  }

  const userEmail = req.body.userEmail;
  if (!userEmail) {
    return next();
  }

  const now = Date.now();
  const userKey = `booking_${userEmail}`;
  
  // Get or initialize user's attempt history
  if (!bookingAttempts.has(userKey)) {
    bookingAttempts.set(userKey, []);
  }

  const attempts = bookingAttempts.get(userKey);
  
  // Filter out old attempts outside the time window
  const recentAttempts = attempts.filter(timestamp => now - timestamp < TIME_WINDOW);
  
  // Check if user has exceeded the limit
  if (recentAttempts.length >= MAX_ATTEMPTS) {
    console.warn(`[SECURITY] Rate limit exceeded for booking attempts`, {
      userEmail,
      attempts: recentAttempts.length,
      ip: req.ip
    });

    return res.status(429).json({
      error: 'Too many booking attempts',
      message: 'You have exceeded the maximum number of booking attempts. Please try again later.',
      retryAfter: Math.ceil((recentAttempts[0] + TIME_WINDOW - now) / 1000 / 60) // minutes
    });
  }

  // Add current attempt
  recentAttempts.push(now);
  bookingAttempts.set(userKey, recentAttempts);

  // Clean up old entries periodically
  if (Math.random() < 0.01) { // 1% chance on each request
    const cutoff = now - TIME_WINDOW;
    for (const [key, timestamps] of bookingAttempts.entries()) {
      const recent = timestamps.filter(t => t > cutoff);
      if (recent.length === 0) {
        bookingAttempts.delete(key);
      } else {
        bookingAttempts.set(key, recent);
      }
    }
  }

  next();
};
