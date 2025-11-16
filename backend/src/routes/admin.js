import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });
  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, admin.passwordHash);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: admin._id, username: admin.username, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

// Simple logs stored in memory for now (can move to collection)
let sessionLogs = [];

router.post('/logout', adminAuth, (req, res) => {
  sessionLogs.push({ type: 'logout', timestamp: new Date().toISOString() });
  return res.json({ message: 'Logged out' });
});

router.get('/logs', adminAuth, (req, res) => {
  res.json(sessionLogs);
});

export default router;
