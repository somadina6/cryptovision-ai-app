// invoke-function.js
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function invokeUpdateTokens() {
  try {
    console.log('Making request to:', `${supabaseUrl}/functions/v1/update-tokens`)
    
    // Using fetch directly for more control over the response
    const response = await fetch(`${supabaseUrl}/functions/v1/update-tokens`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    })

    const responseText = await response.text()
    console.log('Status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers))
    
    try {
      const responseJson = JSON.parse(responseText)
      console.log('Response body:', responseJson)
    } catch {
      console.log('Raw response:', responseText)
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

invokeUpdateTokens()