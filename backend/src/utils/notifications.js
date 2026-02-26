/**
 * Notification System for Booking Status Changes
 * Handles email notifications and in-app notifications
 */

/**
 * Email configuration (using console logging for now, can be replaced with actual email service)
 * To use real email: Install nodemailer and configure SMTP settings in .env
 */
import nodemailer from 'nodemailer';
import { generateBookingQRCode } from './qrCodeGenerator.js';

let transporter;
const getTransporter = () => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user) {
    // Fallback to a console-logger transport when SMTP is not configured
    transporter = {
      sendMail: async (opts) => {
        console.log('[EMAIL (console fallback)]');
        console.log('To:', opts.to);
        console.log('Subject:', opts.subject);
        console.log('HTML:', opts.html);
        if (opts.attachments) console.log('Attachments:', (opts.attachments || []).map(a => a.filename || a.cid || '<buffer>'));
        return { messageId: `mock_${Date.now()}`, accepted: [opts.to] };
      }
    };
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
    tls: {
      // Allow self-signed / corporate-proxy certificates
      rejectUnauthorized: false
    }
  });

  return transporter;
};

/**
 * Send email using configured SMTP transporter
 */
const sendEmail = async (to, subject, htmlContent, attachments) => {
  try {
    const t = getTransporter();
    const from = process.env.SMTP_FROM || process.env.SMTP_USER || `no-reply@${process.env.SMTP_HOST || 'localhost'}`;

    const info = await t.sendMail({
      from,
      to,
      subject,
      html: htmlContent,
      attachments
    });

    return { success: true, messageId: info.messageId || info.messageId || null, accepted: info.accepted || [] , sentAt: new Date().toISOString() };
  } catch (error) {
    console.error('[EMAIL ERROR]', error);
    return { success: false, error: error.message || String(error) };
  }
};

// Helper: format slot from DD/MM/YYYY and HH:MM into DD/MM/YYYY HH:MM AM/PM
const formatSlot = (dateStr, timeStr) => {
  try {
    if (!dateStr) return '';
    const dateParts = dateStr.split('/');
    if (dateParts.length !== 3) return `${dateStr} ${timeStr || ''}`.trim();
    const dd = Number(dateParts[0]);
    const mm = Number(dateParts[1]);
    const yyyy = Number(dateParts[2]);
    let hour = 0, minute = 0;
    if (timeStr) {
      const t = timeStr.split(':');
      hour = Number(t[0] || 0);
      minute = Number(t[1] || 0);
    }
    const d = new Date(yyyy, mm - 1, dd, hour, minute);
    return d.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
  } catch (e) {
    return `${dateStr} ${timeStr || ''}`.trim();
  }
};

/**
 * Notify user of booking status change
 */
export const notifyBookingStatusChange = async (booking, oldStatus) => {
  const { userEmail, userName, itemTitle, status, adminNote, startDate, endDate, startTime, endTime, purpose } = booking;

  const dateRange = startDate === endDate
    ? startDate
    : `${startDate} to ${endDate}`;

  const timeInfo = startTime && endTime
    ? ` from ${startTime} to ${endTime}`
    : '';

  const institution = booking.institutionName || booking.institution || booking.contactInfo || 'N/A';

  let subject, message;
  let emailAttachments = undefined;

  switch (status) {
    case 'approved':
      subject = `Booking Confirmed — ${itemTitle}`;

      // Generate QR code for verification (data URL + PNG buffer)
      let qrCodeImage = '';
      let attachments = undefined;
      try {
        const qrData = await generateBookingQRCode(booking._id);
        qrCodeImage = qrData.qrCodeData;
        if (qrData.qrCodeBuffer) {
          attachments = [
            {
              filename: `booking-${booking._id}.png`,
              content: qrData.qrCodeBuffer,
              cid: 'booking_qr'
            }
          ];
        }
        console.log(`[QR CODE] Generated for booking ${booking._id}`);
      } catch (error) {
        console.error(`[QR CODE ERROR] Failed to generate for booking ${booking._id}:`, error);
        // Continue without QR code if generation fails
      }

      // Choose embedded image via cid when buffer available, otherwise data URL
      const qrImgTag = attachments ?
        `<img src="cid:booking_qr" alt="Booking QR Code" style="width:250px; height:250px; margin:15px auto; display:block; border:2px solid #ddd; border-radius:8px;"/>`
        : (qrCodeImage ? `<img src="${qrCodeImage}" alt="Booking QR Code" style="width:250px; height:250px; margin:15px auto; display:block; border:2px solid #ddd; border-radius:8px;"/>` : '');

      message = `
        <div style="font-family: Arial, Helvetica, sans-serif; color: #111; line-height:1.5;">
          <p>Dear ${userName},</p>
          <p>We are pleased to confirm your booking. Below are the official details of your confirmed reservation.</p>

          <h3>Booking Confirmation</h3>
          <table style="width:100%; border-collapse:collapse;">
            <tr><td style="padding:6px; font-weight:600; width:170px;">Booking ID</td><td style="padding:6px;">${booking._id}</td></tr>
            <tr><td style="padding:6px; font-weight:600;">Name</td><td style="padding:6px;">${userName} &lt;${userEmail}&gt;</td></tr>
            <tr><td style="padding:6px; font-weight:600;">Institution</td><td style="padding:6px;">${institution}</td></tr>
            <tr><td style="padding:6px; font-weight:600;">Item</td><td style="padding:6px;">${itemTitle}</td></tr>
            <tr><td style="padding:6px; font-weight:600;">Date</td><td style="padding:6px;">${dateRange}</td></tr>
            <tr><td style="padding:6px; font-weight:600;">Time slot</td><td style="padding:6px;">${formatSlot(startDate, startTime)} — ${formatSlot(endDate, endTime)}</td></tr>
            <tr><td style="padding:6px; font-weight:600;">Purpose</td><td style="padding:6px;">${purpose || 'N/A'}</td></tr>
            ${adminNote ? `<tr><td style="padding:6px; font-weight:600;">Admin note</td><td style="padding:6px;">${adminNote}</td></tr>` : ''}
          </table>

          ${qrImgTag ? `
          <div style="margin-top:30px; padding:20px; background:#f5f5f5; border-radius:8px; text-align:center;">
            <h3 style="margin-top:0;">Your Booking Verification QR Code</h3>
            <p>Present this QR code when you arrive at the facility:</p>
            ${qrImgTag}
            <p style="font-size:12px; color:#666; margin-top:15px;">This QR code is unique to your booking and can be scanned by facility coordinators for verification.</p>
          </div>
          ` : ''}

          <p>Please bring any required identification and arrive a few minutes early. If you need assistance, contact the administrator at <a href="mailto:${process.env.ADMIN_EMAIL || 'admin@example.com'}">${process.env.ADMIN_EMAIL || 'admin@example.com'}</a>.</p>
          <p>Thank you for using our booking service.</p>
          <p>Sincerely,<br/>The Facilities Team</p>
        </div>
      `;

      // expose attachments to outer scope so sendEmail can include them
      emailAttachments = attachments;
      break;

    case 'declined':
      const wasApproved = oldStatus === 'approved';
      subject = `❌ Booking ${wasApproved ? 'Revoked' : 'Declined'} - ${itemTitle}`;
      message = `
        <h2>Your booking has been ${wasApproved ? 'revoked' : 'declined'}</h2>
        <p>Dear ${userName},</p>
        <p>We regret to inform you that your booking request has been ${wasApproved ? 'revoked' : 'declined'}.</p>
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Item:</strong> ${itemTitle}</li>
          <li><strong>Date:</strong> ${dateRange}${timeInfo}</li>
          <li><strong>Status:</strong> <span style="color: red;">${wasApproved ? 'REVOKED' : 'DECLINED'}</span></li>
        </ul>
        ${adminNote ? `<p><strong>Reason:</strong> ${adminNote}</p>` : ''}
        ${wasApproved ? '<p><strong>Important:</strong> This booking was previously approved but has been revoked. We apologize for any inconvenience.</p>' : ''}
        <p>You may submit a new booking request or contact the admin for more information.</p>
      `;
      break;

    case 'pending':
      subject = `⏳ Booking Under Review - ${itemTitle}`;
      message = `
        <h2>Your booking is under review</h2>
        <p>Dear ${userName},</p>
        <p>Your booking request has been submitted and is currently under review.</p>
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Item:</strong> ${itemTitle}</li>
          <li><strong>Date:</strong> ${dateRange}${timeInfo}</li>
          <li><strong>Status:</strong> <span style="color: orange;">PENDING</span></li>
        </ul>
        <p>You will receive an email notification once your booking is reviewed.</p>
      `;
      break;

    default:
      return { success: false, error: 'Unknown status' };
  }

  try {
    const result = await sendEmail(userEmail, subject, message, emailAttachments);
    
    // Log notification
    console.log(`[NOTIFICATION SENT] ${status.toUpperCase()} - ${userEmail} - ${itemTitle}`);
    
    return {
      success: true,
      type: 'status_change',
      sentAt: new Date().toISOString(),
      status,
      message: subject,
      ...result
    };
  } catch (error) {
    console.error(`[NOTIFICATION ERROR] Failed to send email to ${userEmail}:`, error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Notify user of booking conflict
 */
export const notifyBookingConflict = async (booking, conflicts) => {
  const { userEmail, userName, itemTitle, startDate, endDate, startTime, endTime } = booking;

  const dateRange = startDate === endDate
    ? startDate
    : `${startDate} to ${endDate}`;

  const timeInfo = startTime && endTime
    ? ` from ${startTime} to ${endTime}`
    : '';

  const approvedConflicts = conflicts.filter(c => c.status === 'approved');
  const pendingConflicts = conflicts.filter(c => c.status === 'pending');

  const subject = `⚠️ Booking Conflict Detected - ${itemTitle}`;
  const message = `
    <h2>Booking Conflict Detected</h2>
    <p>Dear ${userName},</p>
    <p>Your booking request has been submitted, but there are conflicts with existing bookings.</p>
    <h3>Your Booking Request:</h3>
    <ul>
      <li><strong>Item:</strong> ${itemTitle}</li>
      <li><strong>Date:</strong> ${dateRange}${timeInfo}</li>
    </ul>
    <h3>Conflicting Bookings:</h3>
    ${approvedConflicts.length > 0 ? `
      <p><strong>Already Approved (${approvedConflicts.length}):</strong></p>
      <ul>
        ${approvedConflicts.map(c => `
          <li>${c.userName} - ${c.startDate === c.endDate ? c.startDate : `${c.startDate} to ${c.endDate}`}
          ${c.startTime ? ` (${c.startTime}-${c.endTime})` : ''}</li>
        `).join('')}
      </ul>
    ` : ''}
    ${pendingConflicts.length > 0 ? `
      <p><strong>Pending Review (${pendingConflicts.length}):</strong></p>
      <ul>
        ${pendingConflicts.map(c => `
          <li>${c.userName} - ${c.startDate === c.endDate ? c.startDate : `${c.startDate} to ${c.endDate}`}
          ${c.startTime ? ` (${c.startTime}-${c.endTime})` : ''}</li>
        `).join('')}
      </ul>
    ` : ''}
    <p>Your booking has been sent to the admin for review. The admin will resolve the conflict and notify you of the decision.</p>
    <p>You may be asked to select alternative dates/times.</p>
  `;

  try {
    const result = await sendEmail(userEmail, subject, message);
    
    console.log(`[CONFLICT NOTIFICATION] Sent to ${userEmail} - ${conflicts.length} conflicts`);
    
    return {
      success: true,
      type: 'conflict',
      sentAt: new Date().toISOString(),
      conflictCount: conflicts.length,
      message: subject,
      ...result
    };
  } catch (error) {
    console.error(`[NOTIFICATION ERROR] Failed to send conflict email to ${userEmail}:`, error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Notify admin of new booking with conflicts
 */
export const notifyAdminOfConflict = async (booking, conflicts) => {
  const { userEmail, userName, itemTitle, startDate, endDate, startTime, endTime } = booking;

  const dateRange = startDate === endDate
    ? startDate
    : `${startDate} to ${endDate}`;

  const timeInfo = startTime && endTime
    ? ` from ${startTime} to ${endTime}`
    : '';

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';

  const subject = `⚠️ [ADMIN] Booking Conflict Requires Review - ${itemTitle}`;
  const message = `
    <h2>Booking Conflict Detected - Admin Action Required</h2>
    <h3>New Booking Request:</h3>
    <ul>
      <li><strong>User:</strong> ${userName} (${userEmail})</li>
      <li><strong>Item:</strong> ${itemTitle}</li>
      <li><strong>Date:</strong> ${dateRange}${timeInfo}</li>
      <li><strong>Conflicts:</strong> ${conflicts.length} booking(s)</li>
    </ul>
    <h3>Conflicting Bookings:</h3>
    <ul>
      ${conflicts.map(c => `
        <li><strong>[${c.status.toUpperCase()}]</strong> ${c.userName} (${c.userEmail}) - 
        ${c.startDate === c.endDate ? c.startDate : `${c.startDate} to ${c.endDate}`}
        ${c.startTime ? ` (${c.startTime}-${c.endTime})` : ''}
        <br/><em>Conflict Type: ${c.conflictType.replace('_', ' ')}</em></li>
      `).join('')}
    </ul>
    <p><strong>Action Required:</strong> Please review and approve/decline the conflicting bookings through the admin panel.</p>
    <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin">Go to Admin Panel</a></p>
  `;

  try {
    const result = await sendEmail(adminEmail, subject, message);
    
    console.log(`[ADMIN NOTIFICATION] Conflict alert sent - ${itemTitle} - ${conflicts.length} conflicts`);
    
    return {
      success: true,
      type: 'admin_conflict',
      sentAt: new Date().toISOString(),
      ...result
    };
  } catch (error) {
    console.error(`[NOTIFICATION ERROR] Failed to send admin notification:`, error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Record notification in booking history
 */
export const recordNotification = async (bookingModel, bookingId, notification) => {
  try {
    await bookingModel.findByIdAndUpdate(bookingId, {
      $set: {
        notificationSent: notification.success,
        lastNotificationAt: notification.sentAt
      },
      $push: {
        notificationHistory: {
          type: notification.type,
          sentAt: notification.sentAt,
          status: notification.success ? 'sent' : 'failed',
          message: notification.message || notification.error
        }
      }
    });
  } catch (error) {
    console.error(`[NOTIFICATION] Failed to record notification for booking ${bookingId}:`, error);
  }
};
