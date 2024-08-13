addEventListener('scheduled', event => {
    event.waitUntil(handleSchedule(event.scheduledTime))
  })
  
  async function handleSchedule(scheduledTime) {
    const endpoint = 'https://nevilleslaw.com/api/daily-content'
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
  
      const result = await response.json()
      console.log('Daily content updated:', result)
    } catch (error) {
      console.error('Error updating daily content:', error)
    }
  }