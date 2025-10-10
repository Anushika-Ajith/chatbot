import http from "http"; // <--- ADD THIS LINE
import app from "./app.js";
import dotenv from "dotenv";
import { initChatSocket } from "./socket/chat.gateway.js";

dotenv.config();

const server = http.createServer(app);
initChatSocket(server);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => { 
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📘 Swagger docs at http://localhost:${PORT}/api-docs`);
});