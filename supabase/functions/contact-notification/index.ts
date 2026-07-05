// Supabase Edge Function — contact-notification
// Triggered by Database Webhook on contact_messages INSERT
// Sends email notification to owner

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { Resend } from 'npm:resend@4'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL') ?? 'hello@crumbs.in'
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'orders@crumbs.in'

const resend = new Resend(RESEND_API_KEY)

interface ContactMessage {
  id: number
  name: string
  email: string
  phone: string | null
  message: string
  read: boolean
  created_at: string
}

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    const body = await req.json()
    const { type, table, record } = body

    if (type !== 'INSERT' || table !== 'contact_messages') {
      return new Response('Ignored — not a contact_messages INSERT', { status: 200 })
    }

    const msg: ContactMessage = record

    // Send notification to owner
    const { error } = await resend.emails.send({
      from: `Crumbs Bakery Contact <${FROM_EMAIL}>`,
      to: [OWNER_EMAIL],
      subject: `✉️ New Contact Message from ${msg.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #55babd; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">✉️ New Contact Message</h1>
          </div>
          <div style="background: #FFFFF0; padding: 20px; border: 1px solid #C8E4CA; border-radius: 0 0 8px 8px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #666;">Name</td><td style="padding: 6px 0;"><strong>${msg.name}</strong></td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Email</td><td style="padding: 6px 0;"><strong><a href="mailto:${msg.email}" style="color: #55babd;">${msg.email}</a></strong></td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Phone</td><td style="padding: 6px 0;"><strong>${msg.phone ? `<a href="tel:${msg.phone}" style="color: #55babd;">${msg.phone}</a>` : 'Not provided'}</strong></td></tr>
            </table>
            <hr style="border: none; border-top: 1px solid #C8E4CA; margin: 16px 0;">
            <h3 style="color: #3d2b1f;">Message</h3>
            <p style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #C8E4CA; line-height: 1.5;">${msg.message.replace(/\n/g, '<br>')}</p>
            <hr style="border: none; border-top: 1px solid #C8E4CA; margin: 16px 0;">
            <p style="color: #666; font-size: 12px;">Received on ${new Date(msg.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Failed to send contact notification:', error)
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, message_id: msg.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Contact notification error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
