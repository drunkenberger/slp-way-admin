import FileUpload from './FileUpload'

interface DocumentUploadProps {
  onDocumentUploaded: (url: string) => void
  folder: string
  existingDocumentUrl?: string
}

export default function DocumentUpload({ onDocumentUploaded, folder, existingDocumentUrl }: DocumentUploadProps) {
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv'
  ]
  
  return (
    <FileUpload
      onFileUploaded={onDocumentUploaded}
      folder={folder}
      existingFileUrl={existingDocumentUrl}
      allowedTypes={documentTypes}
      maxSizeMB={15}
      label="Choose Document"
    />
  )
} 