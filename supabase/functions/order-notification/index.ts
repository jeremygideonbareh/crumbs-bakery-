// Supabase Edge Function — order-notification
// Triggered by Database Webhook on orders INSERT
// Sends email to owner + confirmation to customer via Resend

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { Resend } from 'npm:resend@4'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL') ?? 'hello@crumbs.in'
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'orders@crumbs.in'

const resend = new Resend(RESEND_API_KEY)

interface Order {
  id: number
  items: unknown
  customer: Record<string, string> | string
  total: number
  status: string
  message: string | null
  date: string | null
  created_at: string
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

function renderOrderItems(items: unknown): string {
  try {
    const parsed = typeof items === 'string' ? JSON.parse(items) : items as Record<string, unknown>

    if (Array.isArray(parsed) || Array.isArray(parsed.items)) {
      const itemArr = Array.isArray(parsed) ? parsed : parsed.items
      if (itemArr.length > 0) {
        let html = '<table style="width:100%;border-collapse:collapse;">'
        for (const item of itemArr) {
          html += `<tr><td style="padding:4px 0;color:#666;">${escapeHtml(String(item.name ?? ''))} × ${item.qty || 1}</td>`
          html += `<td style="padding:4px 0;text-align:right;font-weight:600;">₹${item.price}</td></tr>`
        }
        html += '</table>'
        return html
      }
    }

    const extras = Array.isArray(parsed.extras) ? parsed.extras : []
    let html = '<table style="width: 100%; border-collapse: collapse;">'
    if (parsed.base) html += `<tr><td style="padding: 4px 0; color: #666;">Base</td><td style="padding: 4px 0; text-align: right; font-weight: 600;">${escapeHtml(String((parsed.base as any).name ?? ''))}</td></tr>`
    if (parsed.size) html += `<tr><td style="padding: 4px 0; color: #666;">Size</td><td style="padding: 4px 0; text-align: right; font-weight: 600;">${escapeHtml(String((parsed.size as any).name ?? ''))}</td></tr>`
    if (parsed.filling) html += `<tr><td style="padding: 4px 0; color: #666;">Filling</td><td style="padding: 4px 0; text-align: right; font-weight: 600;">${escapeHtml(String((parsed.filling as any).name ?? ''))}</td></tr>`
    if (parsed.frosting) html += `<tr><td style="padding: 4px 0; color: #666;">Frosting</td><td style="padding: 4px 0; text-align: right; font-weight: 600;">${escapeHtml(String((parsed.frosting as any).name ?? ''))}</td></tr>`
    if (extras.length > 0) {
      html += `<tr><td style="padding: 4px 0; color: #666; vertical-align: top;">Extras</td><td style="padding: 4px 0; text-align: right;">`
      html += extras.map((e: any) => `<div style="font-weight: 600;">${escapeHtml(String(e.name ?? ''))}${e.price > 0 ? ` <span style="color: #999; font-weight: 400;">+₹${e.price}</span>` : ''}</div>`).join('')
      html += '</td></tr>'
    }
    if (parsed.message) html += `<tr><td style="padding: 4px 0; color: #666; vertical-align: top;">Message</td><td style="padding: 4px 0; text-align: right; font-style: italic; color: #555;">"${escapeHtml(String(parsed.message))}"</td></tr>`
    html += '</table>'
    return html
  } catch {
    return '<p>Could not render items</p>'
  }
}

serve(async (req) => {
  try {
    // Only accept POST from Supabase webhook
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    const body = await req.json()
    const { type, table, record } = body

    // Validate webhook payload
    if (type !== 'INSERT' || table !== 'orders') {
      return new Response('Ignored — not an orders INSERT', { status: 200 })
    }

    const order: Order = record
    const customer: Record<string, string> =
      typeof order.customer === 'string'
        ? JSON.parse(order.customer)
        : order.customer

    const customerName = escapeHtml(customer.name ?? 'Customer')
    const customerPhone = escapeHtml(customer.phone ?? 'Not provided')
    const customerEmail = escapeHtml(customer.email ?? '')
    const orderMessage = escapeHtml(order.message ?? 'None')
    const orderDate = escapeHtml(order.date ?? 'Not specified')

    // ── Send notification to owner ──
    const { error: ownerError } = await resend.emails.send({
      from: `Crumbs Bakery <${FROM_EMAIL}>`,
      to: [OWNER_EMAIL],
      subject: `🍰 New Order #${order.id} — ${formatCurrency(order.total)}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #55babd; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">🍰 New Cake Order!</h1>
            <p style="margin: 4px 0 0; opacity: 0.9;">Order #${order.id}</p>
          </div>
          <div style="background: #FFFFF0; padding: 20px; border: 1px solid #C8E4CA; border-radius: 0 0 8px 8px;">
            <h2 style="color: #3d2b1f;">Customer Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #666;">Name</td><td style="padding: 6px 0;"><strong>${customerName}</strong></td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Phone</td><td style="padding: 6px 0;"><strong><a href="tel:${customerPhone}" style="color: #55babd;">${customerPhone}</a></strong></td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Email</td><td style="padding: 6px 0;"><strong><a href="mailto:${customerEmail}" style="color: #55babd;">${customerEmail}</a></strong></td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Total</td><td style="padding: 6px 0;"><strong style="font-size: 18px;">${formatCurrency(order.total)}</strong></td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Date Requested</td><td style="padding: 6px 0;">${orderDate}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Message</td><td style="padding: 6px 0;"><em>${orderMessage}</em></td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Status</td><td style="padding: 6px 0;"><span style="background: #C8E4CA; padding: 2px 8px; border-radius: 4px;">${order.status}</span></td></tr>
            </table>
            <h3 style="color: #3d2b1f; margin-top: 20px;">Order Items</h3>
            ${renderOrderItems(order.items)}
            <hr style="border: none; border-top: 1px solid #C8E4CA; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">Order placed on ${new Date(order.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
        </body>
        </html>
      `,
    })

    if (ownerError) {
      console.error('Failed to send owner notification:', ownerError)
    }

    // ── Send confirmation to customer (routed to owner until domain is verified) ──
    if (customerEmail && customerEmail.includes('@')) {
      const { error: customerError } = await resend.emails.send({
        from: `Crumbs Bakery <${FROM_EMAIL}>`,
        to: [OWNER_EMAIL],
        subject: `🎉 Order #${order.id} Confirmation for ${customerName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #C8E4CA; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #3d2b1f;">Confirmation for ${customerName} 🎉</h1>
              <p style="margin: 4px 0 0; opacity: 0.9;">Customer email: <a href="mailto:${customerEmail}" style="color: white;">${customerEmail}</a></p>
            </div>
            <div style="background: #FFFFF0; padding: 20px; border: 1px solid #C8E4CA;">
              <p>📨 <strong>Forward this to the customer or call them directly.</strong></p>
              <h3 style="color: #3d2b1f;">Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; color: #666;">Order #</td><td style="padding: 6px 0;"><strong>${order.id}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #666;">Total</td><td style="padding: 6px 0;"><strong>${formatCurrency(order.total)}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #666;">Contact</td><td style="padding: 6px 0;"><a href="tel:${customerPhone}">${customerPhone}</a></td></tr>
              </table>
              <h3 style="color: #3d2b1f; margin-top: 16px;">Cake Details</h3>
              ${renderOrderItems(order.items)}
              <hr style="border: none; border-top: 1px solid #C8E4CA; margin: 20px 0;">
              <p style="color: #666; font-size: 12px;">— Crumbs Bakery & Cafe, Shillong</p>
            </div>
          </body>
          </html>
        `,
      })

      if (customerError) {
        console.error('Failed to send customer confirmation:', customerError)
      }
    }

    return new Response(
      JSON.stringify({ success: true, order_id: order.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Order notification error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
