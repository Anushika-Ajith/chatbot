import { Router } from "express";
import { createChatSession, createAppointment } from "../controllers/chat.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/chat/session:
 *   post:
 *     summary: Create a new chat session for a user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Chat session created
 */
router.post("/session", authenticateToken, createChatSession);

/**
 * @swagger
 * /api/chat/appointment:
 *   post:
 *     summary: Create a new appointment linked to a chat session
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               providerId:
 *                 type: string
 *               chatSessionId:
 *                 type: string
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment created
 */
router.post("/appointment", authenticateToken, createAppointment);

export default router;
