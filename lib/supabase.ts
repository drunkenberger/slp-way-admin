import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

export const supabase = createClient(
  supabaseUrl || 'https://omxporaecrqsqhzjzvnx.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9teHBvcmFlY3Jxc3Foemp6dm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODIzMzAsImV4cCI6MjA1ODQ1ODMzMH0._a_CuQs5mc-hckxwv7TJifeihCPcpXxAifWCrZOdHlg'
)

// Initialize storage bucket
const initializeStorage = async () => {
  try {
    // Check if the images bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets()
    
    if (error) {
      console.error('Error checking storage buckets:', error)
      return
    }
    
    const imagesBucketExists = buckets.some(bucket => bucket.name === 'images')
    
    if (!imagesBucketExists) {
      // Create the images bucket with public access
      const { error: createError } = await supabase.storage.createBucket('images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB in bytes
        allowedMimeTypes: [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/svg+xml',
          'image/bmp'
        ]
      })
      
      if (createError) {
        console.error('Error creating images bucket:', createError)
      } else {
        console.log('Created images storage bucket')
      }
    }
  } catch (err) {
    console.error('Error initializing storage:', err)
  }
}

// Only run in browser context to prevent issues during server-side rendering
if (typeof window !== 'undefined') {
  initializeStorage()
} 