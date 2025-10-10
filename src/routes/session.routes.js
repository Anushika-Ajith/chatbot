import express from "express";
import { body } from "express-validator";
import {
  createOrResumeSession,
  getSessionById,
  getSessionsByUser,
  updateSessionStatus,
} from "../controllers/session.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

/**
 * POST /api/sessions
 * Create or resume session
 */
router.post(
  "/",
  [body("userId").notEmpty().withMessage("userId is required")],
  validateRequest,
  createOrResumeSession
);

/**
 * GET /api/sessions/:id
 * Get session details
 */
router.get("/:id", getSessionById);

/**
 * GET /api/sessions/user/:userId
 * Get all sessions for user
 */
router.get("/user/:userId", getSessionsByUser);

/**
 * PATCH /api/sessions/:id/status
 * Update session status
 */
router.patch(
  "/:id/status",
  [body("status").isString().notEmpty().withMessage("Status is required")],
  validateRequest,
  updateSessionStatus
);

export default router;
