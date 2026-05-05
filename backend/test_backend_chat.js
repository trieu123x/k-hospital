async function testBackend() {
  try {
    const response = await fetch('http://localhost:5000/chat/fa6b64a8-b7b3-4c3b-bdcf-3a5f61b764b8/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: 'user',
        content: 'Chào bạn'
      })
    })

    
    console.log('Status:', response.status)
    const json = await response.json()
    console.log('Response:', JSON.stringify(json, null, 2))
  } catch (err) {
    console.error('Error:', err.message)
  }
}

testBackend()
