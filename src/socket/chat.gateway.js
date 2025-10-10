import { Server } from "socket.io";
import WebSocket from "ws";
import { saveMessageToMongo } from "../services/message.mango.service.js";

let io;

export const initChatSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id);

    socket.on("join_room", (sessionId) => {
      socket.join(sessionId);
      console.log(`👤 User joined room: ${sessionId}`);
    });
    socket.on("send_message", async (data) => {
      const { sessionId, userId, message, clientId } = data;
      console.log(`💬 Message from ${userId} in ${sessionId}:`, message);

      await saveMessageToMongo({
        sessionId,
        sender: "user",
        content: message,
        metadata: { userId, clientId },
      });
      socket.to(sessionId).emit("new_message", {
        sender: "user",
        content: message,
        userId,
        clientId,
        timestamp: new Date(),
      });

      try {
        console.log("🔗 Connecting to Python WS...");

        const ws = new WebSocket(
          `ws://localhost:8000/chat/ws?session_id=${sessionId}&user_id=${userId}`
        );

        let botReply = "";

        ws.on("open", () => {
          console.log("✅ Connected to Python WS");
          ws.send(message); 
        });

        ws.on("message", async (chunk) => {
          const token = chunk.toString();
          botReply += token;

          io.to(sessionId).emit("bot_message", {
            sender: "bot",
            content: token,
          });
        });

        ws.on("close", async () => {
          console.log("🟣 Python WS closed. Full bot reply length:", botReply.length);

          await saveMessageToMongo({
            sessionId,
            sender: "bot",
            content: botReply,
          });
          io.to(sessionId).emit("bot_message", {
            sender: "bot",
            content: botReply,
            timestamp: new Date(),
          });
        });

        ws.on("error", (err) => {
          console.error("❌ Python WS error:", err.message);
          io.to(sessionId).emit("bot_message", {
            sender: "bot",
            content: "Sorry, I couldn’t connect to the AI service.",
          });
        });
      } catch (err) {
        console.error("AI WS connection failed:", err.message);
        io.to(sessionId).emit("bot_message", {
          sender: "bot",
          content: "Something went wrong with the AI connection.",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) console.error("❌ Socket.io not initialized yet!");
  return io;
};
