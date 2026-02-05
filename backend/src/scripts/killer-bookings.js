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
//  node killer-bookings.js --dry-run --before=2026-02-01
//  node killer-bookings.js --yes --before=2026-02-01
//  node killer-bookings.js --dry-run --before-start=2026-02-01
//  node killer-bookings.js --yes --all
// Options:
//   --before=YYYY-MM-DD       delete bookings with createdAt <= date (end of day)
//   --before-start=YYYY-MM-DD delete bookings with startDate (string) <= date
//   --all                     delete all bookings
//   --dry-run                 show count/sample without deleting
//   --yes                     perform deletion (destructive)

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const doDelete = args.includes('--yes');
const all = args.includes('--all');

const beforeArg = args.find(a => a.startsWith('--before='));
const beforeStartArg = args.find(a => a.startsWith('--before-start='));

function parseDateArg(arg) {
  if (!arg) return null;
  const parts = arg.split('=');
  return parts[1] || null;
}

const beforeDateStr = parseDateArg(beforeArg);
const beforeStartDateStr = parseDateArg(beforeStartArg);

if (!all && !beforeDateStr && !beforeStartDateStr) {
  console.log('Usage: Provide one of --all | --before=YYYY-MM-DD | --before-start=YYYY-MM-DD');
  console.log('Add `--dry-run` to preview, and `--yes` to actually delete.');
  process.exit(0);
}

function endOfDay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCHours(23, 59, 59, 999);
  return d;
}

async function main() {
  try {
    console.log('[MongoDB] Connecting...');
    await mongoose.connect(MONGODB_URI, { dbName: 'sif_fab_lab' });
    console.log('[MongoDB] Connected');

    let filter = {};

    if (all) {
      filter = {};
    } else if (beforeDateStr) {
      const cutoff = endOfDay(beforeDateStr);
      filter = { createdAt: { $lte: cutoff } };
    } else if (beforeStartDateStr) {
      // startDate stored as 'YYYY-MM-DD' strings in schema
      filter = { startDate: { $lte: beforeStartDateStr } };
    }

    const count = await Booking.countDocuments(filter);
    console.log(`[Query] Matching bookings: ${count}`);

    if (count === 0) {
      console.log('No matching bookings found. Nothing to do.');
      return;
    }

    // Show a small sample for verification
    const sample = await Booking.find(filter).limit(10).select('_id userEmail itemTitle startDate endDate createdAt');
    console.log('Sample documents:');
    sample.forEach(doc => console.log(` - ${doc._id} | ${doc.userEmail} | ${doc.itemTitle} | ${doc.startDate} | createdAt: ${doc.createdAt}`));

    if (dryRun) {
      console.log('Dry run mode - no documents will be deleted. Rerun with `--yes` to delete.');
      return;
    }

    if (!doDelete) {
      console.log('To delete the matching bookings, re-run with the `--yes` flag.');
      console.log('Example: node killer-bookings.js --yes --before=2026-02-01');
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
