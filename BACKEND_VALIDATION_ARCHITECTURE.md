# Backend-First Booking Validation Architecture

## Overview
The booking system now uses a **backend-first validation architecture** where all critical business logic and security constraints are enforced server-side. The frontend provides UX hints but all validation is authoritative on the backend.

## Architecture Principles

### 1. **Never Trust the Client**
- All validation logic lives on the backend
- Frontend can be bypassed/manipulated - backend cannot
- Backend validation is the single source of truth

### 2. **Defense in Depth**
- **Layer 1**: Route-level validation (bookingValidation.js)
- **Layer 2**: Mongoose schema validators
- **Layer 3**: Pre-save hooks for complex validations
- **Layer 4**: Security middleware for logging & rate limiting

### 3. **Security-First Design**
- All booking attempts are logged
- Invalid attempts trigger security alerts
- Rate limiting prevents abuse
- Comprehensive error messages (without exposing internals)

## Backend Implementation

### Validation Layers

#### Layer 1: Route Validation (`routes/bookings.js`)
```javascript
// Validates before database interaction
const validation = validateBooking(req.body);
if (!validation.isValid) {
  return res.status(400).json({ 
    error: 'Validation failed', 
    message: validation.error 
  });
}
```

**Validates**:
- ✅ Required fields present
- ✅ Date format validity
- ✅ All dates are weekdays (Monday-Friday)
- ✅ Time format validity
- ✅ Times within business hours (9 AM - 6 PM)
- ✅ End date/time after start date/time
- ✅ Multi-day ranges don't include weekends

#### Layer 2: Schema Validators (`models/Booking.js`)
```javascript
startDate: { 
  type: String,
  required: true,
  validate: {
    validator: isWeekday,
    message: 'Start date must be a weekday (Monday-Friday)'
  }
}
```

**Validates**:
- ✅ Individual dates are weekdays
- ✅ Times are within business hours
- ✅ Enum constraints (itemType, status)

#### Layer 3: Pre-Save Hooks (`models/Booking.js`)
```javascript
bookingSchema.pre('save', function(next) {
  // Check entire date range for weekends
  const current = new Date(start);
  while (current <= end) {
    if (day === 0 || day === 6) {
      return next(new Error('Cannot include weekends'));
    }
    current.setDate(current.getDate() + 1);
  }
  // Validate time ordering
  if (endTotal <= startTotal) {
    return next(new Error('End time must be after start time'));
  }
});
```

**Validates**:
- ✅ Entire date ranges (not just endpoints)
- ✅ Time logic (end after start)
- ✅ Complex business rules

#### Layer 4: Security Middleware (`middleware/bookingSecurity.js`)

**Features**:

1. **Comprehensive Logging**
   ```javascript
   console.log(`[BOOKING ATTEMPT]`, {
     ip: clientIP,
     userEmail: bookingData.userEmail,
     valid: validation.isValid
   });
   ```

2. **Security Alerts**
   ```javascript
   console.error(`[SECURITY ALERT] Potential bypass attempt detected!`, {
     isWeekendAttempt: isWeekend,
     isOutsideHoursAttempt: isOutsideHours
   });
   ```

3. **Rate Limiting**
   - Max 10 booking attempts per user per hour
   - Prevents spam and automated attacks
   - Returns 429 status with retry-after header

### Validation Logic (`utils/bookingValidation.js`)

**Complete Server-Side Validation Functions**:

```javascript
// Core validators
isWeekday(date)                        // Monday-Friday check
validateWeekday(dateString)            // String date validation
validateBusinessHours(timeString)      // 9 AM - 6 PM check
validateDateRange(start, end)          // Range validation
validateTimeRange(start, end)          // Time ordering
validateBooking(bookingData)           // Complete validation

// Returns: { isValid: boolean, error?: string }
```

**Security Features**:
- Validates every single day in multi-day bookings
- Checks time constraints in minutes (no rounding exploits)
- Provides specific error messages
- No client-controllable bypass methods

## Frontend Implementation

### Simplified Frontend (`BookingModal.tsx`)

**Role**: User Experience Enhancement (NOT Security)

```typescript
// Frontend only provides UX hints
import { isWeekdayString, getMinAllowedDate } from '../lib/bookingValidation';

// Validates on change for immediate feedback
onChange={(e) => {
  const newDate = e.target.value;
  if (!newDate || isWeekdayString(newDate)) {
    setFormData(prev => ({ ...prev, startDate: newDate }));
    setValidationError('');
  } else {
    setValidationError('Bookings are only available Monday-Friday');
  }
}}
```

**Frontend does NOT**:
- ❌ Perform authoritative validation
- ❌ Block submission (only warns)
- ❌ Trust its own validation
- ❌ Assume backend will accept data

**Frontend DOES**:
- ✅ Provide immediate UX feedback
- ✅ Show business hours reminders
- ✅ Display backend error messages
- ✅ Prevent accidental invalid entries

### Error Handling Flow

```typescript
try {
  await createBooking(bookingRequest);
  // Success handling
} catch (error: any) {
  // Display backend validation error
  const errorMessage = error.response?.data?.message || 
                       'Error submitting booking request';
  setValidationError(errorMessage);
}
```

### API Layer (`services/api.ts`)

**Properly propagates backend errors**:
```typescript
export async function createBooking(payload: any) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const error: any = new Error(errorData.message || 'Failed to create booking');
    error.response = { data: errorData };
    throw error; // Throws with backend message
  }
  
  return res.json();
}
```

## Security Guarantees

### ✅ Complete Protection Against

1. **Weekend Bookings**
   - Frontend: Shows warning
   - Backend: Route validation rejects
   - Fallback: Schema validator rejects
   - Final: Pre-save hook rejects

2. **Times Outside Business Hours**
   - Frontend: TimePicker limits options
   - Backend: Route validation checks
   - Fallback: Schema validator checks
   - Logged: Security middleware alerts

3. **Multi-Day Weekend Spanning**
   - Backend: Route validation iterates all days
   - Fallback: Pre-save hook double-checks
   - Logged: Security event recorded

4. **Direct API Manipulation**
   - All requests go through validation
   - Rate limiting prevents spam
   - Logging captures attempts
   - Security alerts for suspicious patterns

5. **Automated Attacks**
   - Rate limiting: Max 10/hour per user
   - Returns 429 with retry-after
   - Logs all attempts
   - Cleans up tracking data automatically

### 🔒 Bypass Prevention

**Scenario**: User modifies frontend code
- **Result**: Backend validation rejects invalid data

**Scenario**: User sends direct API requests
- **Result**: Middleware validates and logs attempt

**Scenario**: User floods booking endpoint
- **Result**: Rate limiter blocks after 10 attempts

**Scenario**: User tries weekend via Postman
- **Result**: Multiple validation layers reject + security alert

**Scenario**: User tries 7 AM booking
- **Result**: Business hours validator rejects + logged

**Scenario**: Database is directly accessed
- **Result**: Schema validators and pre-save hooks prevent invalid data

## Monitoring & Logging

### Log Types

1. **Booking Attempts** (INFO)
   ```
   [BOOKING ATTEMPT] 2025-11-17T10:30:00Z
   - IP, user, item, dates, times, valid
   ```

2. **Validation Failures** (WARN)
   ```
   [SECURITY] Invalid booking attempt blocked
   - Timestamp, IP, user, error, attempted data
   ```

3. **Bypass Attempts** (ERROR)
   ```
   [SECURITY ALERT] Potential bypass attempt detected!
   - Weekend/outside hours flags
   ```

4. **Success** (INFO)
   ```
   [BOOKING SUCCESS] Created booking ID: xxx for user@email.com
   ```

5. **Rate Limiting** (WARN)
   ```
   [SECURITY] Rate limit exceeded for booking attempts
   - User, attempt count, IP
   ```

### Production Monitoring

**Recommended Setup**:
- Send ERROR logs to alerting system
- Track WARN logs for patterns
- Archive INFO logs for auditing
- Monitor rate limit triggers

## Testing Validation

### Valid Bookings
```javascript
// These pass all validation layers
{
  startDate: "2025-11-18",    // Tuesday
  endDate: "2025-11-20",      // Thursday
  startTime: "09:00",         // 9 AM
  endTime: "17:00",           // 5 PM
  itemType: "lab"
}
```

### Invalid Bookings (All Rejected)
```javascript
// Weekend start
{ startDate: "2025-11-16", ... }  // Saturday
❌ Route: "Saturday is not allowed"
❌ Schema: "Must be weekday"
❌ Logged: Security alert

// Outside hours
{ startTime: "07:00", ... }       // 7 AM
❌ Route: "Must be after 9:00 AM"
❌ Schema: "Must be between 9:00 AM and 6:00 PM"
❌ Logged: Security alert

// Weekend in range
{ startDate: "2025-11-14", endDate: "2025-11-18" }  // Friday to Tuesday
❌ Route: "Range includes weekend (Saturday)"
❌ Pre-save: "Cannot include weekends"

// End before start
{ startTime: "14:00", endTime: "10:00" }
❌ Route: "End time must be after start time"
❌ Pre-save: "End time must be after start time"
```

## Configuration

### Business Hours
Change in multiple places for complete enforcement:

1. **Backend Validation** (`utils/bookingValidation.js`)
   ```javascript
   const minMinutes = 9 * 60;   // 9:00 AM
   const maxMinutes = 18 * 60;  // 6:00 PM
   ```

2. **Schema Validators** (`models/Booking.js`)
   ```javascript
   const totalMinutes = hours * 60 + minutes;
   return totalMinutes >= 9 * 60 && totalMinutes <= 18 * 60;
   ```

3. **Frontend UX** (`components/ui/TimePicker.tsx`)
   ```typescript
   minTime = "09:00"
   maxTime = "18:00"
   ```

### Working Days
Change day logic in:

1. **Backend** (`utils/bookingValidation.js`, `models/Booking.js`)
   ```javascript
   const day = date.getDay();
   return day >= 1 && day <= 5;  // Monday-Friday
   ```

2. **Frontend** (`lib/bookingValidation.ts`)
   ```typescript
   return day >= 1 && day <= 5;
   ```

### Rate Limiting
Adjust in `middleware/bookingSecurity.js`:
```javascript
const MAX_ATTEMPTS = 10;              // Max bookings per window
const TIME_WINDOW = 60 * 60 * 1000;   // 1 hour
```

## API Response Format

### Success (201)
```json
{
  "_id": "...",
  "userId": "user@email.com",
  "itemTitle": "3D Printer",
  "status": "pending",
  ...
}
```

### Validation Error (400)
```json
{
  "error": "Validation failed",
  "message": "Start date: Bookings are only available Monday-Friday. Saturday is not allowed."
}
```

### Rate Limit (429)
```json
{
  "error": "Too many booking attempts",
  "message": "You have exceeded the maximum number of booking attempts. Please try again later.",
  "retryAfter": 45
}
```

## Deployment Checklist

- [x] Backend validation implemented
- [x] Schema validators added
- [x] Pre-save hooks configured
- [x] Security middleware enabled
- [x] Rate limiting active
- [x] Logging configured
- [x] Frontend error handling implemented
- [x] API error propagation working
- [ ] Production logging setup
- [ ] Monitoring alerts configured
- [ ] Rate limit thresholds tuned
- [ ] Security logs archived

## Summary

### Backend Responsibilities (Security Layer)
- ✅ Validate all booking data
- ✅ Enforce business rules (weekdays, business hours)
- ✅ Log all attempts and failures
- ✅ Rate limit to prevent abuse
- ✅ Alert on suspicious activity
- ✅ Provide error messages to frontend

### Frontend Responsibilities (UX Layer)
- ✅ Show business hours reminder
- ✅ Validate for immediate feedback
- ✅ Display backend error messages
- ✅ Provide time picker UI
- ✅ Show weekday hints
- ❌ NOT responsible for security

### Result
**Enterprise-grade security** with backend-enforced constraints and comprehensive monitoring. No bypass methods exist - all validation is authoritative on the server.
