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

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

function renderOrderItems(items: unknown): string {
  try {
    const parsed = typeof items === 'string' ? JSON.parse(items) : items
    return '<pre>' + JSON.stringify(parsed, null, 2) + '</pre>'
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

    const customerName = customer.name ?? 'Customer'
    const customerPhone = customer.phone ?? 'Not provided'
    const customerEmail = customer.email ?? ''
    const orderMessage = order.message ?? 'None'
    const orderDate = order.date ?? 'Not specified'

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

    // ── Send confirmation to customer ──
    if (customerEmail && customerEmail.includes('@')) {
      const { error: customerError } = await resend.emails.send({
        from: `Crumbs Bakery <${FROM_EMAIL}>`,
        to: [customerEmail],
        subject: `Your Crumbs Bakery Order #${order.id} — Confirmed! 🎉`,
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #C8E4CA; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #3d2b1f;">Thank you, ${customerName}! 🎉</h1>
            </div>
            <div style="background: #FFFFF0; padding: 20px; border: 1px solid #C8E4CA;">
              <p>We've received your custom cake order and will get back to you <strong>within an hour</strong>.</p>
              <h3 style="color: #3d2b1f;">Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; color: #666;">Order #</td><td style="padding: 6px 0;"><strong>${order.id}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #666;">Total</td><td style="padding: 6px 0;"><strong>${formatCurrency(order.total)}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #666;">Contact</td><td style="padding: 6px 0;">We'll call you on <strong>${customerPhone}</strong></td></tr>
              </table>
              <hr style="border: none; border-top: 1px solid #C8E4CA; margin: 20px 0;">
              <p style="color: #666; font-size: 12px;">— Crumbs Bakery & Cafe, Shillong</p>
              <p style="color: #666; font-size: 12px;">📞 <a href="tel:+919612772089" style="color: #55babd;">+91 96127 72089</a></p>
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
