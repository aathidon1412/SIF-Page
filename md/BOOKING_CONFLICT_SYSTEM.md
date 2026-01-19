# Booking Conflict Detection System

## Overview
The booking conflict detection system automatically identifies overlapping booking requests and provides administrators with comprehensive information to make informed decisions. When conflicts are detected, the system implements cascading logic to maintain data consistency.

## How It Works

### 1. Conflict Detection (Backend)
When a new booking is created, the system:
- Queries all existing bookings for the same item
- Checks for time overlaps using different logic for equipment vs. labs:
  - **Equipment**: Date-based overlap (any day overlap)
  - **Labs**: Timestamp-based overlap (specific time slots)
- Classifies conflicts into three types:
  - `exact_match`: Same dates/times
  - `fully_contained`: One booking completely within another
  - `partial_overlap`: Bookings overlap partially

**Location**: `backend/src/utils/conflictDetection.js`

### 2. Conflict Metadata Storage
When conflicts are detected, both bookings are updated:
```javascript
{
  hasConflict: true,
  conflictingBookings: [
    {
      bookingId: "xxx",
      userEmail: "user@example.com",
      userName: "John Doe",
      status: "pending",
      startDate: "2024-01-15",
      endDate: "2024-01-20",
      startTime: "09:00",
      endTime: "17:00",
      conflictType: "partial_overlap"
    }
  ]
}
```

**Location**: `backend/src/models/Booking.js`

### 3. Notification System
The system sends notifications to:
- **User**: Informed when their booking has conflicts
- **Admin**: Alerted to review conflicting bookings

**Email Templates**:
- Booking status changes (approved/declined/pending)
- Conflict alerts for users
- Admin conflict notifications with admin panel link

**Location**: `backend/src/utils/notifications.js`

### 4. Admin Panel UI
The admin panel provides visual indicators:

#### Statistics Dashboard
- **Active Conflicts** card shows count of pending bookings with conflicts
- Color-coded: Amber/orange to indicate warning status

#### Booking Request Cards
Each booking displays:
- **Conflict Badge**: Shows "CONFLICT (n)" with warning icon
- **Conflict Details Section**: 
  - Warning message about cascading effects
  - List of all conflicting bookings with:
    - User information (name, email)
    - Booking dates/times
    - Current status
    - Overlap type
- **Enhanced Approve Button**: 
  - Changes to amber color when conflicts exist
  - Shows warning icon
  - Text changes to "Approve & Auto-Decline Conflicts"
  - Confirmation dialog warns about cascading effects

**Location**: `frontend/src/pages/Admin.tsx`

## Cascading Logic

### When Approving a Booking with Conflicts
1. Admin clicks "Approve & Auto-Decline Conflicts"
2. Confirmation dialog shows how many pending bookings will be declined
3. If confirmed:
   - The selected booking is approved
   - All conflicting **pending** bookings are automatically declined
   - Users of declined bookings receive email notifications
   - Admin receives summary of declined bookings

**Code**: `backend/src/routes/bookings.js` (PATCH /:id)

### When Declining a Previously Approved Booking
1. Booking status changes from "approved" to "declined"
2. System marks it as `declinedAfterApproval: true`
3. System checks all bookings that were in its conflict list
4. Admin receives notification about bookings that may now be approvable

**Code**: `backend/src/routes/bookings.js` (PATCH /:id)

## API Endpoints

### POST /api/bookings
Creates a new booking and detects conflicts.

**Conflict Detection Flow**:
```javascript
1. Validate booking data (dates, times, business hours)
2. Find all existing bookings for the same item
3. Check each booking for time overlap
4. If conflicts found:
   - Set hasConflict = true
   - Populate conflictingBookings array
   - Update conflicting bookings bidirectionally
   - Send notifications to user and admin
5. Save booking with conflict metadata
```

### PATCH /api/bookings/:id
Updates booking status with cascading effects.

**Status Change Flow**:
```javascript
1. Get current booking and save old status
2. Update status and metadata
3. Send user notification
4. If status = "approved" and hasConflict:
   - Find all conflicting pending bookings
   - Auto-decline them
   - Notify users
   - Remove from conflict lists
5. If status = "declined" and wasApprovedBefore:
   - Check conflicting bookings
   - Notify admin of newly available slots
6. Return updated booking
```

## TypeScript Types

### ConflictingBooking Interface
```typescript
interface ConflictingBooking {
  bookingId: string;
  userEmail: string;
  userName?: string;
  status: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  conflictType: 'exact_match' | 'fully_contained' | 'partial_overlap';
}
```

### Enhanced BookingRequest
```typescript
interface BookingRequest {
  // ... existing fields
  hasConflict?: boolean;
  conflictingBookings?: ConflictingBooking[];
  wasApprovedBefore?: boolean;
  declinedAfterApproval?: boolean;
}
```

**Location**: `frontend/src/types/booking.ts`

## Security & Validation

### Multi-Layer Protection
1. **Frontend Validation**: Immediate UX feedback
2. **Backend Route Validation**: First line of server defense
3. **Mongoose Schema Validators**: Database-level constraints
4. **Pre-save Hooks**: Final validation before database write
5. **Security Middleware**: Rate limiting and logging

**Location**: `backend/src/middleware/bookingSecurity.js`

## Testing Scenarios

### Scenario 1: Creating Overlapping Equipment Bookings
```
Booking A: Microscope, Jan 15-20
Booking B: Microscope, Jan 18-22 (overlaps days 18-20)

Expected:
- Both marked as hasConflict: true
- conflictingBookings arrays populated
- Admin notified
- Users notified
```

### Scenario 2: Approving with Conflicts
```
Pending bookings:
- Booking A: Microscope, Jan 15-20 (has conflicts)
- Booking B: Microscope, Jan 18-22 (pending, conflicts with A)
- Booking C: Microscope, Jan 19-21 (pending, conflicts with A)

Admin approves Booking A:

Expected:
- Booking A: status = "approved"
- Booking B: status = "declined" (auto)
- Booking C: status = "declined" (auto)
- Users B and C receive decline emails
- Admin receives summary
```

### Scenario 3: Revoking Approved Booking
```
Current state:
- Booking A: approved
- Booking B: declined (was auto-declined when A was approved)

Admin declines Booking A:

Expected:
- Booking A: status = "declined", declinedAfterApproval = true
- Admin notified that Booking B may now be approvable
- Booking B can be manually approved if desired
```

### Scenario 4: Lab Time Conflicts
```
Booking A: Computer Lab, Jan 15 09:00-12:00
Booking B: Computer Lab, Jan 15 11:00-14:00 (overlaps 11:00-12:00)

Expected:
- Partial overlap detected
- Both marked with conflicts
- conflictType: "partial_overlap"
```

## Database Schema

### Conflict-Related Fields
```javascript
const bookingSchema = new mongoose.Schema({
  // Conflict detection
  hasConflict: {
    type: Boolean,
    default: false
  },
  conflictingBookings: [{
    bookingId: String,
    userEmail: String,
    userName: String,
    status: String,
    startDate: Date,
    endDate: Date,
    startTime: String,
    endTime: String,
    conflictType: {
      type: String,
      enum: ['exact_match', 'fully_contained', 'partial_overlap']
    }
  }],
  
  // Status tracking
  previousStatus: String,
  wasApprovedBefore: Boolean,
  declinedAfterApproval: Boolean,
  
  // Notification tracking
  notificationSent: Boolean,
  lastNotificationAt: Date,
  notificationHistory: [{
    type: String,
    sentAt: Date,
    recipient: String
  }]
});
```

## Future Enhancements

### Phase 1 (Current)
- ✅ Conflict detection on creation
- ✅ Visual indicators in admin panel
- ✅ Cascading approval/decline logic
- ✅ Email notification system (console.log placeholders)

### Phase 2 (Planned)
- [ ] Real email integration (Nodemailer/SendGrid)
- [ ] User-facing conflict warnings before submission
- [ ] Automatic conflict resolution suggestions
- [ ] Calendar view showing all bookings and conflicts
- [ ] Conflict history and analytics

### Phase 3 (Future)
- [ ] Machine learning for optimal scheduling
- [ ] Priority-based conflict resolution
- [ ] Waiting list for declined bookings
- [ ] SMS/push notifications

## Troubleshooting

### Conflicts Not Detected
1. Check if items have matching `itemId`
2. Verify date/time formats are correct
3. Check console logs for conflictDetection errors
4. Ensure MongoDB indexes are created

### Notifications Not Sent
1. Check console logs (currently using console.log)
2. Verify email templates in `notifications.js`
3. Check notification history in booking document

### Cascading Logic Not Working
1. Verify booking status before approval
2. Check if conflictingBookings array is populated
3. Review PATCH endpoint logs
4. Ensure frontend sends correct status update

## File Structure
```
backend/
├── src/
│   ├── models/
│   │   └── Booking.js          # Enhanced with conflict fields
│   ├── routes/
│   │   └── bookings.js         # Conflict detection & cascading logic
│   ├── utils/
│   │   ├── conflictDetection.js # Core overlap detection
│   │   └── notifications.js    # Email notification system
│   └── middleware/
│       └── bookingSecurity.js  # Security & rate limiting

frontend/
├── src/
│   ├── pages/
│   │   └── Admin.tsx           # Conflict UI indicators
│   ├── types/
│   │   └── booking.ts          # TypeScript interfaces
│   └── services/
│       └── api.ts              # API communication
```

## Support
For issues or questions:
1. Check console logs in browser and server
2. Review notification history in MongoDB
3. Verify all validation layers are active
4. Contact system administrator
