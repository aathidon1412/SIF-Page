import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { adminAuth } from '../middleware/auth.js';
import { createBackup, restoreBackup, verifyBackupIntegrity } from '../utils/backup.js';

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

// Backup endpoint - creates a complete backup of all system data
router.post('/backup', adminAuth, async (req, res) => {
  try {
    const backup = await createBackup();
    
    // Log backup creation
    sessionLogs.push({ 
      type: 'backup', 
      timestamp: new Date().toISOString(),
      stats: backup.stats 
    });
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="backup-${backup.timestamp}.json"`);
    
    res.json(backup);
  } catch (error) {
    console.error('Backup failed:', error);
    res.status(500).json({ 
      error: 'Backup failed', 
      message: error.message 
    });
  }
});

// Restore endpoint - restores system data from a backup
router.post('/restore', adminAuth, async (req, res) => {
  try {
    const backup = req.body;
    
    // Validate backup integrity first
    const verification = verifyBackupIntegrity(backup);
    if (!verification.valid) {
      return res.status(400).json({ 
        error: 'Invalid backup data', 
        errors: verification.errors 
      });
    }
    
    // Warn about any integrity issues
    if (verification.warnings && verification.warnings.length > 0) {
      console.warn('Backup warnings:', verification.warnings);
    }
    
    // Perform restore
    const result = await restoreBackup(backup);
    
    // Log restore operation
    sessionLogs.push({ 
      type: 'restore', 
      timestamp: new Date().toISOString(),
      backupTimestamp: backup.timestamp,
      restored: result.restored
    });
    
    res.json({
      success: true,
      message: 'System data restored successfully',
      ...result,
      warnings: verification.warnings
    });
  } catch (error) {
    console.error('Restore failed:', error);
    res.status(500).json({ 
      error: 'Restore failed', 
      message: error.message 
    });
  }
});

// Verify backup endpoint - validates backup without restoring
router.post('/backup/verify', adminAuth, async (req, res) => {
  try {
    const backup = req.body;
    const verification = verifyBackupIntegrity(backup);
    
    res.json({
      ...verification,
      message: verification.valid 
        ? 'Backup is valid and ready to restore' 
        : 'Backup validation failed'
    });
  } catch (error) {
    console.error('Backup verification failed:', error);
    res.status(500).json({ 
      error: 'Verification failed', 
      message: error.message 
    });
  }
});

export default router;
