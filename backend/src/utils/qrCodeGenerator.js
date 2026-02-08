/**
 * QR Code Generation Utility for Booking Verification
 * Generates unique tokens and QR codes for booking verification
 */

import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { Booking } from '../models/Booking.js';

/**
 * Generate a unique verification token
 * @returns {string} UUID v4 token
 */
export const generateVerificationToken = () => {
  return uuidv4();
};

/**
 * Generate QR code data URL from token
 * @param {string} token - Verification token
 * @returns {Promise<string>} QR code as data URL
 */
export const generateQRCode = async (token) => {
  try {
    // Generate QR code as data URL (base64 image)
    const qrCodeDataURL = await QRCode.toDataURL(token, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('[QR CODE ERROR] Failed to generate QR code:', error);
    throw new Error('QR code generation failed');
  }
};

/**
 * Generate QR code as PNG Buffer
 * @param {string} token
 * @returns {Promise<Buffer>} PNG buffer
 */
export const generateQRCodeBuffer = async (token) => {
  try {
    const buf = await QRCode.toBuffer(token, {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 300,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    return buf;
  } catch (error) {
    console.error('[QR CODE ERROR] Failed to generate QR buffer:', error);
    throw new Error('QR code buffer generation failed');
  }
};

/**
 * Generate and attach QR code to booking
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Object>} Updated booking with QR code
 */
export const generateBookingQRCode = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Generate unique token
    const token = generateVerificationToken();
    
    // Generate QR code image
    const qrCodeData = await generateQRCode(token);
    // Also produce a PNG buffer for email attachments / cid embedding
    let qrCodeBuffer = null;
    try {
      qrCodeBuffer = await generateQRCodeBuffer(token);
    } catch (e) {
      // Non-fatal: keep data URL only if buffer generation fails
      qrCodeBuffer = null;
      console.warn('[QR CODE] Buffer generation failed, falling back to data URL');
    }
    
    // Update booking with token and QR code
    booking.verificationToken = token;
    booking.qrCodeData = qrCodeData;
    booking.tokenGeneratedAt = new Date().toISOString();
    
    await booking.save();
    
    console.log(`[QR CODE] Generated for booking ${bookingId}`);
    
    return {
      token,
      qrCodeData,
      qrCodeBuffer,
      bookingId
    };
  } catch (error) {
    console.error('[QR CODE ERROR]', error);
    throw error;
  }
};

/**
 * Verify a booking token
 * @param {string} token - Verification token from QR code
 * @returns {Promise<Object>} Verification result
 */
export const verifyBookingToken = async (token) => {
  try {
    if (!token || typeof token !== 'string') {
      return {
        valid: false,
        status: 'invalid',
        message: 'Invalid token format'
      };
    }

    // Find booking by token
    const booking = await Booking.findOne({ verificationToken: token });
    
    if (!booking) {
      return {
        valid: false,
        status: 'invalid',
        message: 'Token not found. This QR code may be invalid or the booking may have been removed.'
      };
    }

    // Check if booking is approved
    if (booking.status !== 'approved') {
      return {
        valid: false,
        status: 'not_approved',
        message: `Booking is ${booking.status}. Only approved bookings can be verified.`,
        bookingInfo: {
          id: booking._id,
          itemTitle: booking.itemTitle,
          userName: booking.userName,
          status: booking.status
        }
      };
    }

    // Parse booking dates to check validity
    const now = new Date();
    const startDateTime = parseDateTimeString(booking.startDate, booking.startTime);
    const endDateTime = parseDateTimeString(booking.endDate, booking.endTime);

    if (!startDateTime || !endDateTime) {
      return {
        valid: false,
        status: 'invalid',
        message: 'Invalid booking date/time format'
      };
    }

    // Check if booking is expired (end time has passed)
    if (endDateTime < now) {
      return {
        valid: false,
        status: 'expired',
        message: 'This booking has expired. The scheduled time has already passed.',
        bookingInfo: {
          id: booking._id,
          itemTitle: booking.itemTitle,
          userName: booking.userName,
          endDate: booking.endDate,
          endTime: booking.endTime
        }
      };
    }

    // Check if booking is not yet valid (start time hasn't arrived)
    // Allow verification up to 30 minutes before start time
    const earlyAccessTime = new Date(startDateTime.getTime() - 30 * 60 * 1000);
    
    if (now < earlyAccessTime) {
      return {
        valid: false,
        status: 'not_yet_valid',
        message: 'This booking is not yet valid. You can verify starting 30 minutes before the scheduled time.',
        bookingInfo: {
          id: booking._id,
          itemTitle: booking.itemTitle,
          userName: booking.userName,
          startDate: booking.startDate,
          startTime: booking.startTime
        }
      };
    }

    // Booking is valid - record verification
    booking.verificationCount = (booking.verificationCount || 0) + 1;
    booking.verifiedAt = new Date().toISOString();
    await booking.save();

    console.log(`[QR VERIFY] Booking ${booking._id} verified. Count: ${booking.verificationCount}`);

    return {
      valid: true,
      status: 'valid',
      message: 'Booking verified successfully!',
      bookingInfo: {
        id: booking._id,
        itemTitle: booking.itemTitle,
        itemType: booking.itemType,
        userName: booking.userName,
        userEmail: booking.userEmail,
        startDate: booking.startDate,
        startTime: booking.startTime,
        endDate: booking.endDate,
        endTime: booking.endTime,
        purpose: booking.purpose,
        verificationCount: booking.verificationCount,
        firstVerifiedAt: booking.verificationCount === 1 ? booking.verifiedAt : booking.verifiedAt
      }
    };
    
  } catch (error) {
    console.error('[QR VERIFY ERROR]', error);
    return {
      valid: false,
      status: 'error',
      message: 'Verification failed due to server error'
    };
  }
};

/**
 * Helper: Parse date/time string in DD/MM/YYYY HH:MM format
 */
const parseDateTimeString = (dateStr, timeStr) => {
  try {
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
    
    return new Date(year, month, day, hour, minute, 0);
  } catch (e) {
    return null;
  }
};
