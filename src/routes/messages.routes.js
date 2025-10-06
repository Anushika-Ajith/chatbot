import { Router } from "express";
import { createMessage, getMessages } from "../controllers/message.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Create a new chat message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatSessionId:
 *                 type: string
 *               sender:
 *                 type: string
 *                 enum: [user, bot, system]
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message saved
 */
router.post("/", authenticateToken, createMessage);

/**
 * @swagger
 * /api/messages/{chatSessionId}:
 *   get:
 *     summary: Get all messages for a chat session
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatSessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Messages fetched successfully
 */
router.get("/:chatSessionId", authenticateToken, getMessages);

export default router;
