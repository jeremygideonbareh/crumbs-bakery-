const PROXY_URL = 'http://localhost:3001/api/leads'

export async function submitLead(formData) {
  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })

  const data = await res.json()

  if (!res.ok) {
    const error = new Error(data.message || 'Something went wrong.')
    error.status = res.status
    error.details = data.details || null
    error.statusCode = data.status
    throw error
  }

  return data
}
