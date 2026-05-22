// Email templates for LawnCare Manager Pro
// All templates use the business settings for branding

export interface EmailTemplateData {
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  businessAddress: string;
  customerName: string;
  customerEmail: string;
}

function baseStyles(): string {
  return `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; }
      .header { background: linear-gradient(135deg, #15803d 0%, #166534 100%); padding: 24px 32px; }
      .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; }
      .header p { color: #bbf7d0; margin: 4px 0 0; font-size: 14px; }
      .content { padding: 24px 32px; }
      .content h2 { color: #15803d; font-size: 18px; margin: 0 0 16px; }
      .content p { color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 12px; }
      .info-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 16px 0; }
      .info-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #dcfce7; }
      .info-row:last-child { border-bottom: none; }
      .info-label { color: #6b7280; font-size: 13px; }
      .info-value { color: #111827; font-size: 13px; font-weight: 500; }
      .btn { display: inline-block; background: #15803d; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; margin: 16px 0; }
      .footer { background: #f9fafb; padding: 16px 32px; border-top: 1px solid #e5e7eb; }
      .footer p { color: #9ca3af; font-size: 12px; margin: 4px 0; }
      .items-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
      .items-table th { background: #f0fdf4; color: #15803d; font-size: 12px; text-align: left; padding: 8px 12px; border-bottom: 2px solid #bbf7d0; }
      .items-table td { font-size: 13px; padding: 8px 12px; border-bottom: 1px solid #e5e7eb; color: #374151; }
      .items-table .total-row { font-weight: 600; background: #f0fdf4; }
      .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
      .status-scheduled { background: #dbeafe; color: #1e40af; }
      .status-approved { background: #dcfce7; color: #166534; }
      .status-completed { background: #e0e7ff; color: #3730a3; }
    </style>
  `;
}

function footer(businessName: string, businessPhone: string, businessEmail: string, businessAddress: string): string {
  return `
    <div class="footer">
      <p><strong>${businessName}</strong></p>
      <p>📞 ${businessPhone} &bull; ✉️ ${businessEmail}</p>
      <p>📍 ${businessAddress}</p>
      <p style="margin-top: 8px; font-style: italic;">This email was sent by LawnCare Manager Pro</p>
    </div>
  `;
}

// Booking Confirmation
export function bookingConfirmationEmail(data: EmailTemplateData & {
  appointmentTitle: string;
  date: string;
  time: string;
  address: string;
  serviceType: string;
}): { subject: string; html: string; text: string } {
  const { businessName, businessPhone, businessEmail, businessAddress, customerName, appointmentTitle, date, time, address, serviceType } = data;
  const subject = `✅ Booking Confirmed — ${appointmentTitle}`;
  const text = `Hi ${customerName}, your appointment has been confirmed.\n\nService: ${serviceType}\nDate: ${date}\nTime: ${time}\nLocation: ${address}\n\nThank you for choosing ${businessName}!`;

  const html = `
    <!DOCTYPE html><html><head>${baseStyles()}</head><body>
    <div class="container">
      <div class="header">
        <h1>🌿 ${businessName}</h1>
        <p>Booking Confirmation</p>
      </div>
      <div class="content">
        <h2>Your appointment is confirmed!</h2>
        <p>Hi ${customerName},</p>
        <p>Your lawn care appointment has been booked. Here are the details:</p>
        <div class="info-box">
          <div class="info-row"><span class="info-label">Service</span><span class="info-value">${serviceType}</span></div>
          <div class="info-row"><span class="info-label">Date</span><span class="info-value">${date}</span></div>
          <div class="info-row"><span class="info-label">Time</span><span class="info-value">${time}</span></div>
          <div class="info-row"><span class="info-label">Location</span><span class="info-value">${address}</span></div>
        </div>
        <p>If you need to make changes, please contact us at ${businessPhone} or reply to this email.</p>
      </div>
      ${footer(businessName, businessPhone, businessEmail, businessAddress)}
    </div></body></html>`;

  return { subject, html, text };
}

// Appointment Approved
export function appointmentApprovedEmail(data: EmailTemplateData & {
  appointmentTitle: string;
  date: string;
  time: string;
  address: string;
}): { subject: string; html: string; text: string } {
  const { businessName, businessPhone, businessEmail, businessAddress, customerName, appointmentTitle, date, time, address } = data;
  const subject = `🎉 Appointment Approved — ${appointmentTitle}`;
  const text = `Hi ${customerName}, your appointment has been approved.\n\nDate: ${date}\nTime: ${time}\nLocation: ${address}\n\nSee you there! — ${businessName}`;

  const html = `
    <!DOCTYPE html><html><head>${baseStyles()}</head><body>
    <div class="container">
      <div class="header">
        <h1>🌿 ${businessName}</h1>
        <p>Appointment Approved</p>
      </div>
      <div class="content">
        <h2>Your appointment is approved! 🎉</h2>
        <p>Hi ${customerName},</p>
        <p>Great news — your appointment request has been reviewed and approved:</p>
        <div class="info-box">
          <div class="info-row"><span class="info-label">Service</span><span class="info-value">${appointmentTitle}</span></div>
          <div class="info-row"><span class="info-label">Date</span><span class="info-value">${date}</span></div>
          <div class="info-row"><span class="info-label">Time</span><span class="info-value">${time}</span></div>
          <div class="info-row"><span class="info-label">Location</span><span class="info-value">${address}</span></div>
        </div>
        <p>We look forward to seeing you! If you need to reschedule, contact us at ${businessPhone}.</p>
      </div>
      ${footer(businessName, businessPhone, businessEmail, businessAddress)}
    </div></body></html>`;

  return { subject, html, text };
}

// Appointment Reminder
export function appointmentReminderEmail(data: EmailTemplateData & {
  appointmentTitle: string;
  date: string;
  time: string;
  address: string;
  hoursUntil: number;
}): { subject: string; html: string; text: string } {
  const { businessName, businessPhone, businessEmail, businessAddress, customerName, appointmentTitle, date, time, address, hoursUntil } = data;
  const subject = `⏰ Reminder: ${appointmentTitle} ${hoursUntil <= 24 ? 'Tomorrow' : 'Coming Up'}`;
  const text = `Hi ${customerName}, this is a reminder for your appointment.\n\nService: ${appointmentTitle}\nDate: ${date}\nTime: ${time}\nLocation: ${address}\n\nSee you soon! — ${businessName}`;

  const html = `
    <!DOCTYPE html><html><head>${baseStyles()}</head><body>
    <div class="container">
      <div class="header">
        <h1>🌿 ${businessName}</h1>
        <p>Appointment Reminder</p>
      </div>
      <div class="content">
        <h2>Don't forget your upcoming appointment! ⏰</h2>
        <p>Hi ${customerName},</p>
        <p>This is a friendly reminder about your upcoming service:</p>
        <div class="info-box">
          <div class="info-row"><span class="info-label">Service</span><span class="info-value">${appointmentTitle}</span></div>
          <div class="info-row"><span class="info-label">Date</span><span class="info-value">${date}</span></div>
          <div class="info-row"><span class="info-label">Time</span><span class="info-value">${time}</span></div>
          <div class="info-row"><span class="info-label">Location</span><span class="info-value">${address}</span></div>
        </div>
        <p>Need to make changes? Call us at ${businessPhone}.</p>
      </div>
      ${footer(businessName, businessPhone, businessEmail, businessAddress)}
    </div></body></html>`;

  return { subject, html, text };
}

// Estimate Sent
export function estimateSentEmail(data: EmailTemplateData & {
  estimateId: string;
  propertyAddress: string;
  items: { description: string; amount: number }[];
  subtotal: number;
  tax: number;
  total: number;
  validUntil?: string;
  notes?: string;
}): { subject: string; html: string; text: string } {
  const { businessName, businessPhone, businessEmail, businessAddress, customerName, propertyAddress, items, subtotal, tax, total, validUntil, notes } = data;
  const subject = `📋 Your Estimate from ${businessName} — $${total.toFixed(2)}`;
  const itemsText = items.map(i => `  • ${i.description}: $${i.amount.toFixed(2)}`).join('\n');
  const text = `Hi ${customerName},\n\nHere's your estimate from ${businessName}:\n\n${itemsText}\n\nSubtotal: $${subtotal.toFixed(2)}\nTax: $${tax.toFixed(2)}\nTotal: $${total.toFixed(2)}\n\nProperty: ${propertyAddress}${notes ? '\nNotes: ' + notes : ''}\n\nThank you!`;

  const itemsRows = items.map(i => `
    <tr>
      <td>${i.description}</td>
      <td style="text-align:right">$${i.amount.toFixed(2)}</td>
    </tr>`).join('');

  const html = `
    <!DOCTYPE html><html><head>${baseStyles()}</head><body>
    <div class="container">
      <div class="header">
        <h1>🌿 ${businessName}</h1>
        <p>Your Service Estimate</p>
      </div>
      <div class="content">
        <h2>Estimate for ${customerName}</h2>
        <p>Here's a breakdown of your estimated service costs:</p>
        <table class="items-table">
          <thead><tr><th>Service</th><th style="text-align:right">Amount</th></tr></thead>
          <tbody>
            ${itemsRows}
            <tr class="total-row"><td>Subtotal</td><td style="text-align:right">$${subtotal.toFixed(2)}</td></tr>
            <tr class="total-row"><td>Tax</td><td style="text-align:right">$${tax.toFixed(2)}</td></tr>
            <tr class="total-row" style="font-size:15px"><td><strong>Total</strong></td><td style="text-align:right"><strong>$${total.toFixed(2)}</strong></td></tr>
          </tbody>
        </table>
        <div class="info-box">
          <div class="info-row"><span class="info-label">Property</span><span class="info-value">${propertyAddress}</span></div>
          ${validUntil ? `<div class="info-row"><span class="info-label">Valid Until</span><span class="info-value">${validUntil}</span></div>` : ''}
        </div>
        ${notes ? `<p><em>${notes}</em></p>` : ''}
        <p>Questions? Call us at ${businessPhone} or reply to this email.</p>
      </div>
      ${footer(businessName, businessPhone, businessEmail, businessAddress)}
    </div></body></html>`;

  return { subject, html, text };
}

// Payment Receipt
export function paymentReceiptEmail(data: EmailTemplateData & {
  appointmentTitle: string;
  amount: number;
  paymentMethod: string;
  paidDate: string;
  transactionId: string;
}): { subject: string; html: string; text: string } {
  const { businessName, businessPhone, businessEmail, businessAddress, customerName, appointmentTitle, amount, paymentMethod, paidDate, transactionId } = data;
  const subject = `🧾 Payment Receipt — $${amount.toFixed(2)}`;
  const text = `Hi ${customerName},\n\nPayment received! Here's your receipt:\n\nService: ${appointmentTitle}\nAmount: $${amount.toFixed(2)}\nPaid: ${paidDate}\nMethod: ${paymentMethod}\nTransaction: ${transactionId}\n\nThank you! — ${businessName}`;

  const html = `
    <!DOCTYPE html><html><head>${baseStyles()}</head><body>
    <div class="container">
      <div class="header">
        <h1>🌿 ${businessName}</h1>
        <p>Payment Receipt</p>
      </div>
      <div class="content">
        <h2>Payment Received — Thank You! 🧾</h2>
        <p>Hi ${customerName},</p>
        <p>Your payment has been processed successfully.</p>
        <div class="info-box">
          <div class="info-row"><span class="info-label">Service</span><span class="info-value">${appointmentTitle}</span></div>
          <div class="info-row"><span class="info-label">Amount</span><span class="info-value" style="color:#15803d;font-weight:700">$${amount.toFixed(2)}</span></div>
          <div class="info-row"><span class="info-label">Paid On</span><span class="info-value">${paidDate}</span></div>
          <div class="info-row"><span class="info-label">Method</span><span class="info-value">${paymentMethod}</span></div>
          <div class="info-row"><span class="info-label">Transaction ID</span><span class="info-value">${transactionId}</span></div>
        </div>
        <p>Please keep this email for your records.</p>
      </div>
      ${footer(businessName, businessPhone, businessEmail, businessAddress)}
    </div></body></html>`;

  return { subject, html, text };
}

// Status Update (generic)
export function statusUpdateEmail(data: EmailTemplateData & {
  appointmentTitle: string;
  newStatus: string;
  date: string;
  time: string;
  message?: string;
}): { subject: string; html: string; text: string } {
  const { businessName, businessPhone, businessEmail, businessAddress, customerName, appointmentTitle, newStatus, date, time, message } = data;
  const statusLabel = newStatus.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const subject = `📋 Appointment Update — ${appointmentTitle} → ${statusLabel}`;
  const text = `Hi ${customerName},\n\nYour appointment status has been updated.\n\nService: ${appointmentTitle}\nNew Status: ${statusLabel}\nDate: ${date}\nTime: ${time}\n${message ? 'Note: ' + message : ''}\n\n${businessName}`;

  const statusClass = newStatus === 'completed' ? 'status-completed' : newStatus === 'approved' ? 'status-approved' : 'status-scheduled';

  const html = `
    <!DOCTYPE html><html><head>${baseStyles()}</head><body>
    <div class="container">
      <div class="header">
        <h1>🌿 ${businessName}</h1>
        <p>Appointment Update</p>
      </div>
      <div class="content">
        <h2>Your appointment status has changed</h2>
        <p>Hi ${customerName},</p>
        <p>Your appointment has been updated:</p>
        <div class="info-box">
          <div class="info-row"><span class="info-label">Service</span><span class="info-value">${appointmentTitle}</span></div>
          <div class="info-row"><span class="info-label">New Status</span><span class="info-value"><span class="status-badge ${statusClass}">${statusLabel}</span></span></div>
          <div class="info-row"><span class="info-label">Date</span><span class="info-value">${date}</span></div>
          <div class="info-row"><span class="info-label">Time</span><span class="info-value">${time}</span></div>
        </div>
        ${message ? `<p><em>${message}</em></p>` : ''}
        <p>Questions? Contact us at ${businessPhone}.</p>
      </div>
      ${footer(businessName, businessPhone, businessEmail, businessAddress)}
    </div></body></html>`;

  return { subject, html, text };
}