# QR Booking Verification - Quick Start Guide

## Installation

### Backend Dependencies
```bash
cd backend
npm install
# This will install uuid (v13.0.0) and qrcode (v1.5.4)
```

### Frontend Dependencies
```bash
cd frontend
npm install
# This will install html5-qrcode (v2.3.8)
```

## Running the System

### 1. Start Backend
```bash
cd backend
npm run dev
# Server runs on http://localhost:5001
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

## Testing the Feature

### Step 1: Create and Approve a Booking
1. Go to `http://localhost:5173/#/booking`
2. Create a new booking for today or tomorrow
3. Login to admin panel: `http://localhost:5173/#/admin`
4. Approve the booking
5. Check backend console logs - you should see:
   ```
   [QR CODE] Generated for booking <bookingId>
   [EMAIL] QR code included in confirmation email
   ```

### Step 2: View the QR Code
The QR code is embedded in the confirmation email. If using console logging:
- Check backend console for email HTML output
- QR code is a base64 data URL image

### Step 3: Test Verification
1. Navigate to `http://localhost:5173/#/coordinator`
2. Click "Start Scanner"
3. Allow camera permissions
4. Display the QR code (from email or saved image) to the camera
5. System will automatically scan and verify
6. View booking details on screen

### Quick Test Using Token Directly
```bash
# Get a booking token from MongoDB or backend logs
# Test verification API directly:

curl -X POST http://localhost:5001/api/verify/booking \
  -H "Content-Type: application/json" \
  -d '{"token": "YOUR_TOKEN_HERE"}'
```

## Key URLs

- **Booking Page**: `http://localhost:5173/#/booking`
- **Admin Panel**: `http://localhost:5173/#/admin`
- **Coordinator Scanner**: `http://localhost:5173/#/coordinator`
- **Verification API**: `http://localhost:5001/api/verify/booking`
- **API Health Check**: `http://localhost:5001/api/verify/health`

## Verification States

| Status | Description | When It Occurs |
|--------|-------------|----------------|
| ✓ Valid | Booking verified | Approved booking within valid time window |
| ✗ Invalid | Token not found | QR code doesn't exist in database |
| ⏰ Expired | Booking expired | End time has passed |
| ⏳ Not Yet Valid | Too early | More than 30 min before start time |
| ⚠️ Not Approved | Not approved | Booking is pending or declined |
| ❌ Error | Server error | Network or backend issue |

## Camera Requirements

### For Testing Locally
- **Browser**: Chrome/Edge recommended (best camera support)
- **HTTPS**: Not required for localhost
- **Permissions**: Allow camera access when prompted
- **Camera**: Any webcam or mobile camera

### For Production
- **HTTPS Required**: Modern browsers require HTTPS for camera access
- **Certificate**: Valid SSL certificate needed
- **Mobile**: Works on iOS Safari and Android Chrome

## Email Configuration

QR codes are automatically embedded in approval emails. Ensure your `.env` has:
```env
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
SMTP_FROM=noreply@yourdomain.com
```

If SMTP is not configured, emails are logged to console (see backend logs).

## Troubleshooting

### "Scanner won't start"
- Check camera permissions in browser settings
- Try Chrome/Edge instead of Firefox/Safari
- Ensure no other app is using the camera
- Try on a different device

### "QR code not generating"
- Verify `uuid` and `qrcode` packages are installed
- Check backend logs for errors
- Ensure booking status is "approved"

### "Verification fails"
- Check backend is running on port 5001
- Verify network connectivity
- Test API health: `curl http://localhost:5001/api/verify/health`
- Check browser console for errors

### "QR code not in email"
- Check backend logs during booking approval
- Verify QR generation succeeded
- Check email HTML rendering in your email client

## Development Tips

### View QR Codes Easily
Save the QR code from backend logs or database:
```javascript
// In MongoDB, find booking
db.bookings.findOne({ status: 'approved' })

// Copy qrCodeData field (starts with data:image/png;base64,...)
// Paste into browser address bar to view image
```

### Test Different Scenarios
```javascript
// Modify booking dates in MongoDB for testing:

// Test expired booking:
db.bookings.updateOne(
  { _id: ObjectId("...") },
  { $set: { endDate: "01/02/2026", endTime: "12:00" } }
)

// Test future booking:
db.bookings.updateOne(
  { _id: ObjectId("...") },
  { $set: { startDate: "10/02/2026", startTime: "09:00" } }
)

// Test declined booking:
db.bookings.updateOne(
  { _id: ObjectId("...") },
  { $set: { status: "declined" } }
)
```

### Debug Mode
Add console logs in coordinator page:
```typescript
// In Coordinator.tsx onScanSuccess:
console.log('Scanned token:', decodedText);
console.log('Verification result:', data);
```

## Production Deployment

### Backend
1. Install dependencies: `npm install`
2. Set environment variables (MongoDB, SMTP)
3. Deploy to server (Heroku, Railway, AWS, etc.)
4. Ensure CORS allows frontend domain

### Frontend
1. Install dependencies: `npm install`
2. Build: `npm run build`
3. Set `VITE_API_BASE_URL` to production backend URL
4. Deploy to hosting (Vercel, Netlify, etc.)
5. **Ensure HTTPS** (required for camera access)

### Post-Deployment
1. Test coordinator page with HTTPS
2. Verify camera permissions work
3. Test full flow: booking → approval → email → scan
4. Monitor verification API logs

## Feature Status

✅ All components implemented:
- Backend QR generation
- Email integration
- Verification API
- Frontend scanner
- Routing
- Documentation

Ready for testing and deployment!

## Support

For issues or questions:
1. Check backend logs for errors
2. Review [QR_BOOKING_VERIFICATION_SYSTEM.md](./QR_BOOKING_VERIFICATION_SYSTEM.md)
3. Test API endpoints directly with curl/Postman
4. Verify MongoDB has booking records with tokens
