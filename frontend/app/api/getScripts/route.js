export async function GET(req) {
  try {
    const token = req.headers.get('Authorization')
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/scripts`, {
      method: 'GET',
      headers: {
        'Authorization': token || '',
      },
    })

    const data = await response.json()

    return Response.json(data, { status: response.status })
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch scripts' },
      { status: 500 }
    )
  }
}
