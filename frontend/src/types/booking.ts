export interface BookingRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  itemId: string;
  itemTitle: string;
  itemType: 'lab' | 'equipment';
  startDate: string;
  endDate: string;
  startTime?: string; // For labs
  endTime?: string; // For labs
  duration?: number; // For equipment (days)
  purpose: string;
  contactInfo: string;
  additionalNotes?: string;
  status: 'pending' | 'approved' | 'declined';
  adminNote?: string;
  totalCost: number;
  submittedAt: string;
  reviewedAt?: string;
}

export interface BookingFormData {
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  purpose: string;
  contactInfo: string;
  additionalNotes?: string;
}