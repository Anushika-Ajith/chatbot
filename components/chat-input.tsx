"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { VoiceInput } from "@/components/voice-input"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleVoiceTranscript = (transcript: string) => {
    setMessage(transcript)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={disabled}
        rows={1}
        className="resize-none min-h-[44px] max-h-32"
      />
      <VoiceInput onTranscript={handleVoiceTranscript} disabled={disabled} />
      <Button type="submit" size="icon" disabled={!message.trim() || disabled} className="h-11 w-11 flex-shrink-0">
        <Send className="w-4 h-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  )
}
