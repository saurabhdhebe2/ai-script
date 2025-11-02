export async function POST(req) {
  try {
    const body = await req.json()
    const token = req.headers.get('Authorization')
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'
    console.log('Backend URL:', backendUrl)
    console.log('Request body:', body)
    
    const response = await fetch(`${backendUrl}/scripts/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token || '',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return Response.json(data, { status: response.status })
  } catch (error) {
    console.error('API Route Error:', error)
    return Response.json(
      { error: 'Failed to generate script', details: error.message },
      { status: 500 }
    )
  }
}
