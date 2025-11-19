export interface ConflictingBooking {
  bookingId: string;
  userEmail: string;
  userName?: string;
  status: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  conflictType: 'exact_match' | 'fully_contained' | 'partial_overlap';
}

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
  // Conflict metadata
  hasConflict?: boolean;
  conflictingBookings?: ConflictingBooking[];
  wasApprovedBefore?: boolean;
  declinedAfterApproval?: boolean;
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