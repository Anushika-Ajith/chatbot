// src/routes/ai.routes.js
import express from "express";
import {streamAIResponse} from "../controllers/aiResponse.controller.js"

const router = express.Router();

/**
 * @swagger
 * /api/ai/stream:
 *   get:
 *     summary: Stream AI responses from Gemini (via Python FastAPI)
 *     description: >
 *       Forwards a live streaming text response from the Python AI microservice using Server-Sent Events (SSE).
 *       This allows the frontend to receive Gemini's generated text progressively.
 *     tags: [AI]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: User query for the AI (e.g. "Book a dental appointment for tomorrow")
 *     responses:
 *       200:
 *         description: Streamed text response (SSE)
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 *               example: |
 *                 data: Sure, I can help you book a dental appointment.\n\n
 *                 data: [END]\n\n
 *       400:
 *         description: Missing query parameter
 *       500:
 *         description: Internal server or connection error
 */
router.get("/stream", streamAIResponse);

export default router;
