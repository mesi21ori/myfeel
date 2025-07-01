 "use client"

import { useState, useCallback } from "react"
import { CustomButton } from "@/components/ui/custom-button"
import { StudyTabs } from "@/components/ui/study-tabs"
import { ChatInput } from "@/components/ui/chat-input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Sparkles, AlertCircle } from "lucide-react"
import NextLink from "next/link"
import { useRouter } from "next/navigation"
import type { UploadedFile } from "@/components/ui/file-upload"

export function LandingPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [activeTab, setActiveTab] = useState("shortnote")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const router = useRouter()

  const handleFileUpload = useCallback((files: UploadedFile[]) => {
    setUploadedFiles(files)
    setIsProcessing(true)
    setTimeout(() => {
      setUploadedFiles((prev) => prev.map((f) => ({ ...f, status: "completed" })))
      setIsProcessing(false)
    }, 3000)
  }, [])

  const handleSendMessage = (message: string) => {
    setShowAuthDialog(true)
  }

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const handleSignIn = () => {
    setShowAuthDialog(false)
    router.push("/auth/signin")
  }

  const handleSignUp = () => {
    setShowAuthDialog(false)
    router.push("/auth/signup")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100">
  <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b">
        <div className="flex items-center">
          <img src="/logo.png" className="h-6 w-auto object-contain" alt="Logo" style={{ transform: "scale(2)" }} />
        </div>

        <div className="flex items-center gap-3">
          <NextLink href="/auth/signin">
            <CustomButton variant="ghost">Sign In</CustomButton>
          </NextLink>
          <NextLink href="/auth/signup">
            <CustomButton variant="gradient">Sign Up</CustomButton>
          </NextLink>
        </div>
      </nav>
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-brand-300 to-brand-200 bg-clip-text text-transparent">mYFeel</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn Smarter, Not Harder – with mYFeel!
          </p>
        </div>
        <div className="max-w-4xl mx-auto mb-8">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            onFileUpload={handleFileUpload}
            uploadedFiles={uploadedFiles}
            onRemoveFile={handleRemoveFile}
            placeholder="Upload a document to analyze..."
          />
        </div>
        <div className="max-w-4xl mx-[470px]">
          <StudyTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            uploadedFiles={uploadedFiles}
            isProcessing={isProcessing}
          />
        </div>
      </div>
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
              <DialogTitle className="text-xl">Get More Accurate Answers</DialogTitle>
            </div>
            <DialogDescription className="text-gray-600">
              For more accurate answers and personalized AI analysis, please login or create an account. This helps us
              provide better insights tailored to your learning needs.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:gap-3">
            <CustomButton variant="outline" onClick={handleSignIn} className="flex-1">
              Sign In
            </CustomButton>
            <CustomButton variant="gradient" onClick={handleSignUp} className="flex-1">
              Create Account
            </CustomButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
