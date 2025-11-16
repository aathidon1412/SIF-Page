import * as XLSX from 'xlsx';

interface ExportItem {
  id: string;
  title: string;
  type: string;
  desc?: string;
  pricePerDay?: number;
  pricePerHour?: number;
  capacity?: string;
  image?: string;
  createdAt?: string;
}

interface ExportBooking {
  id: string;
  itemTitle: string;
  itemType: string;
  userName: string;
  userEmail: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  status: string;
  totalCost: number;
  submittedAt: string;
  reviewedAt?: string;
  adminNote?: string;
  purpose?: string;
  additionalNotes?: string;
}

export function exportToExcel(items: ExportItem[], bookings: ExportBooking[]) {
  try {
    const wb = XLSX.utils.book_new();

    const itemRows = items.map(i => ({
      ID: i.id,
      Title: i.title,
      Type: i.type,
      Description: i.desc || '',
      PricePerDay: i.pricePerDay ?? '',
      PricePerHour: i.pricePerHour ?? '',
      Capacity: i.capacity ?? '',
      Image: i.image ?? '',
      CreatedAt: i.createdAt || '',
    }));

    const bookingRows = bookings.map(b => ({
      ID: b.id,
      ItemTitle: b.itemTitle,
      ItemType: b.itemType,
      UserName: b.userName,
      UserEmail: b.userEmail,
      StartDate: b.startDate,
      EndDate: b.endDate,
      StartTime: b.startTime || '',
      EndTime: b.endTime || '',
      Status: b.status,
      TotalCost: b.totalCost,
      SubmittedAt: b.submittedAt,
      ReviewedAt: b.reviewedAt || '',
      AdminNote: b.adminNote || '',
      Purpose: b.purpose || '',
      AdditionalNotes: b.additionalNotes || '',
    }));

    const itemsSheet = XLSX.utils.json_to_sheet(itemRows);
    const bookingsSheet = XLSX.utils.json_to_sheet(bookingRows);

    XLSX.utils.book_append_sheet(wb, itemsSheet, 'Items');
    XLSX.utils.book_append_sheet(wb, bookingsSheet, 'Bookings');

    const timestamp = new Date().toISOString().replace(/[:T]/g, '-').split('.')[0];
    const filename = `sif-export-${timestamp}.xlsx`;
    XLSX.writeFile(wb, filename);
  } catch (e) {
    console.error('Excel export failed', e);
    throw e;
  }
}
