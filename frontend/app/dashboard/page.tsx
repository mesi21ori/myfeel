"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { CustomSidebar } from "@/components/ui/custom-sidebar"
import { StudyTabs } from "@/components/ui/study-tabs"
import { ChatInput } from "@/components/ui/chat-input"
import { CustomButton } from "@/components/ui/custom-button"
import { CustomCard } from "@/components/ui/custom-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Bot, User } from "lucide-react"
import { formatTime } from "@/lib/utils"
import type { UploadedFile } from "@/components/ui/file-upload"
import type { SidebarUser, SidebarItem } from "@/components/ui/custom-sidebar"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  responseType?: "shortnote" | "question" | "reference"
  tabData?: any
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  uploadedFiles: UploadedFile[]
  activeTab: string
  timestamp: Date
}

export default function DashboardPage() {
  const [user, setUser] = useState<SidebarUser | null>(null)
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [activeTab, setActiveTab] = useState("shortnote")
  const [inputValue, setInputValue] = useState("")
  const [isAIProcessing, setIsAIProcessing] = useState(false)
  const router = useRouter()

  // Fetch authenticated user using token
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("access_token")
      if (!token) return router.push("/auth/signin")

      try {
        const response = await fetch("http://localhost:5000/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setUser({
            firstName: data.fullName.split(" ")[0] || data.fullName,
            lastName: data.fullName.split(" ")[1] || "",
            email: data.email,
          })
        } else {
          localStorage.removeItem("access_token")
          router.push("/auth/signin")
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error)
        localStorage.removeItem("access_token")
        router.push("/auth/signin")
      }
    }

    fetchUserProfile()
  }, [])

  // Chat history mock (you can load this from DB later)
  const chatHistory: SidebarItem[] = chatSessions.map((session) => ({
    id: session.id,
    title: session.title,
    onClick: () => loadChatSession(session.id),
  }))

  const loadChatSession = (sessionId: string) => {
    const session = chatSessions.find((s) => s.id === sessionId)
    if (session) {
      setCurrentSession(session)
      setActiveTab(session.activeTab)
    }
  }

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      uploadedFiles: [],
      activeTab: "shortnote",
      timestamp: new Date(),
    }
    setCurrentSession(newSession)
    setActiveTab("shortnote")
    setInputValue("")
  }

  const handleFileUpload = useCallback(
    (files: UploadedFile[]) => {
      if (currentSession) {
        const updatedSession = { ...currentSession, uploadedFiles: files }
        setCurrentSession(updatedSession)
      }
    },
    [currentSession]
  )

  const generateTabResponse = (responseType: string, userInput: string) => {
    switch (responseType) {
      case "shortnote":
        return {
          content: `Here are the key short notes based on your query "${userInput}":`,
          tabData: {
            notes: [
              "Key concepts and main ideas extracted from your document",
              "Important definitions and terminology",
              "Summary of critical information for quick review",
              `Specific insights related to: ${userInput}`,
            ],
          },
        }
      case "question":
        return {
          content: `I've generated questions based on your query "${userInput}":`,
          tabData: {
            questions: [
              { id: "true-false", label: "True/False", example: `Sample true/false question about ${userInput}` },
              { id: "short-answer", label: "Short Answer", example: `Sample short answer question about ${userInput}` },
              {
                id: "multiple-choice",
                label: "Multiple Choice",
                example: `Sample multiple choice question about ${userInput}`,
              },
              {
                id: "fill-blank",
                label: "Fill the Blank",
                example: `Sample fill-in-the-blank question about ${userInput}`,
              },
            ],
          },
        }
      case "reference":
        return {
          content: `Here are reference links related to "${userInput}":`,
          tabData: {
            references: [
              { title: "Related Academic Papers", description: "Semantic Scholar integration" },
              { title: "Auto-generated Citations", description: "APA/MLA format ready" },
            ],
          },
        }
      default:
        return {
          content: `I understand you're asking about "${userInput}". Please select a tab above to see the response.`,
          tabData: null,
        }
    }
  }

  const handleSendMessage = (message: string) => {
    if (!currentSession) {
      createNewChat()
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    }

    const updatedMessages = [...currentSession.messages, userMessage]
    const updatedSession = {
      ...currentSession,
      messages: updatedMessages,
      title: currentSession.title === "New Chat" ? message.slice(0, 30) + "..." : currentSession.title,
    }

    setCurrentSession(updatedSession)
    setIsAIProcessing(true)

    setTimeout(() => {
      const responseData = generateTabResponse(activeTab, message)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: responseData.content,
        timestamp: new Date(),
        responseType: activeTab as "shortnote" | "question" | "reference",
        tabData: responseData.tabData,
      }

      const finalMessages = [...updatedMessages, aiMessage]
      const finalSession = { ...updatedSession, messages: finalMessages, activeTab }
      setCurrentSession(finalSession)

      setChatSessions((prev) => {
        const existingIndex = prev.findIndex((s) => s.id === finalSession.id)
        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = finalSession
          return updated
        } else {
          return [finalSession, ...prev]
        }
      })

      setIsAIProcessing(false)
    }, 2000)
  }

  const handleRemoveFile = (fileId: string) => {
    if (currentSession) {
      const updatedFiles = currentSession.uploadedFiles.filter((f) => f.id !== fileId)
      const updatedSession = { ...currentSession, uploadedFiles: updatedFiles }
      setCurrentSession(updatedSession)
    }
  }

  const handleUserAction = (action: string) => {
    console.log("User action:", action)
    if (action === "logout") {
      localStorage.removeItem("access_token")
      router.push("/auth/signin")
    }
  }

  const handleItemAction = (itemId: string, action: string) => {
    if (action === "delete") {
      setChatSessions((prev) => prev.filter((s) => s.id !== itemId))
      if (currentSession?.id === itemId) setCurrentSession(null)
    }
  }

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab)
    if (currentSession) {
      const updatedSession = { ...currentSession, activeTab: newTab }
      setCurrentSession(updatedSession)
    }
  }

  const renderTabContent = (message: Message) => {
    if (!message.tabData) return null
    // ... the same renderTabContent logic (shortnote, question, reference)
    return null // Or your render logic here
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {user && (
        <CustomSidebar
          user={user}
          title="Chats"
          items={chatHistory}
          onUserAction={handleUserAction}
          onItemAction={handleItemAction}
          defaultCollapsed={false}
        />
      )}

      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {currentSession?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "assistant" && (
                  <div className="w-8 h-8 bg-gradient-to-r from-brand-300 to-brand-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    message.type === "user" ? "bg-brand-300 text-white" : "bg-white border shadow-sm"
                  }`}
                >
                  <p className={`leading-relaxed ${message.type === "user" ? "text-white" : "text-gray-900"}`}>
                    {message.content}
                  </p>

                  {message.type === "assistant" && renderTabContent(message)}

                  <p className={`text-xs mt-2 ${message.type === "user" ? "text-brand-50" : "text-gray-500"}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>

                {message.type === "user" && (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}

            {isAIProcessing && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t bg-white p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSendMessage}
              onFileUpload={handleFileUpload}
              uploadedFiles={currentSession?.uploadedFiles || []}
              onRemoveFile={handleRemoveFile}
              loading={isAIProcessing}
              placeholder="upload a document to analyze..."
            />
            <StudyTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              uploadedFiles={[]}
              isProcessing={false}
              className="max-w-4xl mx-[250px]"
            />
          </div>
        </div>

        <div className="fixed bottom-6 right-6">
          <CustomButton
            size="icon-lg"
            shape="rounded"
            variant="gradient"
            className="shadow-lg hover:shadow-xl transition-all"
            onClick={createNewChat}
          >
            <Plus className="h-6 w-6 text-white" />
          </CustomButton>
        </div>
      </div>
    </div>
  )
}
