/**
 * Notification System for Booking Status Changes
 * Handles email notifications and in-app notifications
 */

/**
 * Email configuration (using console logging for now, can be replaced with actual email service)
 * To use real email: Install nodemailer and configure SMTP settings in .env
 */

/**
 * Send email notification (placeholder - replace with actual email service)
 */
const sendEmail = async (to, subject, htmlContent) => {
  // For production: Use nodemailer, SendGrid, AWS SES, etc.
  // For now: Log to console
  console.log(`[EMAIL NOTIFICATION]`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Content: ${htmlContent}`);
  console.log('---');
  
  // Simulate email sending
  return { success: true, messageId: `mock_${Date.now()}` };
};

/**
 * Notify user of booking status change
 */
export const notifyBookingStatusChange = async (booking, oldStatus) => {
  const { userEmail, userName, itemTitle, status, adminNote, startDate, endDate, startTime, endTime } = booking;

  const dateRange = startDate === endDate
    ? startDate
    : `${startDate} to ${endDate}`;

  const timeInfo = startTime && endTime
    ? ` from ${startTime} to ${endTime}`
    : '';

  let subject, message;

  switch (status) {
    case 'approved':
      subject = `✅ Booking Approved - ${itemTitle}`;
      message = `
        <h2>Your booking has been approved!</h2>
        <p>Dear ${userName},</p>
        <p>Great news! Your booking request has been approved.</p>
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Item:</strong> ${itemTitle}</li>
          <li><strong>Date:</strong> ${dateRange}${timeInfo}</li>
          <li><strong>Status:</strong> <span style="color: green;">APPROVED</span></li>
        </ul>
        ${adminNote ? `<p><strong>Admin Note:</strong> ${adminNote}</p>` : ''}
        <p>Please arrive on time and follow all safety guidelines.</p>
        <p>If you need to cancel or modify this booking, please contact the admin.</p>
      `;
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
    const result = await sendEmail(userEmail, subject, message);
    
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
