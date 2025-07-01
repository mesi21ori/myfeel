"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Plus, FileText, MessageSquare, Bot, User, Paperclip, Sparkles } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  attachments?: string[]
}

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  documentContext?: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm your AI study assistant. I can help you analyze documents, create study materials, generate questions, and answer questions about your uploaded content. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "Machine Learning Basics",
      lastMessage: "Can you explain neural networks?",
      timestamp: new Date(Date.now() - 3600000),
      documentContext: "ML_Basics.pdf",
    },
    {
      id: "2",
      title: "History Notes Discussion",
      lastMessage: "What were the causes of WWI?",
      timestamp: new Date(Date.now() - 7200000),
      documentContext: "History_Notes.docx",
    },
    {
      id: "3",
      title: "General Questions",
      lastMessage: "How do I create better study schedules?",
      timestamp: new Date(Date.now() - 86400000),
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(
      () => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: generateAIResponse(inputValue),
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
        setIsLoading(false)
      },
      1000 + Math.random() * 2000,
    )
  }

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      "That's a great question! Based on the documents you've uploaded, I can provide some insights. Let me break this down for you...",
      "I can help you with that. From your study materials, here's what I found relevant to your question...",
      "Excellent point! This relates to several concepts we've covered. Let me explain the connections...",
      "I notice you're asking about a topic that appears in your uploaded documents. Here's a comprehensive explanation...",
      "That's an important concept to understand. Based on your learning materials, here's how I'd explain it...",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Chat History Sidebar */}
      <div className="w-80 border-r bg-gray-50 flex flex-col">
        <div className="p-4 border-b">
          <Button className="w-full justify-start bg-transparent" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Chats</h3>
            {chatSessions.map((session) => (
              <Card key={session.id} className="cursor-pointer hover:bg-gray-100 transition-colors">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">{session.title}</p>
                      <p className="text-xs text-gray-500 truncate mt-1">{session.lastMessage}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-400">{formatTime(session.timestamp)}</span>
                        {session.documentContext && (
                          <Badge variant="secondary" className="text-xs">
                            <FileText className="mr-1 h-3 w-3" />
                            {session.documentContext}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b p-4 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-brand-300 to-brand-200 rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">AI Study Assistant</h2>
              <p className="text-sm text-gray-500">Ready to help with your studies</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => (
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
                    message.type === "user" ? "bg-brand-300 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
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

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="flex-shrink-0 bg-transparent">
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your documents or studies..."
                  className="pr-12"
                  disabled={isLoading}
                />
                <Button
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
