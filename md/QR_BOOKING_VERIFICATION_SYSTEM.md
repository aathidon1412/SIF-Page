# QR Code Booking Verification System

## Overview
The QR-based booking verification system allows coordinators to verify approved bookings on-site using QR codes. When a booking is approved, a unique QR code is automatically generated and included in the confirmation email. Coordinators can scan these QR codes using the web-based scanner to instantly verify booking authenticity and validity.

## Features

### Backend Features
- **Unique Token Generation**: Each approved booking receives a UUID v4 verification token
- **QR Code Generation**: Tokens are encoded as QR codes using the `qrcode` package
- **Email Integration**: QR codes are automatically embedded in booking confirmation emails
- **Verification API**: Secure endpoint to validate booking tokens
- **Time-based Validation**: Bookings can be verified 30 minutes before scheduled time
- **Usage Tracking**: System tracks verification count and timestamps

### Frontend Features
- **Real-time QR Scanning**: Uses device camera via `html5-qrcode` library
- **Coordinator Interface**: Dedicated page at `/coordinator` route
- **Instant Verification**: Immediate feedback on booking validity
- **Detailed Booking Info**: Displays complete booking details for valid codes
- **Status Indicators**: Clear visual feedback for different verification states

## Architecture

### Backend Components

#### 1. Database Schema Updates (`backend/src/models/Booking.js`)
Added fields to Booking model:
```javascript
{
  verificationToken: String,        // UUID v4 token
  qrCodeData: String,               // Base64 QR code image
  tokenGeneratedAt: String,         // Timestamp of generation
  verifiedAt: String,               // Last verification timestamp
  verifiedBy: String,               // Coordinator identifier (future use)
  verificationCount: Number         // Number of times verified
}
```

#### 2. QR Code Generation Utility (`backend/src/utils/qrCodeGenerator.js`)
- `generateVerificationToken()`: Creates unique UUID
- `generateQRCode(token)`: Encodes token as QR image
- `generateBookingQRCode(bookingId)`: Links QR to booking
- `verifyBookingToken(token)`: Validates token and checks booking status

#### 3. Email Notification (`backend/src/utils/notifications.js`)
- Modified `notifyBookingStatusChange()` to generate QR codes for approved bookings
- QR codes embedded as inline images in confirmation emails
- Graceful fallback if QR generation fails

#### 4. Verification API (`backend/src/routes/verify.js`)
- `POST /api/verify/booking`: Verifies booking token
- `GET /api/verify/health`: Health check endpoint

### Frontend Components

#### 1. Coordinator Page (`frontend/src/pages/Coordinator.tsx`)
- Camera-based QR scanner interface
- Real-time decoding using `html5-qrcode`
- Verification result display with booking details
- Status-based color coding and icons

#### 2. Routing (`frontend/src/App.tsx`)
- Added `/coordinator` route
- Hidden navbar/footer for focused scanning experience

## Verification Flow

### 1. Booking Approval
```
Admin approves booking 
  → System generates UUID token
  → QR code created from token
  → Token & QR saved to booking record
  → QR code embedded in confirmation email
  → Email sent to user
```

### 2. On-site Verification
```
Coordinator opens /coordinator page
  → Starts camera scanner
  → Scans user's QR code
  → Frontend sends token to backend
  → Backend validates token
  → Returns verification result
  → Coordinator sees result with booking details
```

## Verification States

### Valid ✓
- Booking exists and is approved
- Current time is within valid window (30 min before start to end time)
- Returns full booking details
- Increments verification count

### Invalid ✗
- Token not found in database
- QR code may be fake or booking deleted

### Expired ⏰
- Booking end time has passed
- Booking can no longer be used

### Not Yet Valid ⏳
- Current time is before 30-minute early access window
- User tried to check in too early

### Not Approved ⚠️
- Booking exists but status is not "approved"
- May be pending or declined

### Error ❌
- Server error during verification
- Network connectivity issues

## Security Features

1. **Unique Tokens**: UUID v4 provides cryptographically random tokens
2. **No Sensitive Data**: QR codes only contain token, not booking details
3. **Time-based Validation**: Prevents use of expired bookings
4. **Status Checking**: Only approved bookings can be verified
5. **Audit Trail**: Tracks all verification attempts with timestamps
6. **Server-side Validation**: All checks performed on backend

## API Endpoints

### POST /api/verify/booking
Verify a booking token

**Request:**
```json
{
  "token": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (Valid):**
```json
{
  "valid": true,
  "status": "valid",
  "message": "Booking verified successfully!",
  "bookingInfo": {
    "id": "...",
    "itemTitle": "3D Printer Lab",
    "itemType": "lab",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "startDate": "05/02/2026",
    "startTime": "09:00",
    "endDate": "05/02/2026",
    "endTime": "17:00",
    "purpose": "Research project",
    "verificationCount": 1
  }
}
```

**Response (Invalid):**
```json
{
  "valid": false,
  "status": "expired",
  "message": "This booking has expired. The scheduled time has already passed.",
  "bookingInfo": {
    "id": "...",
    "itemTitle": "3D Printer Lab",
    "userName": "John Doe",
    "endDate": "04/02/2026",
    "endTime": "17:00"
  }
}
```

## Usage Instructions

### For Coordinators

1. Navigate to `/coordinator` or `http://localhost:5173/#/coordinator`
2. Click "Start Scanner" to activate camera
3. Point camera at user's QR code (from email or printed)
4. System automatically scans and verifies
5. Review booking details on screen
6. Click "Scan Another" for next verification

### For Users

1. Receive confirmation email after booking approval
2. Email contains unique QR code
3. Save email or print QR code
4. Present QR code to coordinator on arrival
5. QR code remains valid throughout booking period

## Testing

### Test Approved Booking Verification

1. Create a booking via frontend
2. Login as admin and approve the booking
3. Check email logs for QR code generation
4. Navigate to `/coordinator`
5. Display QR code from email on another device
6. Scan QR code with coordinator interface
7. Verify booking details appear correctly

### Test Invalid States

1. **Expired**: Test with old booking (modify dates in DB)
2. **Not Yet Valid**: Test booking scheduled for future date
3. **Not Approved**: Test with pending/declined booking
4. **Invalid Token**: Test with random UUID not in database

## Dependencies

### Backend
- `uuid`: ^13.0.0 - Generate unique tokens
- `qrcode`: ^1.5.4 - Create QR code images
- `nodemailer`: ^6.9.3 - Email delivery (existing)
- `express`: ^4.19.2 - API routing (existing)
- `mongoose`: ^8.5.0 - Database (existing)

### Frontend
- `html5-qrcode`: ^2.3.8 - Camera-based QR scanning
- `react-router-dom`: ^7.9.5 - Routing (existing)
- `react-hot-toast`: ^2.6.0 - Notifications (existing)

## Installation

### Backend
```bash
cd backend
npm install uuid qrcode
```

### Frontend
```bash
cd frontend
npm install html5-qrcode
```

## Configuration

No additional configuration required. The system:
- Uses existing MongoDB connection
- Uses existing email configuration (SMTP)
- Uses existing API base URL from environment

## Future Enhancements

1. **Coordinator Authentication**: Add login for coordinators
2. **Verification History**: Track which coordinator verified each booking
3. **Offline Mode**: Cache verifications when network unavailable
4. **Multi-camera Support**: Allow selection of specific camera
5. **Print QR Codes**: Bulk print QR codes for multiple bookings
6. **Push Notifications**: Alert users when checked in
7. **Analytics Dashboard**: View verification statistics
8. **Export Verification Logs**: Download verification history

## Troubleshooting

### QR Code Not Generating
- Check backend logs for QR generation errors
- Verify `uuid` and `qrcode` packages are installed
- Ensure booking has approved status

### Scanner Not Starting
- Check camera permissions in browser
- Verify `html5-qrcode` package is installed
- Try different browser (Chrome recommended)
- Ensure HTTPS in production (required for camera access)

### Verification Fails
- Check network connectivity
- Verify backend is running
- Check `/api/verify/health` endpoint
- Review backend logs for errors

### QR Code Not in Email
- Verify QR generation succeeded (check logs)
- Check email HTML rendering
- Verify SMTP configuration
- Test with different email client

## Notes

- QR codes are generated only for **approved** bookings
- Verification allowed 30 minutes before scheduled start time
- Each scan increments verification counter
- QR codes remain valid throughout booking period
- No sensitive data exposed in QR code (only token)
- System maintains existing booking functionality without modifications
