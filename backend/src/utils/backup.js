import { Item } from '../models/Item.js';
import { Booking } from '../models/Booking.js';
import mongoose from 'mongoose';

/**
 * Creates a complete backup of all system data with full relational integrity
 * @returns {Promise<Object>} Backup object containing all data and metadata
 */
export async function createBackup() {
  try {
    // Fetch all items (labs and equipment)
    const items = await Item.find({}).lean();
    
    // Fetch all bookings (all statuses)
    const bookings = await Booking.find({}).lean();
    
    // Create backup metadata
    const backup = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      stats: {
        totalItems: items.length,
        labs: items.filter(i => i.type === 'lab').length,
        equipment: items.filter(i => i.type === 'equipment').length,
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        approvedBookings: bookings.filter(b => b.status === 'approved').length,
        declinedBookings: bookings.filter(b => b.status === 'declined').length
      },
      data: {
        items: items,
        bookings: bookings
      }
    };
    
    // Validate relational integrity before returning backup
    const itemIds = new Set(items.map(i => i._id.toString()));
    const orphanedBookings = bookings.filter(b => b.itemId && !itemIds.has(b.itemId.toString()));
    
    if (orphanedBookings.length > 0) {
      console.warn(`Warning: ${orphanedBookings.length} bookings reference non-existent items`);
    }
    
    return backup;
  } catch (error) {
    console.error('Backup creation failed:', error);
    throw new Error(`Backup failed: ${error.message}`);
  }
}

/**
 * Validates backup data structure and integrity
 * @param {Object} backup - Backup object to validate
 * @returns {Object} Validation result with valid flag and errors array
 */
function validateBackup(backup) {
  const errors = [];
  
  // Check backup structure
  if (!backup || typeof backup !== 'object') {
    errors.push('Invalid backup format: backup must be an object');
    return { valid: false, errors };
  }
  
  if (!backup.version) {
    errors.push('Missing backup version');
  }
  
  if (!backup.timestamp) {
    errors.push('Missing backup timestamp');
  }
  
  if (!backup.data || typeof backup.data !== 'object') {
    errors.push('Invalid backup format: missing or invalid data property');
    return { valid: false, errors };
  }
  
  if (!Array.isArray(backup.data.items)) {
    errors.push('Invalid backup format: items must be an array');
  }
  
  if (!Array.isArray(backup.data.bookings)) {
    errors.push('Invalid backup format: bookings must be an array');
  }
  
  // Validate relational integrity
  const itemIds = new Set(backup.data.items.map(i => i._id?.toString() || i._id));
  const bookingsWithInvalidItems = backup.data.bookings.filter(b => {
    return b.itemId && !itemIds.has(b.itemId.toString());
  });
  
  if (bookingsWithInvalidItems.length > 0) {
    errors.push(`Relational integrity issue: ${bookingsWithInvalidItems.length} bookings reference non-existent items`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    stats: backup.stats
  };
}

/**
 * Restores system data from a backup with full data replacement
 * Ensures atomicity - either all data is restored or none
 * @param {Object} backup - Backup object containing data to restore
 * @returns {Promise<Object>} Restoration result with statistics
 */
export async function restoreBackup(backup) {
  // Validate backup first
  const validation = validateBackup(backup);
  if (!validation.valid) {
    throw new Error(`Invalid backup: ${validation.errors.join(', ')}`);
  }
  
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Clear existing data
    await Item.deleteMany({}, { session });
    await Booking.deleteMany({}, { session });
    
    // Restore items
    const itemsToRestore = backup.data.items.map(item => {
      // Remove MongoDB version keys and ensure proper structure
      const { __v, ...itemData } = item;
      return {
        ...itemData,
        _id: item._id ? new mongoose.Types.ObjectId(item._id) : new mongoose.Types.ObjectId(),
        createdAt: item.createdAt || new Date()
      };
    });
    
    let restoredItems = [];
    if (itemsToRestore.length > 0) {
      // Use collection.insertMany to bypass Mongoose validation entirely
      const result = await Item.collection.insertMany(itemsToRestore, { session });
      restoredItems = itemsToRestore.map((item, index) => ({
        ...item,
        _id: result.insertedIds[index] || item._id
      }));
    }
    
    // Create mapping of old IDs to new IDs (in case IDs need to be regenerated)
    const itemIdMap = new Map();
    itemsToRestore.forEach((item, index) => {
      itemIdMap.set(item._id.toString(), restoredItems[index]?._id || item._id);
    });
    
    // Restore bookings with correct item references
    const bookingsToRestore = backup.data.bookings.map(booking => {
      const { __v, ...bookingData } = booking;
      
      // Ensure itemId references valid item
      let itemId = bookingData.itemId;
      if (itemId && itemIdMap.has(itemId.toString())) {
        itemId = itemIdMap.get(itemId.toString());
      }
      
      return {
        ...bookingData,
        itemId,
        _id: booking._id ? new mongoose.Types.ObjectId(booking._id) : new mongoose.Types.ObjectId(),
        createdAt: booking.createdAt || new Date(),
        submittedAt: booking.submittedAt || new Date().toISOString()
      };
    });
    
    let restoredBookings = [];
    if (bookingsToRestore.length > 0) {
      // Use collection.insertMany to bypass Mongoose validation and hooks entirely
      // This ensures all backup data is restored exactly as it was, regardless of current validation rules
      const result = await Booking.collection.insertMany(bookingsToRestore, { session });
      restoredBookings = bookingsToRestore.map((booking, index) => ({
        ...booking,
        _id: result.insertedIds[index] || booking._id
      }));
    }
    
    // Commit transaction
    await session.commitTransaction();
    
    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      backupTimestamp: backup.timestamp,
      restored: {
        items: restoredItems.length,
        labs: restoredItems.filter(i => i.type === 'lab').length,
        equipment: restoredItems.filter(i => i.type === 'equipment').length,
        bookings: restoredBookings.length,
        pendingBookings: restoredBookings.filter(b => b.status === 'pending').length,
        approvedBookings: restoredBookings.filter(b => b.status === 'approved').length,
        declinedBookings: restoredBookings.filter(b => b.status === 'declined').length
      }
    };
    
    console.log('Restore completed successfully:', result);
    return result;
    
  } catch (error) {
    // Abort transaction on any error
    await session.abortTransaction();
    console.error('Restore failed, transaction aborted:', error);
    throw new Error(`Restore failed: ${error.message}`);
  } finally {
    session.endSession();
  }
}

/**
 * Verifies backup integrity by checking relational mappings
 * @param {Object} backup - Backup to verify
 * @returns {Object} Verification result with details
 */
export function verifyBackupIntegrity(backup) {
  const validation = validateBackup(backup);
  
  if (!validation.valid) {
    return {
      valid: false,
      errors: validation.errors,
      warnings: []
    };
  }
  
  const warnings = [];
  const itemIds = new Set(backup.data.items.map(i => i._id?.toString() || i._id));
  
  // Check each booking has valid item reference
  backup.data.bookings.forEach((booking, index) => {
    if (booking.itemId && !itemIds.has(booking.itemId.toString())) {
      warnings.push(`Booking ${index + 1} (${booking.userName || 'Unknown'}) references missing item ${booking.itemId}`);
    }
  });
  
  // Check for duplicate IDs
  const bookingIds = backup.data.bookings.map(b => b._id?.toString());
  const duplicateBookingIds = bookingIds.filter((id, index) => bookingIds.indexOf(id) !== index);
  if (duplicateBookingIds.length > 0) {
    warnings.push(`Found ${duplicateBookingIds.length} duplicate booking IDs`);
  }
  
  const itemIdArray = backup.data.items.map(i => i._id?.toString());
  const duplicateItemIds = itemIdArray.filter((id, index) => itemIdArray.indexOf(id) !== index);
  if (duplicateItemIds.length > 0) {
    warnings.push(`Found ${duplicateItemIds.length} duplicate item IDs`);
  }
  
  return {
    valid: true,
    errors: [],
    warnings,
    stats: validation.stats
  };
}
