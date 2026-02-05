/**
 * QR Code Verification Routes
 * Handles booking verification via QR code scanning
 */

import express from 'express';
import { verifyBookingToken } from '../utils/qrCodeGenerator.js';

const router = express.Router();

/**
 * POST /api/verify/booking
 * Verify a booking using the QR code token
 * 
 * Request body:
 * {
 *   "token": "uuid-token-from-qr-code"
 * }
 * 
 * Response:
 * {
 *   "valid": boolean,
 *   "status": "valid" | "invalid" | "expired" | "not_yet_valid" | "not_approved" | "error",
 *   "message": string,
 *   "bookingInfo": { ... } // Only included if valid
 * }
 */
router.post('/booking', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        valid: false,
        status: 'invalid',
        message: 'Token is required'
      });
    }

    // Verify the token
    const result = await verifyBookingToken(token);

    // Set appropriate HTTP status code based on verification result
    const statusCode = result.valid ? 200 : 400;

    console.log(`[VERIFY API] Token verification: ${result.status} - ${result.message}`);

    res.status(statusCode).json(result);
    
  } catch (error) {
    console.error('[VERIFY API ERROR]', error);
    res.status(500).json({
      valid: false,
      status: 'error',
      message: 'Server error during verification'
    });
  }
});

/**
 * GET /api/verify/health
 * Health check endpoint for verification service
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'QR Verification API',
    timestamp: new Date().toISOString()
  });
});

export default router;
