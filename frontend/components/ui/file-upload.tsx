"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import { CustomButton } from "./custom-button"
import { CustomCard } from "./custom-card"
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react"
import { fileUploadSchema } from "@/lib/validations"
import { formatFileSize } from "@/lib/utils"

export interface UploadedFile {
  id: string
  file: File
  status: "uploading" | "processing" | "completed" | "error"
  progress?: number
  error?: string
}

export interface FileUploadProps {
  onFilesChange?: (files: UploadedFile[]) => void
  maxFiles?: number
  maxSize?: number
  accept?: Record<string, string[]>
  className?: string
  disabled?: boolean
}

const CustomFileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      onFilesChange,
      maxFiles = 5,
      maxSize = 10 * 1024 * 1024, // 10MB
      accept = {
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        "text/plain": [".txt"],
        "image/*": [".png", ".jpg", ".jpeg"],
      },
      className,
      disabled = false,
    },
    ref,
  ) => {
    const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([])

    const onDrop = React.useCallback(
      (acceptedFiles: File[], rejectedFiles: any[]) => {
        // Validate files
        const validFiles: UploadedFile[] = []
        const errors: string[] = []

        acceptedFiles.forEach((file) => {
          try {
            fileUploadSchema.parse({ file })
            if (file.size > maxSize) {
              errors.push(`${file.name} is too large (max ${formatFileSize(maxSize)})`)
              return
            }

            validFiles.push({
              id: Math.random().toString(36).substr(2, 9),
              file,
              status: "uploading",
              progress: 0,
            })
          } catch (error) {
            errors.push(`${file.name} is not a supported file type`)
          }
        })

        rejectedFiles.forEach((rejection) => {
          errors.push(`${rejection.file.name}: ${rejection.errors[0]?.message || "Invalid file"}`)
        })

        if (validFiles.length > 0) {
          const newFiles = [...uploadedFiles, ...validFiles].slice(0, maxFiles)
          setUploadedFiles(newFiles)
          onFilesChange?.(newFiles)

          // Simulate upload progress
          validFiles.forEach((fileObj) => {
            simulateUpload(fileObj.id)
          })
        }

        if (errors.length > 0) {
          console.error("File upload errors:", errors)
        }
      },
      [uploadedFiles, maxFiles, maxSize, onFilesChange],
    )

    const simulateUpload = (fileId: string) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 20
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === fileId ? { ...f, status: "completed", progress: 100 } : f)),
          )
        } else {
          setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)))
        }
      }, 200)
    }

    const removeFile = (fileId: string) => {
      const newFiles = uploadedFiles.filter((f) => f.id !== fileId)
      setUploadedFiles(newFiles)
      onFilesChange?.(newFiles)
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept,
      maxFiles,
      disabled,
    })

    const getStatusIcon = (status: string) => {
      switch (status) {
        case "uploading":
        case "processing":
          return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
        case "completed":
          return <CheckCircle className="h-4 w-4 text-green-600" />
        case "error":
          return <AlertCircle className="h-4 w-4 text-red-600" />
        default:
          return null
      }
    }

    return (
      <div ref={ref} className={cn("space-y-4", className)}>
        {/* Upload Area */}
        <CustomCard
          variant="outlined"
          padding="lg"
          className={cn(
            "border-dashed cursor-pointer transition-colors",
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? "Drop files here" : "Drag & drop files here"}
              </p>
              <p className="text-gray-500 mt-1">or click to browse files</p>
            </div>
            <p className="text-xs text-gray-400">
              Maximum {maxFiles} files, up to {formatFileSize(maxSize)} each
            </p>
          </div>
        </CustomCard>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            {uploadedFiles.map((fileObj) => (
              <CustomCard key={fileObj.id} variant="outlined" padding="sm" hover>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{fileObj.file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(fileObj.file.size)} • {fileObj.status}
                    </p>

                    {fileObj.status === "uploading" && fileObj.progress !== undefined && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${fileObj.progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusIcon(fileObj.status)}
                    <CustomButton variant="ghost" size="icon-sm" onClick={() => removeFile(fileObj.id)}>
                      <X className="h-4 w-4" />
                    </CustomButton>
                  </div>
                </div>
              </CustomCard>
            ))}
          </div>
        )}
      </div>
    )
  },
)
CustomFileUpload.displayName = "CustomFileUpload"

export { CustomFileUpload }
