import { ReplitConnectors } from '@replit/connectors-sdk';
import { config } from './config.js';

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

export async function sendOrderNotification(order) {
  if (!config.ownerEmail || !config.resendFromEmail) {
    return {
      sent: false,
      reason: 'Email notifications are not configured. Set OWNER_EMAIL and RESEND_FROM_EMAIL.'
    };
  }

  const itemsText = order.items
    .map((item) => `${item.quantity} × ${item.name} — ₦${item.unitPrice.toLocaleString()}`)
    .join('\n');
  const itemsHtml = order.items
    .map((item) => `<li>${item.quantity} × ${escapeHtml(item.name)} — ₦${item.unitPrice.toLocaleString()}</li>`)
    .join('');

  const body = {
    from: config.resendFromEmail,
    to: [config.ownerEmail],
    subject: `New Owanana's Kitchen order ${order.orderRef}`,
    text: [
      `New order: ${order.orderRef}`,
      `Customer: ${order.customer.name}`,
      `Phone: ${order.customer.phone}`,
      `Email: ${order.customer.email}`,
      `Address: ${order.customer.address}`,
      '',
      itemsText,
      '',
      `Total: ₦${order.total.toLocaleString()}`,
      order.customer.notes ? `Notes: ${order.customer.notes}` : ''
    ].filter(Boolean).join('\n'),
    html: `
      <h2>New order: ${escapeHtml(order.orderRef)}</h2>
      <p><strong>Customer:</strong> ${escapeHtml(order.customer.name)}<br>
      <strong>Phone:</strong> ${escapeHtml(order.customer.phone)}<br>
      <strong>Email:</strong> ${escapeHtml(order.customer.email)}<br>
      <strong>Address:</strong> ${escapeHtml(order.customer.address)}</p>
      <h3>Items</h3>
      <ul>${itemsHtml}</ul>
      <p><strong>Total: ₦${order.total.toLocaleString()}</strong></p>
      ${order.customer.notes ? `<p><strong>Notes:</strong> ${escapeHtml(order.customer.notes)}</p>` : ''}
    `
  };

  const response = await new ReplitConnectors().proxy('resend', '/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Resend returned ${response.status}: ${details}`);
  }

  return { sent: true };
}