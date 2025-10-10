import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.js";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import { connectMongo } from "./config/mongo.js";
import messageRoutes from "./routes/messages.routes.js"
import appointmentRoutes from "./routes/appointment.routes.js";
import doctorsRoutes from "./routes/doctor.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import chatbotRoutes from "./routes/chatbot.routes.js";
import { emitBotMessage } from "./controllers/chat.controller.js";

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001','http://localhost:8000'], // ⬅️ THIS MUST BE AN ARRAY
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

connectDB();
connectMongo();

app.use("/api/users", userRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);

app.use("/api/chat", chatRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/messages", messageRoutes); 
app.use("/api/ai", aiRoutes);

app.use("/api/sessions", sessionRoutes);

app.use("/api/doctors", doctorsRoutes);

app.use("/api/chatbot", chatbotRoutes);









export default app;
