"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VoiceInputProps {
  onTranscript: (text: string) => void
  disabled?: boolean
}

declare global {
  interface SpeechRecognition extends EventTarget {
    lang: string
    continuous: boolean
    interimResults: boolean
    onstart: (() => void) | null
    onend: (() => void) | null
    onerror: ((event: any) => void) | null
    onresult: ((event: any) => void) | null
    start(): void
    stop(): void
  }

  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition
    }
    webkitSpeechRecognition: {
      new (): SpeechRecognition
    }
  }
}

export function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window === "undefined") return
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser does not support voice recognition.",
        variant: "destructive",
      })
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      onTranscript(transcript)
      setIsRecording(false)
    }

    recognition.onerror = (event: any) => {
      console.error("[Speech Recognition Error]:", event.error)
      setIsRecording(false)

      const message =
        event.error === "not-allowed"
          ? {
              title: "Microphone Access Denied",
              description: "Please allow microphone access to use voice input.",
            }
          : {
              title: "Voice Input Error",
              description: "Failed to recognize speech. Please try again.",
            }

      toast({ ...message, variant: "destructive" })
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current = recognition

    return () => {
      recognition.stop()
    }
  }, [toast, onTranscript])

  const toggleRecording = () => {
    const recognition = recognitionRef.current
    if (!recognition) {
      toast({
        title: "Not Supported",
        description: "Voice input is not supported in your browser.",
        variant: "destructive",
      })
      return
    }

    if (isRecording) {
      recognition.stop()
      setIsRecording(false)
    } else {
      try {
        recognition.start()
        setIsRecording(true)
      } catch (err) {
        console.error("[VoiceInput] Failed to start:", err)
        toast({
          title: "Voice Input Error",
          description: "Unable to start recording. Try again.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <Button
      type="button"
      size="icon"
      variant={isRecording ? "destructive" : "outline"}
      onClick={toggleRecording}
      disabled={disabled}
      className="h-11 w-11 flex-shrink-0 md:hidden"
    >
      {isRecording ? (
        <>
          <MicOff className="w-4 h-4 animate-pulse" />
          <span className="sr-only">Stop recording</span>
        </>
      ) : (
        <>
          <Mic className="w-4 h-4" />
          <span className="sr-only">Start voice input</span>
        </>
      )}
    </Button>
  )
}

