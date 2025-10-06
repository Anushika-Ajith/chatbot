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
import appointmentRoutes from "./routes/appointment.routes.js";






const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Connect DB
connectDB();
connectMongo();

// Routes
app.use("/api/users", userRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);

app.use("/api/chat", chatRoutes);
app.use("/api/appointments", appointmentRoutes);


export default app;
