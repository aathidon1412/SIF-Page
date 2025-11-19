export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

interface LoginResponse { token: string }

export async function adminLogin(username: string, password: string): Promise<string> {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Login failed');
  const data: LoginResponse = await res.json();
  return data.token;
}

export async function fetchAdminLogs(token: string) {
  const res = await fetch(`${API_BASE}/admin/logs`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchItems() {
  const res = await fetch(`${API_BASE}/items`);
  if (!res.ok) throw new Error('Failed to load items');
  return res.json();
}

export async function createItem(token: string, payload: any) {
  const res = await fetch(`${API_BASE}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create item');
  return res.json();
}

export async function deleteItem(token: string, id: string) {
  const res = await fetch(`${API_BASE}/items/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete item');
  return res.json();
}

export async function updateItem(token: string, id: string, payload: any) {
  const res = await fetch(`${API_BASE}/items/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update item');
  return res.json();
}

export async function fetchBookings(userEmail?: string) {
  const url = userEmail ? `${API_BASE}/bookings?userEmail=${encodeURIComponent(userEmail)}` : `${API_BASE}/bookings`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load bookings');
  return res.json();
}

export async function createBooking(payload: any) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!res.ok) {
    // Parse error message from backend
    const errorData = await res.json().catch(() => ({}));
    const error: any = new Error(errorData.message || 'Failed to create booking');
    error.response = { data: errorData };
    throw error;
  }
  
  return res.json();
}

export async function updateBookingStatus(token: string, id: string, status: 'approved' | 'declined' | 'pending', adminNote?: string) {
  const res = await fetch(`${API_BASE}/bookings/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status, adminNote })
  });
  if (!res.ok) throw new Error('Failed to update booking');
  return res.json();
}

export async function createBackup(token: string) {
  const res = await fetch(`${API_BASE}/admin/backup`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create backup');
  }
  return res.json();
}

export async function restoreBackup(token: string, backupData: any) {
  const res = await fetch(`${API_BASE}/admin/restore`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(backupData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to restore backup');
  }
  return res.json();
}

export async function verifyBackup(token: string, backupData: any) {
  const res = await fetch(`${API_BASE}/admin/backup/verify`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(backupData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to verify backup');
  }
  return res.json();
}

