#!/usr/bin/env node

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Booking } from '../models/Booking.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('\n[CONFIG ERROR] Missing MONGODB_URI environment variable.');
  process.exit(1);
}

// Usage:
//  node killer-request.js --dry-run     # show how many matching bookings would be deleted
//  node killer-request.js --yes         # perform deletion
// By default it will refuse to delete unless --yes is provided.

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const doDelete = args.includes('--yes');

async function main() {
  try {
    console.log('[MongoDB] Connecting...');
    await mongoose.connect(MONGODB_URI, { dbName: 'sif_fab_lab' });
    console.log('[MongoDB] Connected');

    // Define filter for "rental" requests:
    // - bookings for equipment (itemType === 'equipment')
    // - OR bookings whose purpose contains the word "rental" (case-insensitive)
    const filter = {
      $or: [
        { itemType: 'equipment' },
        { purpose: { $regex: /rental/i } }
      ]
    };

    const count = await Booking.countDocuments(filter);
    console.log(`[Query] Matching bookings: ${count}`);

    if (count === 0) {
      console.log('No matching bookings found. Nothing to do.');
      return;
    }

    if (dryRun) {
      console.log('Dry run mode - no documents will be deleted. Rerun with `--yes` to delete.');
      return;
    }

    if (!doDelete) {
      console.log('To delete the matching bookings, re-run with the `--yes` flag.');
      console.log('Example: node killer-request.js --yes');
      return;
    }

    const result = await Booking.deleteMany(filter);
    console.log(`[Deleted] ${result.deletedCount} booking(s) removed.`);

  } catch (err) {
    console.error('[ERROR]', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('[MongoDB] Disconnected');
  }
}

main();
