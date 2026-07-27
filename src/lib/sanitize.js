import DOMPurify from 'dompurify'

const ALLOWED_TAGS = [
  'b', 'i', 'em', 'strong', 'br', 'a', 'span', 'p',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li',
  'div', 'blockquote', 'sub', 'sup', 'u', 's',
]

const ALLOWED_ATTRS = [
  'href', 'class', 'style', 'target', 'rel', 'id',
]

/**
 * Sanitize HTML string against XSS.
 * Only safe tags and attributes are preserved.
 * Returns empty string for falsy input.
 */
export function sanitizeHtml(dirty) {
  if (!dirty) return ''
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTRS,
    ALLOW_DATA_ATTR: false,
  })
}
