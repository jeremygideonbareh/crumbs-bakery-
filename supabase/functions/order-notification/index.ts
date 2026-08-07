// Supabase Edge Function — order-notification
// Triggered by Database Webhook on orders INSERT
// Sends an email to the owner with full pre-order details via Resend

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { Resend } from 'npm:resend@4'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL') ?? 'crumbsbakery502@gmail.com'
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'onboarding@resend.dev'

const resend = new Resend(RESEND_API_KEY)

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatInr(n: number): string {
  return '₹' + (Number.isFinite(n) ? n.toLocaleString('en-IN') : '0')
}

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

function parseCustomer(customer: Record<string, string> | string): Record<string, string> {
  if (typeof customer === 'string') {
    try {
      return JSON.parse(customer)
    } catch {
      return {}
    }
  }
  return customer || {}
}

function renderItems(items: unknown): { html: string; error: string | null } {
  let parsed: unknown = items
  if (typeof items === 'string') {
    try {
      parsed = JSON.parse(items)
    } catch {
      return { html: escapeHtml(String(items)), error: null }
    }
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    return { html: escapeHtml(String(items)), error: null }
  }

  const rows = parsed.map((item: any) => {
    const name = escapeHtml(item?.name || 'Item')
    const quantity = item?.quantity || 1
    const price = formatInr(Number(item?.price) || 0)
    const variant = item?.variant ? `<div style="color:#888;font-size:12px;">${escapeHtml(item.variant)}</div>` : ''

    let customizationHtml = ''
    const cust = item?.customizations
    if (cust && typeof cust === 'object') {
      const lines: string[] = []
      if (cust.base?.name) lines.push(`<tr><td style="padding:2px 8px 2px 0;color:#666;font-size:12px;">Base</td><td style="padding:2px 0;font-size:12px;">${escapeHtml(cust.base.name)}</td></tr>`)
      if (cust.size?.name) lines.push(`<tr><td style="padding:2px 8px 2px 0;color:#666;font-size:12px;">Size</td><td style="padding:2px 0;font-size:12px;">${escapeHtml(cust.size.name)}</td></tr>`)
      if (cust.filling?.name) lines.push(`<tr><td style="padding:2px 8px 2px 0;color:#666;font-size:12px;">Filling</td><td style="padding:2px 0;font-size:12px;">${escapeHtml(cust.filling.name)}</td></tr>`)
      if (cust.frosting?.name) lines.push(`<tr><td style="padding:2px 8px 2px 0;color:#666;font-size:12px;">Frosting</td><td style="padding:2px 0;font-size:12px;">${escapeHtml(cust.frosting.name)}</td></tr>`)
      if (Array.isArray(cust.extras) && cust.extras.length > 0) {
        lines.push(`<tr><td style="padding:2px 8px 2px 0;color:#666;font-size:12px;">Extras</td><td style="padding:2px 0;font-size:12px;">${escapeHtml(cust.extras.map((e: any) => e?.name || '').filter(Boolean).join(', '))}</td></tr>`)
      }
      if (cust.message) lines.push(`<tr><td style="padding:2px 8px 2px 0;color:#666;font-size:12px;">Message</td><td style="padding:2px 0;font-size:12px;font-style:italic;">"${escapeHtml(cust.message)}"</td></tr>`)
      if (lines.length > 0) {
        customizationHtml = `
          <table style="margin:4px 0 0 12px;border-collapse:collapse;width:calc(100% - 12px);">
            ${lines.join('\n')}
          </table>`
      }
    }

    return `
      <tr style="border-bottom:1px solid #eee;">
        <td style="padding:8px 6px;font-size:13px;">
          ${name}${variant}${customizationHtml}
        </td>
        <td style="padding:8px 6px;text-align:center;font-size:13px;">× ${quantity}</td>
        <td style="padding:8px 6px;text-align:right;font-size:13px;white-space:nowrap;">${price}</td>
      </tr>`
  }).join('\n')

  return { html: rows, error: null }
}

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    const body = await req.json()
    const { type, table, record } = body

    if (type !== 'INSERT' || table !== 'orders') {
      return new Response('Ignored — not an orders INSERT', { status: 200 })
    }

    const order: Order = record
    const customer = parseCustomer(order.customer)
    const itemsRendered = renderItems(order.items)

    const customerName = escapeHtml(customer.name || 'Unknown')
    const customerPhone = escapeHtml(customer.phone || 'Not provided')
    const customerAddress = escapeHtml(customer.address || 'Pickup')
    const orderDate = escapeHtml(order.date || 'Not specified')
    const orderMessage = escapeHtml(order.message || 'None')
    const total = formatInr(Number(order.total) || 0)
    const placedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

    const { error } = await resend.emails.send({
      from: `Crumbs Bakery Orders <${FROM_EMAIL}>`,
      to: [OWNER_EMAIL],
      subject: `🎂 New Pre-Order #${order.id}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #55babd; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">🎂 New Pre-Order #${order.id}</h1>
          </div>
          <div style="background: #FFFFF0; padding: 20px; border: 1px solid #C8E4CA; border-radius: 0 0 8px 8px;">
            <h3 style="color: #3d2b1f; margin-top: 0;">👤 Customer Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #666;">Name</td><td style="padding: 6px 0;"><strong>${customerName}</strong></td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Phone</td><td style="padding: 6px 0;"><strong>${customerPhone}</strong></td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Address</td><td style="padding: 6px 0;"><strong>${customerAddress}</strong></td></tr>
            </table>
            <hr style="border: none; border-top: 1px solid #C8E4CA; margin: 16px 0;">
            <h3 style="color: #3d2b1f; margin-top: 0;">🛒 Items</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background: #f3f7ef;">
                <th style="padding: 8px 6px; text-align: left; font-size: 12px; color: #666;">Item</th>
                <th style="padding: 8px 6px; text-align: center; font-size: 12px; color: #666;">Qty</th>
                <th style="padding: 8px 6px; text-align: right; font-size: 12px; color: #666;">Price</th>
              </tr>
              ${itemsRendered.html}
            </table>
            <hr style="border: none; border-top: 1px solid #C8E4CA; margin: 16px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #666;">Date Requested</td><td style="padding: 6px 0; text-align: right;"><strong>${orderDate}</strong></td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Notes</td><td style="padding: 6px 0; text-align: right;"><strong>${orderMessage}</strong></td></tr>
              <tr>
                <td style="padding: 8px 0; font-size: 16px; font-weight: bold; color: #3d2b1f;">Total</td>
                <td style="padding: 8px 0; text-align: right; font-size: 18px; font-weight: bold; color: #3d2b1f;">${total}</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #C8E4CA; margin: 16px 0;">
            <p style="color: #666; font-size: 12px;">Placed at ${placedAt}</p>
            <p style="color: #3d2b1f; font-weight: bold; margin-bottom: 0;">── Crumbs Bakery &amp; Cafe</p>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Failed to send order notification:', error)
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Email notification sent for pre-order #${order.id}`)
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
