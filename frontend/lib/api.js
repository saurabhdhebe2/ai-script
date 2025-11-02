export async function callApi(endpoint, method = 'GET', body = null) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(`/api/${endpoint}`, options)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || data.error || 'Request failed')
  }

  return data
}
