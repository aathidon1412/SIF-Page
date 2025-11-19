# Backup and Restore System Documentation

## Overview

The SIF-FAB LAB booking system now includes a comprehensive backup and restore functionality that allows administrators to create complete snapshots of system data and restore from them with full relational integrity.

## Features

### 1. Complete Data Backup
- **Lab Data**: All lab items with their configurations
- **Equipment Data**: All equipment items with pricing and descriptions
- **Booking Requests**: All booking requests regardless of status (pending, approved, declined)
- **Metadata**: Backup timestamps, statistics, and version information

### 2. Relational Integrity
- Validates all item-to-booking relationships
- Ensures no orphaned bookings exist
- Maintains referential integrity across restore operations
- Checks for duplicate IDs and data consistency

### 3. Safe Restore Operations
- **Atomic Transactions**: Uses MongoDB transactions to ensure all-or-nothing restore
- **Pre-validation**: Validates backup file before any data modification
- **Full Replacement**: Safely overwrites all existing data
- **Integrity Checks**: Verifies relational mappings before restore
- **Rollback**: Automatically rolls back on any error

## Backend Implementation

### Utility Functions (`backend/src/utils/backup.js`)

#### `createBackup()`
Creates a complete backup of all system data.

**Returns:**
```javascript
{
  version: '1.0',
  timestamp: '2025-11-18T...',
  stats: {
    totalItems: 10,
    labs: 3,
    equipment: 7,
    totalBookings: 25,
    pendingBookings: 5,
    approvedBookings: 15,
    declinedBookings: 5
  },
  data: {
    items: [...],      // All Item documents
    bookings: [...]    // All Booking documents
  }
}
```

#### `restoreBackup(backup)`
Restores system data from a backup object.

**Parameters:**
- `backup`: Backup object (must be valid format)

**Process:**
1. Validates backup structure and integrity
2. Starts MongoDB transaction
3. Deletes all existing items and bookings
4. Restores items with original or new IDs
5. Restores bookings with correct item references
6. Commits transaction (or rolls back on error)

**Returns:**
```javascript
{
  success: true,
  timestamp: '2025-11-18T...',
  backupTimestamp: '2025-11-17T...',
  restored: {
    items: 10,
    labs: 3,
    equipment: 7,
    bookings: 25,
    pendingBookings: 5,
    approvedBookings: 15,
    declinedBookings: 5
  }
}
```

#### `verifyBackupIntegrity(backup)`
Validates backup without performing restore.

**Returns:**
```javascript
{
  valid: true,
  errors: [],
  warnings: [
    'Booking 3 references missing item abc123'
  ],
  stats: { ... }
}
```

### API Endpoints

All endpoints require admin authentication via `adminAuth` middleware.

#### `POST /api/admin/backup`
Creates and downloads a backup.

**Headers:**
- `Authorization: Bearer <admin_token>`

**Response:**
- Downloads JSON file: `backup-<timestamp>.json`
- Content-Type: `application/json`

#### `POST /api/admin/restore`
Restores data from backup.

**Headers:**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**Body:**
```json
{
  "version": "1.0",
  "timestamp": "...",
  "stats": { ... },
  "data": {
    "items": [...],
    "bookings": [...]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "System data restored successfully",
  "timestamp": "...",
  "backupTimestamp": "...",
  "restored": { ... },
  "warnings": [...]
}
```

#### `POST /api/admin/backup/verify`
Verifies backup integrity without restoring.

**Headers:**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**Body:** Same as restore endpoint

**Response:**
```json
{
  "valid": true,
  "errors": [],
  "warnings": [],
  "stats": { ... },
  "message": "Backup is valid and ready to restore"
}
```

## Frontend Implementation

### Admin Panel UI

Two new buttons added to the Items Management tab:

1. **Backup Button** (Purple)
   - Creates backup and downloads JSON file
   - Shows success toast with statistics
   - Filename: `backup-<timestamp>.json`

2. **Restore Button** (Orange)
   - Opens file picker for JSON backup files
   - Validates backup before restore
   - Shows warnings if any
   - Requires double confirmation
   - Reloads all data after successful restore

### API Service Functions (`frontend/src/services/api.ts`)

#### `createBackup(token)`
```typescript
const backupData = await createBackup(token);
// Returns backup object
```

#### `restoreBackup(token, backupData)`
```typescript
const result = await restoreBackup(token, backupData);
// Returns restore result with statistics
```

#### `verifyBackup(token, backupData)`
```typescript
const verification = await verifyBackup(token, backupData);
// Returns validation result
```

### User Experience

#### Creating a Backup
1. Navigate to Admin Panel → Items Management tab
2. Click **"Backup"** button
3. Confirm action in dialog
4. JSON file downloads automatically
5. Success message shows statistics

#### Restoring from Backup
1. Navigate to Admin Panel → Items Management tab
2. Click **"Restore"** button
3. Select backup JSON file from computer
4. System validates backup and shows warnings if any
5. Confirm restore (shows detailed statistics)
6. Second confirmation required
7. System performs restore
8. Success message and automatic data reload

## Safety Features

### Validation Checks
- ✅ Backup version compatibility
- ✅ Required fields presence
- ✅ Data type validation
- ✅ Relational integrity (item-booking mappings)
- ✅ Duplicate ID detection

### User Confirmations
- Initial backup confirmation
- Backup file selection
- Warning display (if any)
- Primary restore confirmation with statistics
- Secondary final confirmation
- Clear warning messages about data deletion

### Error Handling
- Invalid backup format → Detailed error message
- Missing required fields → Specific field errors
- Relational integrity issues → Warning display
- Transaction failures → Automatic rollback
- Network errors → User-friendly messages

### Transaction Safety
- All restore operations use MongoDB transactions
- Atomic all-or-nothing behavior
- Automatic rollback on any error
- No partial data corruption possible

## File Format

Backup files are standard JSON with the following structure:

```json
{
  "version": "1.0",
  "timestamp": "2025-11-18T10:30:00.000Z",
  "stats": {
    "totalItems": 10,
    "labs": 3,
    "equipment": 7,
    "totalBookings": 25,
    "pendingBookings": 5,
    "approvedBookings": 15,
    "declinedBookings": 5
  },
  "data": {
    "items": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "3D Printer",
        "type": "equipment",
        "desc": "High precision 3D printer",
        "pricePerDay": 50,
        "image": "...",
        "available": true,
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "bookings": [
      {
        "_id": "507f191e810c19729de860ea",
        "userId": "user@example.com",
        "userEmail": "user@example.com",
        "userName": "John Doe",
        "itemId": "507f1f77bcf86cd799439011",
        "itemTitle": "3D Printer",
        "itemType": "equipment",
        "startDate": "2025-11-20",
        "endDate": "2025-11-22",
        "status": "approved",
        "submittedAt": "2025-11-18T10:00:00.000Z"
      }
    ]
  }
}
```

## Best Practices

### When to Create Backups
- ✅ Before major system updates
- ✅ Before bulk data changes
- ✅ Regularly as part of maintenance routine
- ✅ Before testing new features
- ✅ After important data entry sessions

### Backup Storage
- 📁 Store backups in secure location
- 📁 Use version control for backup files
- 📁 Keep multiple backup versions
- 📁 Document backup timestamps and purposes
- 📁 Test restore process periodically

### Security Considerations
- 🔒 Only admins can create/restore backups
- 🔒 Authentication required for all operations
- 🔒 Sensitive data included in backups (secure storage required)
- 🔒 Validate backup source before restore
- 🔒 Review backup contents before restore

## Troubleshooting

### "Invalid backup format" Error
- Ensure JSON file is valid
- Check file wasn't corrupted during transfer
- Verify backup was created by this system

### "Relational integrity issue" Warning
- Some bookings reference deleted items
- Usually safe to restore with warnings
- Review warnings before proceeding

### Restore Failed
- Check MongoDB connection
- Ensure sufficient disk space
- Verify admin token is valid
- Check server logs for details

### Partial Restore
- Should never happen due to transactions
- If data seems incomplete, restore again
- Contact system administrator

## Logging

Backup and restore operations are logged in the admin session logs:

```javascript
{
  type: 'backup',
  timestamp: '2025-11-18T10:30:00.000Z',
  stats: { totalItems: 10, totalBookings: 25, ... }
}

{
  type: 'restore',
  timestamp: '2025-11-18T11:00:00.000Z',
  backupTimestamp: '2025-11-18T10:30:00.000Z',
  restored: { items: 10, bookings: 25, ... }
}
```

## Technical Notes

- Uses Mongoose `.lean()` for efficient data retrieval
- MongoDB transactions ensure data consistency
- Disables validation during restore to preserve all data
- Handles ObjectId conversion automatically
- Preserves all booking statuses and metadata
- Maintains all relational references

## Future Enhancements

Potential improvements for future versions:
- Scheduled automatic backups
- Incremental backups
- Cloud storage integration
- Backup encryption
- Backup comparison tools
- Selective restore (items only, bookings only)
- Backup retention policies
