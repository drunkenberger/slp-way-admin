const fetch = require('node-fetch');

const supabaseUrl = 'https://omxporaecrqsqhzjzvnx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9teHBvcmFlY3Jxc3Foemp6dm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODIzMzAsImV4cCI6MjA1ODQ1ODMzMH0._a_CuQs5mc-hckxwv7TJifeihCPcpXxAifWCrZOdHlg';

async function addColumn() {
  try {
    console.log('Attempting to add start_time column to events table...');
    
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        query: 'ALTER TABLE events ADD COLUMN IF NOT EXISTS start_time TIME;'
      })
    });
    
    const result = await response.text();
    console.log('Response:', response.status, result);
    
    if (response.ok) {
      console.log('Column added successfully!');
    } else {
      console.error('Failed to add column.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

addColumn(); 