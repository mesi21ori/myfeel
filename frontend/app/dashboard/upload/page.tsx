"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, ImageIcon, LinkIcon, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface UploadedFile {
  id: string
  file: File
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  type: string
}

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [urlInput, setUrlInput] = useState("")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: "uploading",
      progress: 0,
      type: file.type.includes("pdf")
        ? "PDF"
        : file.type.includes("doc")
          ? "DOC"
          : file.type.includes("image")
            ? "IMG"
            : "TXT",
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])

    // Simulate upload and processing
    newFiles.forEach((fileObj) => {
      simulateUpload(fileObj.id)
    })
  }, [])

  const simulateUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 20
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, status: "processing", progress: 100 } : f)),
        )

        // Simulate processing
        setTimeout(() => {
          setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "completed" } : f)))
        }, 2000)
      } else {
        setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)))
      }
    }, 200)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 5,
  })

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        file: new File([""], "Web Content", { type: "text/html" }),
        status: "uploading",
        progress: 0,
        type: "URL",
      }
      setUploadedFiles((prev) => [...prev, newFile])
      simulateUpload(newFile.id)
      setUrlInput("")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "uploading":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Documents</h1>
        <p className="text-gray-600 mt-1">
          Upload your study materials and let AI transform them into interactive learning resources
        </p>
      </div>

      <Tabs defaultValue="files" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="files">Upload Files</TabsTrigger>
          <TabsTrigger value="url">From URL</TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="space-y-6">
          {/* Upload Area */}
          <Card>
            <CardContent className="p-6">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-brand-300" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {isDragActive ? "Drop files here" : "Drag & drop files here"}
                    </p>
                    <p className="text-gray-500 mt-1">or click to browse files</p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="secondary">PDF</Badge>
                    <Badge variant="secondary">DOCX</Badge>
                    <Badge variant="secondary">TXT</Badge>
                    <Badge variant="secondary">Images</Badge>
                  </div>
                  <p className="text-xs text-gray-400">Maximum 5 files, up to 10MB each</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="url" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Import from URL
              </CardTitle>
              <CardDescription>Extract content from web pages, articles, or online documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Website URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com/article"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleUrlSubmit} disabled={!urlInput.trim()}>
                    Import
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                We'll extract the main content from the webpage and process it for analysis.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>Track the progress of your document processing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((fileObj) => (
                <div key={fileObj.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    {fileObj.type === "PDF" && <FileText className="h-8 w-8 text-red-600" />}
                    {fileObj.type === "DOC" && <FileText className="h-8 w-8 text-brand-300" />}
                    {fileObj.type === "IMG" && <ImageIcon className="h-8 w-8 text-green-600" />}
                    {fileObj.type === "URL" && <LinkIcon className="h-8 w-8 text-purple-600" />}
                    {fileObj.type === "TXT" && <FileText className="h-8 w-8 text-gray-600" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 truncate">{fileObj.file.name}</p>
                      <Badge variant="outline" className={getStatusColor(fileObj.status)}>
                        {fileObj.status}
                      </Badge>
                    </div>

                    {fileObj.status === "uploading" && (
                      <div className="space-y-1">
                        <Progress value={fileObj.progress} className="h-2" />
                        <p className="text-xs text-gray-500">Uploading... {Math.round(fileObj.progress)}%</p>
                      </div>
                    )}

                    {fileObj.status === "processing" && (
                      <p className="text-sm text-yellow-600">Processing with AI...</p>
                    )}

                    {fileObj.status === "completed" && <p className="text-sm text-green-600">Ready for analysis</p>}
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusIcon(fileObj.status)}
                    {fileObj.status === "completed" && (
                      <Button size="sm" variant="outline">
                        Analyze
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => removeFile(fileObj.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
