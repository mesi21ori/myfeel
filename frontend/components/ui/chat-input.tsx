"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CustomButton } from "./custom-button"
import { CustomFileUpload, type UploadedFile } from "./file-upload"
import { Badge } from "@/components/ui/badge"
import { Upload, Send, FileText, X, CheckCircle } from "lucide-react"
import { messageSchema } from "@/lib/validations"

export interface ChatInputProps {
  value?: string
  onChange?: (value: string) => void
  onSend?: (message: string) => void
  onFileUpload?: (files: UploadedFile[]) => void
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  uploadedFiles?: UploadedFile[]
  onRemoveFile?: (fileId: string) => void
  className?: string
  showFileUpload?: boolean
  showSupportedTypes?: boolean
}

const ChatInput = React.forwardRef<HTMLDivElement, ChatInputProps>(
  (
    {
      value = "",
      onChange,
      onSend,
      onFileUpload,
      placeholder = "Ask me anything or upload a document to analyze...",
      disabled = false,
      loading = false,
      uploadedFiles = [],
      onRemoveFile,
      className,
      showFileUpload = true,
      showSupportedTypes = true,
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = React.useState(value)
    const [error, setError] = React.useState<string>("")
    const [showUploadArea, setShowUploadArea] = React.useState(false)

    React.useEffect(() => {
      setInputValue(value)
    }, [value])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)
      onChange?.(newValue)

      // Clear error when user starts typing
      if (error) {
        setError("")
      }
    }

    const handleSend = () => {
      try {
        messageSchema.parse({ content: inputValue })
        onSend?.(inputValue)
        setInputValue("")
        onChange?.("")
        setError("")
      } catch (err: any) {
        if (err.errors?.[0]?.message) {
          setError(err.errors[0].message)
        }
      }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    }

    const handleFileUpload = (files: UploadedFile[]) => {
      onFileUpload?.(files)
      setShowUploadArea(false)
    }

    const handleRemoveFile = (fileId: string) => {
      onRemoveFile?.(fileId)
    }

    return (
      <div ref={ref} className={cn("space-y-4", className)}>
        {/* File Upload Area */}
        {showUploadArea && showFileUpload && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Upload Document</h3>
              <CustomButton variant="ghost" size="icon-sm" onClick={() => setShowUploadArea(false)}>
                <X className="h-4 w-4" />
              </CustomButton>
            </div>
            <CustomFileUpload onFilesChange={handleFileUpload} maxFiles={1} className="border-dashed" />
          </div>
        )}

        {/* Main Input Area */}
        <div className="relative">
          <div className="flex items-end gap-2 p-4 bg-white rounded-2xl border border-gray-200 shadow-lg">
            <div className="flex-1">
              <input
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 bg-transparent border-0 resize-none focus:outline-none text-base"
                disabled={disabled || loading}
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Upload Button */}
              {showFileUpload && (
                <CustomButton
                  variant="ghost"
                  size="icon"
                  shape="rounded"
                  className="h-10 w-10 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowUploadArea(!showUploadArea)}
                  disabled={disabled}
                >
                  <Upload className="h-5 w-5 text-gray-600" />
                </CustomButton>
              )}

              {/* Send Button */}
              <CustomButton
                size="icon"
                shape="rounded"
                variant="gradient"
                className="h-10 w-10"
                onClick={handleSend}
                disabled={disabled || loading || !inputValue.trim()}
                loading={loading}
              >
                <Send className="h-4 w-4 text-white" />
              </CustomButton>
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-destructive mt-2 px-4">{error}</p>}
        </div>

        {/* File Upload Feedback */}
        {uploadedFiles.length > 0 && (
          <div className="px-4">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 bg-brand-50 rounded-lg border border-brand-100">
                <FileText className="h-5 w-5 text-brand-300 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand-700 truncate">{file.file.name}</p>
                  <p className="text-sm text-brand-600">
                    {file.status === "processing" ? "Processing..." : "Ready for analysis"}
                  </p>
                </div>
                {file.status === "processing" && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-300"></div>
                )}
                {file.status === "completed" && <CheckCircle className="h-5 w-5 text-green-600" />}
                <CustomButton
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleRemoveFile(file.id)}
                  className="h-6 w-6 hover:bg-brand-100"
                >
                  <X className="h-4 w-4 text-brand-300" />
                </CustomButton>
              </div>
            ))}
          </div>
        )}

        {/* Supported file types */}
        {showSupportedTypes && (
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <span>Supports:</span>
            <Badge variant="secondary" className="text-xs">
              PDF
            </Badge>
            <Badge variant="secondary" className="text-xs">
              DOCX
            </Badge>
            <Badge variant="secondary" className="text-xs">
              TXT
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Images
            </Badge>
          </div>
        )}
      </div>
    )
  },
)
ChatInput.displayName = "ChatInput"

export { ChatInput }
