import FileUpload from './FileUpload'

interface PdfUploadProps {
  onPdfUploaded: (url: string) => void
  folder: string
  existingPdfUrl?: string
}

export default function PdfUpload({ onPdfUploaded, folder, existingPdfUrl }: PdfUploadProps) {
  const pdfTypes = ['application/pdf']
  
  return (
    <FileUpload
      onFileUploaded={onPdfUploaded}
      folder={folder}
      existingFileUrl={existingPdfUrl}
      allowedTypes={pdfTypes}
      maxSizeMB={10}
      label="Choose PDF"
    />
  )
} 