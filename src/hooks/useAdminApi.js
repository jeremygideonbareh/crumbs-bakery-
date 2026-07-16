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
    // Reviews
    reviews: {
      list: () => rpc('admin_read_reviews'),
      unapprovedCount: () => rpc('admin_count_unapproved_reviews'),
      toggleApproval: (reviewId) => rpc('admin_toggle_review_approval', { review_id: reviewId }),
      delete: (reviewId) => rpc('admin_delete_review', { review_id: reviewId }),
    },
    // Products
    products: {
      list: () => rpc('admin_read_products'),
      create: (productData) => rpc('admin_create_product', { product_data: productData }),
      update: (productId, productData) =>
        rpc('admin_update_product', { product_id: productId, product_data: productData }),
      delete: (productId) => rpc('admin_delete_product', { product_id: productId }),
    },
    // Categories
    categories: {
      list: () => rpc('admin_read_categories'),
      create: (categoryData) => rpc('admin_create_category', { category_data: categoryData }),
      update: (categoryId, categoryData) =>
        rpc('admin_update_category', { category_id: categoryId, category_data: categoryData }),
      delete: (categoryId) => rpc('admin_delete_category', { category_id: categoryId }),
    },
    // Settings
    settings: {
      saveBatch: (updates) =>
        rpc('admin_save_settings', { setting_data: updates }),
    },
    // Content sections (page-level structured data)
    sections: {
      list: () => rpc('admin_read_page_sections'),
      update: (key, label, type, data) =>
        rpc('admin_upsert_page_section', {
          p_key: key, p_label: label, p_type: type, p_data: data,
        }),
    },
  }
}
