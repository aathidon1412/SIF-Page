import express from 'express';
import { Item } from '../models/Item.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await Item.find().sort({ createdAt: -1 });
  res.json(items);
});

router.post('/', adminAuth, async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

router.patch('/:id', adminAuth, async (req, res) => {
  const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

export default router;
