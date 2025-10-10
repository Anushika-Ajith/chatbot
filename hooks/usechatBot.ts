
"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { apiRequest } from "@/lib/api";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentUserToken } from "@/store/userSlice";

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  content: string;
  timestamp: Date;
  userId?: string;
}

export function useChatbot() {
  const currentToken = useSelector(selectCurrentUserToken);
  const currentUser = useSelector(selectCurrentUser);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const socketRef = useRef<any>(null);

  const genId = () =>
    `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  const addMessage = (msg: ChatMessage) => {
    setMessages((prev) => {
      const exists = prev.some(
        (m) =>
          m.content.trim() === msg.content.trim() &&
          m.sender === msg.sender &&
          Math.abs(
            new Date(m.timestamp).getTime() - new Date(msg.timestamp).getTime()
          ) < 3000
      );
      if (exists) return prev; 
      return [...prev, msg];
    });
  };


  const initializeChat = async () => {
    if (!currentToken) return;

    try {
      
      const chatbotAuth = await apiRequest<{ token: string; expiresIn: number }>(
        "/api/chatbot/token",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${currentToken}`,
            "Content-Type": "application/json",
          },
        }
      );

     
      const userPayload = JSON.parse(atob(currentToken.split(".")[1]));
      const sessionRes = await apiRequest<{ data: { id: string } }>(
        "/api/sessions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${currentToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userPayload.id }),
        }
      );

      const sid = sessionRes.data.id;
      setSessionId(sid);

      
      try {
        const history = await apiRequest<{ data: ChatMessage[] }>(
          `/api/messages/${sid}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${currentToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        setMessages(
          Array.isArray(history.data)
            ? history.data.map((m) => ({
                ...m,
                timestamp: new Date(m.timestamp),
              }))
            : []
        );
      } catch {
        setMessages([
          {
            id: "welcome",
            sender: "bot",
            content:
              "Hello! I'm your AI Health Assistant. I can help you with:\n\n• Booking appointments\n• Checking doctor availability\n• Answering health questions\n\nHow can I assist you today?",
            timestamp: new Date(),
          },
        ]);
      }

      
      const socket = getSocket(chatbotAuth.token);
      socketRef.current = socket;

      socket.emit("join_room", sid);

      
      socket.on("new_message", (raw: any) => {
        if (raw?.content?.trim() === "[END]") return; 

        const msg: ChatMessage = {
          id: genId(),
          sender: raw?.sender === "bot" ? "bot" : "user",
          content: raw?.content || "",
          timestamp: new Date(),
        };

        addMessage(msg);
        setIsTyping(false);
      });

      
      socket.on("bot_message", (raw: any) => {
        if (raw?.content?.trim() === "[END]") return; 

        const msg: ChatMessage = {
          id: genId(),
          sender: "bot",
          content: raw?.content || "",
          timestamp: new Date(),
        };

        addMessage(msg);
        setIsTyping(false);
      });

      socket.on("disconnect", () => console.warn("Socket disconnected"));
      setIsInitialized(true);
    } catch (err) {
      console.error("Chatbot init failed:", err);
    }
  };


  const sendMessage = (content: string) => {
    if (!sessionId || !socketRef.current || !currentUser) return;

    const msg: ChatMessage = {
      id: genId(),
      sender: "user",
      content,
      userId: currentUser.id,
      timestamp: new Date(),
    };

    
    addMessage(msg);
    setIsTyping(true);

    socketRef.current.emit("send_message", {
      sessionId,
      userId: currentUser.id,
      message: content,
    });
  };

  const resetChat = () => {
    disconnectSocket();
    setMessages([]);
    setSessionId(null);
    setIsInitialized(false);
  };

  return { messages, isTyping, sendMessage, initializeChat, resetChat, isInitialized };
}

