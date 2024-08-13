addEventListener('scheduled', event => {
    event.waitUntil(handleSchedule(event.scheduledTime))
  })
  
  async function handleSchedule(scheduledTime) {
    const response = await fetch('https://localhost:3000/api/daily-content', {
      method: 'POST',
    })
  
    if (!response.ok) {
      throw new Error('Failed to update daily content')
    }
  
    const result = await response.json()
    console.log('Daily content updated:', result.content)
  
    return new Response('Daily content updated successfully', { status: 200 })
  }