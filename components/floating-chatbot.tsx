// "use client"

// import { useState, useEffect, useRef } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { ChatBubble, type Message } from "@/components/chat-bubble"
// import { ChatInput } from "@/components/chat-input"
// import { TypingIndicator } from "@/components/typing-indicator"
// import { MessageSquare, X, Minimize2 } from "lucide-react"
// // import { getToken } from "@/lib/auth"
// import { getSocket, disconnectSocket } from "@/lib/socket"
// import { apiRequest } from "@/lib/api"
// import { useSelector } from "react-redux"
// import { selectCurrentUserToken } from "@/store/userSlice"

// export function FloatingChatbot() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [messages, setMessages] = useState<Message[]>([])
//   const [isTyping, setIsTyping] = useState(false)
//   const [isInitialized, setIsInitialized] = useState(false)
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const currentToken = useSelector(selectCurrentUserToken)

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }

//   useEffect(() => {
//     scrollToBottom()
//   }, [messages, isTyping])

//   useEffect(() => {
//     if (isOpen && !isInitialized) {
//       const initializeChat = async () => {
//         try {
//           const history = await apiRequest<Message[]>("/api/chatbot/history")
//           setMessages(history)
//         } catch (error) {
//           console.error("Failed to fetch chat history:", error)
//           setMessages([
//             {
//               id: "welcome",
//               content:
//                 "Hello! I'm your AI Health Assistant. I can help you with:\n\n• Booking appointments\n• Answering health questions\n• Providing medication information\n• General health guidance\n\nHow can I assist you today?",
//               sender: "bot",
//               timestamp: new Date(),
//             },
//           ])
//         }
//         setIsInitialized(true)

//         const token = currentToken
//         if (token) {
//           const socket = getSocket(token)

//           socket.on("bot_response", (data: { message: string }) => {
//             setIsTyping(false)
//             setMessages((prev) => [
//               ...prev,
//               {
//                 id: Date.now().toString(),
//                 content: data.message,
//                 sender: "bot",
//                 timestamp: new Date(),
//               },
//             ])
//           })

//           socket.on("error", (error: Error) => {
//             console.error("Socket error:", error)
//             setIsTyping(false)
//           })
//         }
//       }

//       initializeChat()
//     }

//     return () => {
//       if (!isOpen) {
//         disconnectSocket()
//       }
//     }
//   }, [isOpen, isInitialized])

//   const handleSendMessage = (content: string) => {
//     const userMessage: Message = {
//       id: Date.now().toString(),
//       content,
//       sender: "user",
//       timestamp: new Date(),
//     }

//     setMessages((prev) => [...prev, userMessage])
//     setIsTyping(true)

//     const token = currentToken
//     if (token) {
//       const socket = getSocket(token)
//       socket.emit("chat_message", { message: content })
//     } else {
//       setTimeout(() => {
//         setIsTyping(false)
//         setMessages((prev) => [
//           ...prev,
//           {
//             id: (Date.now() + 1).toString(),
//             content:
//               "I'm currently in demo mode. In production, I would connect to the backend to process your request and provide personalized health assistance.",
//             sender: "bot",
//             timestamp: new Date(),
//           },
//         ])
//       }, 1500)
//     }
//   }

//   return (
//     <>
//       {!isOpen && (
//         <Button
//           onClick={() => setIsOpen(true)}
//           size="lg"
//           className="fixed bottom-4 right-4 md:bottom-6 md:right-6 h-12 w-12 md:h-14 md:w-14 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
//         >
//           <MessageSquare className="h-5 w-5 md:h-6 md:w-6" />
//         </Button>
//       )}

//       {isOpen && (
//         <Card className="fixed inset-4 md:inset-auto md:bottom-6 md:right-6 md:w-96 md:h-[600px] h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-4">
//           <CardHeader className="border-b border-border flex flex-row items-center justify-between p-3 md:p-4">
//             <CardTitle className="flex items-center gap-2 text-sm md:text-base">
//               <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-primary" />
//               AI Health Assistant
//             </CardTitle>
//             <div className="flex gap-1">
//               <Button variant="ghost" size="icon" className="h-7 w-7 md:h-8 md:w-8" onClick={() => setIsOpen(false)}>
//                 <Minimize2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-7 w-7 md:h-8 md:w-8"
//                 onClick={() => {
//                   setIsOpen(false)
//                   setIsInitialized(false)
//                   setMessages([])
//                 }}
//               >
//                 <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
//             <div className="flex-1 overflow-y-auto p-3 md:p-4">
//               {messages.map((message) => (
//                 <ChatBubble key={message.id} message={message} />
//               ))}
//               {isTyping && <TypingIndicator />}
//               <div ref={messagesEndRef} />
//             </div>
//             <div className="border-t border-border p-3 md:p-4 bg-card">
//               <ChatInput onSend={handleSendMessage} disabled={isTyping} />
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </>
//   )
// }


"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatBubble } from "@/components/chat-bubble";
import { ChatInput } from "@/components/chat-input";
import { TypingIndicator } from "@/components/typing-indicator";
import { MessageSquare, X, Minimize2 } from "lucide-react";
import { useChatbot } from "@/hooks/usechatBot";

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isTyping, sendMessage, initializeChat, resetChat, isInitialized } = useChatbot();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !isInitialized) {

      console.log("here.. ")
      initializeChat();
    }
    if (!isOpen) {
      resetChat();
    }
  }, [isOpen]);
console.log("MESSAGES: ",messages)
  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 h-12 w-12 md:h-14 md:w-14 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
        >
          <MessageSquare className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed inset-4 md:inset-auto md:bottom-6 md:right-6 md:w-96 md:h-[600px] h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-4">
          <CardHeader className="border-b border-border flex flex-row items-center justify-between p-3 md:p-4">
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              AI Health Assistant
            </CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 md:h-8 md:w-8"
                onClick={() => setIsOpen(true)}
              >
                <Minimize2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 md:h-8 md:w-8"
                onClick={() => {
                  setIsOpen(false);
                  resetChat();
                }}
              >
                <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-3 md:p-4">
              {messages?.map((m) => (
                // <ChatBubble key={m.id} message={m} />
                <ChatBubble key={`${Math.random()}`} message={m} />

              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border p-3 md:p-4 bg-card">
              <ChatInput onSend={sendMessage} disabled={isTyping} />
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
