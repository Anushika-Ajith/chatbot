"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChatBubble, type Message } from "@/components/chat-bubble"
import { ChatInput } from "@/components/chat-input"
import { TypingIndicator } from "@/components/typing-indicator"
import { isAuthenticated, getToken } from "@/lib/auth"
import { apiRequest } from "@/lib/api"
import { getSocket, disconnectSocket } from "@/lib/socket"
import { MessageSquare, ArrowLeft } from "lucide-react"

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    const initializeChat = async () => {
      try {
        // Fetch chat history
        const history = await apiRequest<Message[]>("/api/chatbot/history")
        setMessages(history)
      } catch (error) {
        console.error("[v0] Failed to fetch chat history:", error)
        // Add welcome message if no history
        setMessages([
          {
            id: "welcome",
            content:
              "Hello! I'm your AI Health Assistant. I can help you with:\n\n• Booking appointments\n• Answering health questions\n• Providing medication information\n• General health guidance\n\nHow can I assist you today?",
            sender: "bot",
            timestamp: new Date(),
          },
        ])
      } finally {
        setIsLoading(false)
      }

      // Initialize Socket.IO connection
      const token = getToken()
      if (token) {
        const socket = getSocket(token)

        socket.on("connect", () => {
          console.log("[v0] Socket connected")
        })

        socket.on("bot_response", (data: { message: string }) => {
          setIsTyping(false)
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              content: data.message,
              sender: "bot",
              timestamp: new Date(),
            },
          ])
        })

        socket.on("disconnect", () => {
          console.log("[v0] Socket disconnected")
        })

        socket.on("error", (error: Error) => {
          console.error("[v0] Socket error:", error)
          setIsTyping(false)
        })
      }
    }

    initializeChat()

    return () => {
      disconnectSocket()
    }
  }, [router])

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    const token = getToken()
    if (token) {
      const socket = getSocket(token)
      socket.emit("chat_message", { message: content })
    } else {
      // Fallback for development without backend
      setTimeout(() => {
        setIsTyping(false)
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            content:
              "I'm currently in demo mode. In production, I would connect to the backend to process your request and provide personalized health assistance.",
            sender: "bot",
            timestamp: new Date(),
          },
        ])
      }, 1500)
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="mb-2 gap-2 -ml-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-foreground text-balance">AI Health Assistant</h1>
        <p className="text-muted-foreground mt-1">Chat with our AI to get health guidance and book appointments</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatBubble key={message.id} message={message} />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          <div className="border-t border-border p-4 bg-card">
            <ChatInput onSend={handleSendMessage} disabled={isTyping} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
