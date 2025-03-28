import FileUpload from './FileUpload'

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  folder: string
  existingImageUrl?: string
}

export default function ImageUpload({ onImageUploaded, folder, existingImageUrl }: ImageUploadProps) {
  const imageTypes = [
    'image/jpeg', 
    'image/png', 
    'image/gif', 
    'image/webp', 
    'image/svg+xml', 
    'image/bmp'
  ]
  
  return (
    <FileUpload
      onFileUploaded={onImageUploaded}
      folder={folder}
      existingFileUrl={existingImageUrl}
      allowedTypes={imageTypes}
      maxSizeMB={5}
      label="Choose Image"
    />
  )
} 