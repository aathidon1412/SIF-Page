#!/usr/bin/env node

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { seedItems, clearItems, reseedItems } from './src/utils/seed.js';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('\n[CONFIG ERROR] Missing MONGODB_URI environment variable.');
  console.error('Create a backend/.env file and set MONGODB_URI.');
  process.exit(1);
}

async function main() {
  try {
    console.log('[MongoDB] Connecting...');
    await mongoose.connect(MONGODB_URI, { dbName: 'sif_fab_lab' });
    console.log('[MongoDB] Connected successfully');

    const command = process.argv[2];

    switch (command) {
      case 'seed':
        await seedItems();
        break;
      case 'clear':
        await clearItems();
        break;
      case 'reseed':
        await reseedItems();
        break;
      default:
        console.log('\nUsage:');
        console.log('  npm run seed          - Add items to database (skip if items exist)');
        console.log('  npm run seed:clear    - Clear all items from database');
        console.log('  npm run seed:reseed   - Clear and recreate all items');
        break;
    }

  } catch (error) {
    console.error('[ERROR]', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('[MongoDB] Disconnected');
    process.exit(0);
  }
}

main();