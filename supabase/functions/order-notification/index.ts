// Supabase Edge Function — order-notification
// Triggered by Database Webhook on orders INSERT
// Sends WhatsApp message to Lily with pre-order details via Meta Cloud API

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { sendWhatsAppMessage, formatPreOrderMessage } from './whatsapp.ts'

const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID') ?? ''
const WHATSAPP_ACCESS_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN') ?? ''
const LILY_WHATSAPP_NUMBER = Deno.env.get('LILY_WHATSAPP_NUMBER') ?? ''

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
    const customer: Record<string, string> =
      typeof order.customer === 'string'
        ? JSON.parse(order.customer)
        : order.customer

    // Format the WhatsApp message
    const itemsStr = typeof order.items === 'string'
      ? order.items
      : JSON.stringify(order.items)

    const messageBody = formatPreOrderMessage({
      id: order.id,
      customer,
      items: itemsStr,
      total: order.total,
      message: order.message,
      date: order.date,
    })

    // Send WhatsApp to Lily
    if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ACCESS_TOKEN || !LILY_WHATSAPP_NUMBER) {
      console.error('WhatsApp env vars not configured')
      return new Response(
        JSON.stringify({ success: false, error: 'WhatsApp env vars not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const result = await sendWhatsAppMessage(
      {
        phoneNumberId: WHATSAPP_PHONE_NUMBER_ID,
        accessToken: WHATSAPP_ACCESS_TOKEN,
      },
      LILY_WHATSAPP_NUMBER,
      messageBody
    )

    if (!result.success) {
      console.error('Failed to send WhatsApp notification:', result.error)
      return new Response(
        JSON.stringify({ success: false, error: result.error }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log(`WhatsApp notification sent for pre-order #${order.id}`)

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
