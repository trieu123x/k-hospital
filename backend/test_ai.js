

async function testAI() {
  try {
    const response = await fetch('http://localhost:8000/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: 'fa6b64a8-b7b3-4c3b-bdcf-3a5f61b764b8',
        user_input: 'Chào bạn'
      })
    })
    
    console.log('Status:', response.status)
    const text = await response.text()
    console.log('Response:', text)
  } catch (err) {
    console.error('Error:', err.message)
  }
}

testAI()
