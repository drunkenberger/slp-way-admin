import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'

interface FileUploadProps {
  onFileUploaded: (url: string) => void
  folder: string
  existingFileUrl?: string
  allowedTypes?: string[]
  maxSizeMB?: number
  label?: string
}

export default function FileUpload({ 
  onFileUploaded, 
  folder, 
  existingFileUrl,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp'],
  maxSizeMB = 5,
  label = 'Choose File'
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(existingFileUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }

    const file = e.target.files[0]
    
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      toast.error(`File is too large. Maximum size is ${maxSizeMB}MB.`)
      return
    }
    
    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      const allowedExtensions = allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')
      toast.error(`Invalid file type. Please upload one of these formats: ${allowedExtensions}`)
      return
    }

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const fileReader = new FileReader()
      fileReader.onload = () => {
        if (typeof fileReader.result === 'string') {
          setPreview(fileReader.result)
        }
      }
      fileReader.readAsDataURL(file)
    } else {
      // For non-image files, just show the name
      setPreview(null)
    }

    try {
      setUploading(true)
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `${folder}/${fileName}`
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }
      
      // Get public URL
      const { data } = supabase.storage.from('images').getPublicUrl(filePath)
      
      if (data?.publicUrl) {
        onFileUploaded(data.publicUrl)
        toast.success('File uploaded successfully!')
      }
    } catch (error: any) {
      let errorMessage = 'Error uploading file'
      
      if (error.message === 'Bucket does not exist') {
        errorMessage = 'Storage bucket not found. Please check your Supabase configuration.'
      } else if (error.message.includes('Permission denied')) {
        errorMessage = 'Permission denied when uploading. Check Supabase storage permissions.'
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`
      }
      
      toast.error(errorMessage)
      console.error('Error uploading file:', error)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const formatAllowedTypes = () => {
    if (allowedTypes.length === 0) return 'All files'
    const extensions = allowedTypes.map(type => {
      const ext = type.split('/')[1]
      return ext === '*' ? 'All files' : ext.toUpperCase()
    })
    return extensions.join(', ')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(',')}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id="file-upload"
        />
        <label 
          htmlFor="file-upload"
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition"
        >
          {uploading ? 'Uploading...' : label}
        </label>
        <span className="text-sm text-gray-500">
          {uploading ? 'Please wait...' : `${formatAllowedTypes()} up to ${maxSizeMB}MB`}
        </span>
      </div>

      {preview && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Preview:</p>
          <img 
            src={preview} 
            alt="Preview" 
            className="max-w-xs max-h-48 object-contain border border-gray-200 rounded"
          />
        </div>
      )}

      {existingFileUrl && !preview && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Current file:</p>
          <a 
            href={existingFileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline break-all"
          >
            {existingFileUrl.split('/').pop()}
          </a>
        </div>
      )}
    </div>
  )
} 