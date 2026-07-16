export function getImageUrl(path) {
  if (!path) return path
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const base = import.meta.env.BASE_URL
  // If path already starts with base URL, return as-is (already encoded by LOCAL helper)
  if (path.startsWith(base)) return path
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${base}${encodeURI(cleanPath)}`
}
