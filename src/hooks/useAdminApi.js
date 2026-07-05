import { supabase } from '@/lib/supabase'
import { useAdminAuth } from '@/pages/admin/AdminLogin'

export function useAdminApi() {
  const { password } = useAdminAuth()

  function rpc(name, params = {}) {
    return supabase.rpc(name, { admin_token: password, ...params })
  }

  return {
    // Orders
    orders: {
      list: () => rpc('admin_read_orders'),
      count: () => rpc('admin_count_orders'),
      recent: (maxCount = 5) => rpc('admin_recent_orders', { max_count: maxCount }),
      updateStatus: (orderId, newStatus) =>
        rpc('admin_update_order_status', { order_id: orderId, new_status: newStatus }),
    },
    // Messages
    messages: {
      list: () => rpc('admin_read_messages'),
      unreadCount: () => rpc('admin_unread_message_count'),
      toggleRead: (msgId) => rpc('admin_toggle_message_read', { msg_id: msgId }),
      delete: (msgId) => rpc('admin_delete_message', { msg_id: msgId }),
    },
    // Settings
    settings: {
      saveBatch: (updates) =>
        rpc('admin_save_settings', { setting_data: updates }),
    },
  }
}
