import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import adminRoutes from './src/routes/admin.js';
import itemRoutes from './src/routes/items.js';
import bookingRoutes from './src/routes/bookings.js';
import { seedAdmin } from './src/utils/seedAdmin.js';
import { seedItems } from './src/utils/seed.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173'], credentials: false }));

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('\n[CONFIG ERROR] Missing MONGODB_URI environment variable.');
  console.error('Create a backend/.env file based on backend/.env.example and set MONGODB_URI.');
  console.error('Example: MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster-host>/<db>?retryWrites=true&w=majority');
  process.exit(1);
}

async function start() {
  try {
    console.log('[MongoDB] Connecting...');
    await mongoose.connect(MONGODB_URI, { dbName: 'sif_fab_lab' });
    console.log('[MongoDB] Connected');
    await seedAdmin();
    await seedItems();

    app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
    app.use('/api/admin', adminRoutes);
    app.use('/api/items', itemRoutes);
    app.use('/api/bookings', bookingRoutes);

    app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
}

start();
