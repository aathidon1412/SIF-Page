import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';

export async function seedAdmin() {
  const username = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASS;
  if (!username || !password) {
    console.warn('ADMIN_USER or ADMIN_PASS missing in env');
    return;
  }
  const existing = await Admin.findOne({ username });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ username, passwordHash });
    console.log('Seeded admin user');
  }
}
