export function getImageUrl(path) {
  if (!path) return path
  if (path.startsWith('http://') || path.startsWith('https://')) return encodeURI(path)
  const base = import.meta.env.BASE_URL
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${base}${encodeURI(cleanPath)}`
}
