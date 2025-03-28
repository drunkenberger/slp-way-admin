// A simple script to test the events table structure
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://omxporaecrqsqhzjzvnx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9teHBvcmFlY3Jxc3Foemp6dm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODIzMzAsImV4cCI6MjA1ODQ1ODMzMH0._a_CuQs5mc-hckxwv7TJifeihCPcpXxAifWCrZOdHlg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkEventsTable() {
  try {
    // First, get the table structure
    console.log('Checking events table structure...');
    
    // Try to insert a test event with start_time
    const testEvent = {
      title: 'Test Event',
      category: 'test',
      description: 'Test description',
      start_date: new Date().toISOString().split('T')[0], // Today's date
      end_date: new Date().toISOString().split('T')[0],   // Today's date
      start_time: '14:30:00', // 2:30 PM
      location: 'Test Location',
      featured: false
    };
    
    console.log('Trying to insert test event with start_time:', testEvent);
    
    const { data: insertData, error: insertError } = await supabase
      .from('events')
      .insert(testEvent)
      .select();
      
    if (insertError) {
      console.error('Error inserting test event:', insertError);
      
      if (insertError.message.includes("column \"start_time\" does not exist")) {
        console.log('The start_time column does not exist. We need to add it to the database.');
        console.log('Please run the following SQL command in your Supabase dashboard:');
        console.log('ALTER TABLE events ADD COLUMN start_time TIME;');
      }
    } else {
      console.log('Successfully inserted test event with start_time!');
      console.log('Inserted data:', insertData);
      
      // Clean up the test data
      if (insertData && insertData.length > 0) {
        const { error: deleteError } = await supabase
          .from('events')
          .delete()
          .eq('id', insertData[0].id);
          
        if (deleteError) {
          console.error('Error deleting test event:', deleteError);
        } else {
          console.log('Test event deleted successfully.');
        }
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkEventsTable(); 