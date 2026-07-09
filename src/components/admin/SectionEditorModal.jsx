import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  X,
  GripVertical,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// ─── SECTION FIELD SCHEMAS ────────────────────────────────────────────
// Each section type defines its editable fields.
// `__array__` key means the whole section data IS an array.
// `type: 'array'` means a sub-field that is an array of items.

const SECTION_FIELDS = {
  hero: [
    { key: 'slogan', label: 'Slogan', type: 'text' },
    { key: 'title', label: 'Title (HTML allowed)', type: 'textarea' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
    { key: 'cta_text', label: 'CTA Button Text', type: 'text' },
    { key: 'background_image', label: 'Background Image URL', type: 'image' },
    { key: 'contact_website', label: 'Website', type: 'text' },
    { key: 'contact_phone', label: 'Phone', type: 'text' },
    { key: 'contact_address', label: 'Address', type: 'text' },
  ],
  stats: [
    {
      key: '__array__',
      label: 'Stats Items',
      type: 'array',
      itemFields: [
        { key: 'number', label: 'Stat Number', type: 'text' },
        { key: 'label', label: 'Stat Label', type: 'text' },
      ],
    },
  ],
  card_grid: [
    {
      key: '__array__',
      label: 'Cards',
      type: 'array',
      itemFields: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'desc', label: 'Description', type: 'textarea' },
        { key: 'cta', label: 'CTA Text', type: 'text' },
        { key: 'href', label: 'Link URL', type: 'text' },
        { key: 'image', label: 'Image URL', type: 'image' },
      ],
    },
  ],
  content_columns: [
    {
      key: '__array__',
      label: 'Columns',
      type: 'array',
      itemFields: [
        { key: 'image', label: 'Image URL', type: 'image' },
        { key: 'heading', label: 'Heading', type: 'text' },
        { key: 'body', label: 'Body Text', type: 'textarea' },
        { key: 'cta', label: 'CTA Text', type: 'text' },
        { key: 'href', label: 'Link URL', type: 'text' },
      ],
    },
  ],
  gallery: [
    {
      key: '__array__',
      label: 'Gallery Images',
      type: 'array',
      itemFields: [
        { key: 'src', label: 'Image URL', type: 'image' },
        { key: 'alt', label: 'Alt Text', type: 'text' },
        { key: 'caption', label: 'Caption', type: 'text' },
      ],
    },
  ],
  news_list: [
    {
      key: '__array__',
      label: 'News Articles',
      type: 'array',
      itemFields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'image', label: 'Image URL', type: 'image' },
        { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
        { key: 'date', label: 'Date', type: 'text' },
      ],
    },
  ],
  menu_items: [
    {
      key: '__array__',
      label: 'Menu Items',
      type: 'array',
      itemFields: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'desc', label: 'Description', type: 'textarea' },
        { key: 'highlight', label: 'Badge Text', type: 'text' },
        { key: 'price', label: 'Price', type: 'text' },
        { key: 'image', label: 'Image URL', type: 'image' },
      ],
    },
  ],
  carousel: [
    {
      key: '__array__',
      label: 'Carousel Slides',
      type: 'array',
      itemFields: [
        { key: 'image', label: 'Image URL', type: 'image' },
        { key: 'label', label: 'Label', type: 'text' },
      ],
    },
  ],
  product_carousel: [
    {
      key: '__array__',
      label: 'Featured Products',
      type: 'array',
      itemFields: [
        { key: 'name', label: 'Product Name', type: 'text' },
        { key: 'price', label: 'Price', type: 'text' },
        { key: 'image', label: 'Image URL', type: 'image' },
      ],
    },
  ],
  delivery: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    {
      key: 'areas',
      label: 'Delivery Areas',
      type: 'array',
      itemFields: [
        { key: 'name', label: 'Area Name', type: 'text' },
        { key: 'image', label: 'Image URL', type: 'image' },
      ],
    },
    { key: 'footer_text', label: 'Footer Text', type: 'textarea' },
    { key: 'cta_text', label: 'CTA Text', type: 'text' },
    { key: 'cta_href', label: 'CTA Link', type: 'text' },
  ],
  faq: [
    {
      key: '__array__',
      label: 'FAQ Items',
      type: 'array',
      itemFields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'image', label: 'Image URL', type: 'image' },
        { key: 'content', label: 'Content', type: 'textarea' },
      ],
    },
  ],
  image_grid: [
    {
      key: '__array__',
      label: 'Images',
      type: 'array',
      itemFields: [
        { key: 'label', label: 'Label', type: 'text' },
        { key: 'image', label: 'Image URL', type: 'image' },
      ],
    },
  ],
  social: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'handle', label: 'Social Handle', type: 'text' },
    {
      key: 'menu_links',
      label: 'Menu Links',
      type: 'array',
      itemFields: [
        { key: 'label', label: 'Label', type: 'text' },
        { key: 'icon', label: 'Emoji Icon', type: 'text' },
        { key: 'href', label: 'Link URL', type: 'text' },
      ],
    },
    {
      key: 'images',
      label: 'Gallery Images',
      type: 'array',
      itemFields: [{ key: '__value__', label: 'Image URL', type: 'image' }],
    },
  ],
  footer: [
    { key: 'brand_name', label: 'Brand Name', type: 'text' },
    { key: 'brand_description', label: 'Brand Description', type: 'textarea' },
    {
      key: 'quick_links',
      label: 'Quick Links',
      type: 'array',
      itemFields: [
        { key: 'label', label: 'Label', type: 'text' },
        { key: 'href', label: 'URL', type: 'text' },
      ],
    },
    {
      key: 'social',
      label: 'Social Links',
      type: 'array',
      itemFields: [
        { key: 'label', label: 'Platform Name', type: 'text' },
        { key: 'href', label: 'URL', type: 'text' },
      ],
    },
    {
      key: 'contact',
      label: 'Contact Info',
      type: 'object',
      objectFields: [
        { key: 'address', label: 'Address', type: 'textarea' },
        { key: 'phone', label: 'Phone', type: 'text' },
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'hours', label: 'Business Hours', type: 'textarea' },
      ],
    },
    { key: 'bottom_text', label: 'Bottom Bar Text', type: 'text' },
  ],
}

// ─── SIMPLE FIELD RENDERER ────────────────────────────────────────────

function SimpleField({ field, value, onChange }) {
  const id = `field-${field.key}`

  switch (field.type) {
    case 'textarea':
      return (
        <div>
          <label htmlFor={id} className="block text-xs font-medium text-gray-600 mb-1">
            {field.label}
          </label>
          <textarea
            id={id}
            value={value ?? ''}
            onChange={(e) => onChange(field.key, e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-xs"
          />
        </div>
      )

    case 'image':
      return (
        <div>
          <label htmlFor={id} className="block text-xs font-medium text-gray-600 mb-1">
            {field.label}
          </label>
          <div className="flex gap-2">
            <input
              id={id}
              type="text"
              value={value ?? ''}
              onChange={(e) => onChange(field.key, e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="https://images.pexels.com/..."
            />
            <ImageIcon size={18} className="text-gray-400 self-center shrink-0" />
          </div>
          {value && (
            <img
              src={value}
              alt="Preview"
              className="mt-2 w-24 h-16 object-cover rounded-lg border border-gray-100"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          )}
        </div>
      )

    case 'text':
    default:
      return (
        <div>
          <label htmlFor={id} className="block text-xs font-medium text-gray-600 mb-1">
            {field.label}
          </label>
          <input
            id={id}
            type="text"
            value={value ?? ''}
            onChange={(e) => onChange(field.key, e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      )
  }
}

// ─── ARRAY ITEM EDITOR (drag-reorder with up/down buttons) ────────────

function ArrayItemEditor({
  item,
  index,
  fields,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
  isFirst,
  isLast,
}) {
  const handleFieldChange = (key, value) => {
    const updated = { ...item, [key]: value }
    onChange(index, updated)
  }

  // If the field uses __value__ as key, treat the item itself as a scalar value
  const isScalarArray = fields.length === 1 && fields[0].key === '__value__'

  if (isScalarArray) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/30">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <GripVertical size={14} className="text-gray-400 shrink-0" />
            <span className="text-xs font-medium text-gray-500 shrink-0">Item {index + 1}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onMoveUp(index)}
              disabled={isFirst}
              className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
              title="Move up"
            >
              <ChevronUp size={14} />
            </button>
            <button
              onClick={() => onMoveDown(index)}
              disabled={isLast}
              className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
              title="Move down"
            >
              <ChevronDown size={14} />
            </button>
            <button
              onClick={() => onRemove(index)}
              className="p-1 hover:bg-red-100 rounded text-red-500"
              title="Remove"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        <div className="mt-2">
          <SimpleField
            field={fields[0]}
            value={typeof item === 'string' ? item : ''}
            onChange={(_key, val) => onChange(index, val)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical size={14} className="text-gray-400 cursor-grab" />
          <span className="text-xs font-medium text-gray-500">Item {index + 1}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMoveUp(index)}
            disabled={isFirst}
            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
            title="Move up"
          >
            <ChevronUp size={14} />
          </button>
          <button
            onClick={() => onMoveDown(index)}
            disabled={isLast}
            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
            title="Move down"
          >
            <ChevronDown size={14} />
          </button>
          <button
            onClick={() => onRemove(index)}
            className="p-1 hover:bg-red-100 rounded text-red-500"
            title="Remove"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {fields.map((field) => (
        <SimpleField
          key={field.key}
          field={field}
          value={item[field.key]}
          onChange={(key, val) => handleFieldChange(key, val)}
        />
      ))}
    </div>
  )
}

// ─── MAIN EDITOR MODAL ────────────────────────────────────────────────

export default function SectionEditorModal({ section, currentData, onSave, onClose }) {
  const [formData, setFormData] = useState(() => JSON.parse(JSON.stringify(currentData || {})))
  const [saving, setSaving] = useState(false)

  const fields = SECTION_FIELDS[section.section_type] || []

  // Check if the section's top-level data IS an array (__array__ at root)
  const isArrayRoot = fields.length === 1 && fields[0].key === '__array__'

  const handleFieldChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleArrayChange = (key, index, value) => {
    setFormData((prev) => {
      const arr = [...(prev[key] || [])]
      arr[index] = value
      return { ...prev, [key]: arr }
    })
  }

  const handleArrayAdd = useCallback((key) => {
    setFormData((prev) => {
      const arr = [...(prev[key] || [])]
      arr.push({})
      return { ...prev, [key]: arr }
    })
  }, [])

  const handleArrayRemove = useCallback((key, index) => {
    setFormData((prev) => {
      const arr = (prev[key] || []).filter((_, i) => i !== index)
      return { ...prev, [key]: arr }
    })
  }, [])

  const handleArrayMove = useCallback((key, index, direction) => {
    setFormData((prev) => {
      const arr = [...(prev[key] || [])]
      const targetIndex = index + direction
      if (targetIndex < 0 || targetIndex >= arr.length) return prev
      ;[arr[index], arr[targetIndex]] = [arr[targetIndex], arr[index]]
      return { ...prev, [key]: arr }
    })
  }, [])

  const handleRootArrayChange = (index, value) => {
    const arr = [...(Array.isArray(formData) ? formData : [])]
    arr[index] = value
    setFormData(arr)
  }

  const handleRootArrayAdd = () => {
    const arr = [...(Array.isArray(formData) ? formData : [])]
    arr.push({})
    setFormData(arr)
  }

  const handleRootArrayRemove = (index) => {
    const arr = (Array.isArray(formData) ? formData : []).filter((_, i) => i !== index)
    setFormData(arr)
  }

  const handleRootArrayMove = (index, direction) => {
    const arr = [...(Array.isArray(formData) ? formData : [])]
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= arr.length) return
    ;[arr[index], arr[targetIndex]] = [arr[targetIndex], arr[index]]
    setFormData(arr)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(formData)
    } finally {
      setSaving(false)
    }
  }

  // ─── RENDER ───────────────────────────────────────────────────────

  const renderField = (field) => {
    // Handle array-type fields
    if (field.type === 'array' && field.key !== '__array__') {
      const items = formData[field.key] || []
      return (
        <div key={field.key} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-gray-600">{field.label}</label>
            <Button
              variant="neutral"
              size="sm"
              onClick={() => handleArrayAdd(field.key)}
              className="gap-1 text-xs"
            >
              <Plus size={12} /> Add Item
            </Button>
          </div>
          {items.length === 0 && (
            <p className="text-xs text-gray-400 italic">No items yet. Click "Add Item" to begin.</p>
          )}
          {items.map((item, i) => (
            <ArrayItemEditor
              key={i}
              item={item}
              index={i}
              fields={field.itemFields}
              onChange={(idx, val) => handleArrayChange(field.key, idx, val)}
              onMoveUp={(idx) => handleArrayMove(field.key, idx, -1)}
              onMoveDown={(idx) => handleArrayMove(field.key, idx, 1)}
              onRemove={(idx) => handleArrayRemove(field.key, idx)}
              isFirst={i === 0}
              isLast={i === items.length - 1}
            />
          ))}
        </div>
      )
    }

    // Handle object-type fields
    if (field.type === 'object') {
      const obj = formData[field.key] || {}
      return (
        <div
          key={field.key}
          className="space-y-3 p-3 border border-gray-200 rounded-lg bg-gray-50/30"
        >
          <label className="block text-xs font-medium text-gray-600">{field.label}</label>
          {field.objectFields.map((subField) => (
            <SimpleField
              key={subField.key}
              field={subField}
              value={obj[subField.key]}
              onChange={(key, val) => {
                setFormData((prev) => ({
                  ...prev,
                  [field.key]: { ...(prev[field.key] || {}), [key]: val },
                }))
              }}
            />
          ))}
        </div>
      )
    }

    // Handle simple fields (text, textarea, image)
    return (
      <SimpleField
        key={field.key}
        field={field}
        value={formData[field.key]}
        onChange={handleFieldChange}
      />
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-semibold text-gray-900">{section.section_label}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Type: {section.section_type}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={16} />
          </button>
        </div>

        {/* Body - scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {fields.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              No editable fields defined for this section type.
            </p>
          ) : isArrayRoot ? (
            /* Whole section is an array (e.g., stats, card_grid, gallery) */
            <div key="root-array" className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-gray-600">
                  {fields[0].label}
                </label>
                <Button
                  variant="neutral"
                  size="sm"
                  onClick={handleRootArrayAdd}
                  className="gap-1 text-xs"
                >
                  <Plus size={12} /> Add Item
                </Button>
              </div>
              {(Array.isArray(formData) ? formData : []).length === 0 && (
                <p className="text-xs text-gray-400 italic">
                  No items yet. Click "Add Item" to begin.
                </p>
              )}
              {(Array.isArray(formData) ? formData : []).map((item, i) => (
                <ArrayItemEditor
                  key={i}
                  item={item}
                  index={i}
                  fields={fields[0].itemFields}
                  onChange={(idx, val) => handleRootArrayChange(idx, val)}
                  onMoveUp={(idx) => handleRootArrayMove(idx, -1)}
                  onMoveDown={(idx) => handleRootArrayMove(idx, 1)}
                  onRemove={(idx) => handleRootArrayRemove(idx)}
                  isFirst={i === 0}
                  isLast={i === (Array.isArray(formData) ? formData : []).length - 1}
                />
              ))}
            </div>
          ) : (
            /* Regular object fields */
            fields.map(renderField)
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100 shrink-0">
          <Button variant="neutral" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} size="sm" className="gap-1">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
