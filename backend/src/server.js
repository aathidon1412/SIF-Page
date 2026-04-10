import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import adminRoutes from './routes/admin.js';
import itemRoutes from './routes/items.js';
import bookingRoutes from './routes/bookings.js';
import verifyRoutes from './routes/verify.js';
import { seedAdmin } from './scripts/seedAdmin.js';
import { seedItems } from './scripts/seed.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
const frontendIndexPath = path.join(frontendDistPath, 'index.html');

const app = express();
app.use(express.json());

const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(new Set(['http://localhost:5173', 'http://localhost:5001', ...configuredOrigins]));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: false,
  })
);

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
    app.use('/api/verify', verifyRoutes);

    if (fs.existsSync(frontendDistPath)) {
      app.use(express.static(frontendDistPath, { index: false }));

      app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api')) {
          next();
          return;
        }

        // Do not rewrite requests that look like static assets.
        if (path.extname(req.path)) {
          res.status(404).type('text/plain').send('Not Found');
          return;
        }

        res.sendFile(frontendIndexPath, (err) => {
          if (err) {
            next(err);
          }
        });
      });
      console.log('[Frontend] Serving static files from frontend/dist');
    } else {
      console.log('[Frontend] frontend/dist not found. API-only mode is active.');
    }

    app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
}

start();
