// WhatsApp Cloud API helper for Supabase Edge Functions
// Uses Meta Cloud API v22.0 to send text messages

const WHATSAPP_API_VERSION = 'v22.0'
const WHATSAPP_BASE_URL = `https://graph.facebook.com/${WHATSAPP_API_VERSION}`

export interface WhatsAppConfig {
  phoneNumberId: string
  accessToken: string
}

/**
 * Sends a plain text WhatsApp message to the specified number.
 * Uses Meta's WhatsApp Cloud API.
 */
export async function sendWhatsAppMessage(
  config: WhatsAppConfig,
  to: string,
  body: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${WHATSAPP_BASE_URL}/${config.phoneNumberId}/messages`
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to.replace(/[^0-9]/g, ''), // strip any non-digit chars
      type: 'text',
      text: { body },
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('WhatsApp API error:', JSON.stringify(result))
      return { success: false, error: result.error?.message || `HTTP ${response.status}` }
    }

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('WhatsApp send failed:', message)
    return { success: false, error: message }
  }
}

/**
 * Formats a pre-order into a WhatsApp message text.
 */
export function formatPreOrderMessage(order: {
  id: number
  customer: Record<string, string>
  items: string
  total: number
  message?: string | null
  date?: string | null
}): string {
  const customerName = order.customer?.name || 'Unknown'
  const customerPhone = order.customer?.phone || 'Not provided'
  const customerAddress = order.customer?.address || 'Pickup'
  const orderDate = order.date || 'Not specified'
  const orderMessage = order.message || 'None'

  let itemsText: string
  try {
    const parsed = typeof order.items === 'string' ? JSON.parse(order.items) : order.items
    if (Array.isArray(parsed)) {
      itemsText = parsed.map((item: any) =>
        `• ${item.name} × ${item.quantity || 1} — ₹${item.price || item.price === 0 ? item.price : '?'}`
      ).join('\n')
    } else {
      itemsText = JSON.stringify(order.items, null, 2)
    }
  } catch {
    itemsText = String(order.items)
  }

  return [
        `🎂 *New Pre-Order #${order.id}*`,
        '',
        `👤 *Customer:* ${customerName}`,
        `📞 *Phone:* ${customerPhone}`,
        `📍 *Address:* ${customerAddress}`,
        `📅 *Date Requested:* ${orderDate}`,
        `💰 *Total:* ₹${order.total.toLocaleString('en-IN')}`,
        '',
        '*Items:*',
        `${itemsText}`,
        '',
        `📝 *Notes:* ${orderMessage}`,
        '',
        `🕐 Placed: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
        '',
        '── Crumbs Bakery & Cafe',
  ].join('\n')
}
