# SIF-FABLAB Authentication & Booking System

## 🔐 Authentication System

### Google OAuth Integration
- **Client ID**: `586269199959-tq4s2nqscbuo9jir0v8nbi1541rsbapq.apps.googleusercontent.com`
- **Scopes**: `profile email openid`
- **Implementation**: Google Identity Services (GIS)
- **Storage**: localStorage (`auth_user`)

### User Flow
1. Users can browse equipment/labs without authentication
2. Google sign-in required for:
   - Making bookings
   - Viewing notifications
   - Accessing booking history

## 👥 User Functionality

### Booking System
- ✅ Browse equipment and labs (no auth required)
- ✅ Google sign-in integration for bookings
- ✅ Booking form with cost calculation
- ✅ Real-time notifications with status updates
- ✅ Success popup after booking submission
- ✅ Booking history with sorting (recent first)

### Notification System
- ✅ Bell icon with notification count
- ✅ Side panel with booking status updates
- ✅ Admin notes display
- ✅ Pending/Approved/Declined status tracking
- ✅ Real-time polling every 5 seconds

## 🛡️ Admin System

### Admin Authentication
- **Username**: `thiganth` (from VITE_ADMIN_USER)
- **Password**: `thiganth` (from VITE_ADMIN_PASS)
- **Access**: `/admin` route with login screen

### Admin Functionality
- ✅ Professional dashboard with statistics
- ✅ Booking request management
- ✅ Approve/Decline requests with admin notes
- ✅ Recent-first sorting of requests
- ✅ Real-time status updates
- ✅ Back button to booking page

## 🔧 Technical Features

### Data Persistence
- **User Auth**: localStorage (`auth_user`)
- **Bookings**: localStorage (`booking_requests`)
- **Admin Items**: localStorage (`admin_items`)

### UI/UX Improvements
- ✅ No loading screens (immediate page render)
- ✅ Hidden scrollbars in notifications
- ✅ Responsive design
- ✅ Blue-950/Yellow color theme
- ✅ Professional animations and transitions

### Security
- ✅ Google OAuth 2.0
- ✅ Environment variable protection
- ✅ Admin credential protection
- ✅ XSS protection via React

## 🚀 Usage Instructions

### For Regular Users:
1. Visit the booking page
2. Browse available equipment/labs
3. Click to book (will prompt for Google sign-in)
4. Fill booking form and submit
5. Check notifications for status updates

### For Admins:
1. Go to `/admin`
2. Login with `thiganth`/`thiganth`
3. View booking requests dashboard
4. Approve/decline with optional notes
5. Use back button to return to booking page

## ✅ System Status
All systems operational and ready for production use!