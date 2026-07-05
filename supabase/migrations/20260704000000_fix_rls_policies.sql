-- FIX RLS POLICIES: orders + contact_messages SELECT
-- Run this if you already ran the original migration with USING (false)
-- Paste in Supabase Dashboard → SQL Editor

-- Fix orders: allow admin panel to read
DROP POLICY IF EXISTS "Admins can read orders" ON orders;
CREATE POLICY "Admins can read orders" ON orders FOR SELECT USING (true);

-- Fix contact_messages: allow admin panel to read
DROP POLICY IF EXISTS "Admins can read messages" ON contact_messages;
CREATE POLICY "Admins can read messages" ON contact_messages FOR SELECT USING (true);

-- WARNING: These policies allow any anon key holder to read PII data.
-- Replace with proper auth when Supabase Auth is implemented.
