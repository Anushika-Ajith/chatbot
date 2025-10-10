import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {authenticateToken}  from "../middleware/auth.middleware.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

dotenv.config();
const router = express.Router();

/**
 * POST /api/chatbot/token
 * Generates a short-lived chatbot token for Socket.IO connections.
 */
router.post("/token", authenticateToken, async (req, res) => {
  try {
    const user = req.user; // set by auth.middleware

    if (!user || !user.id) {
      return errorResponse(res, "User not authenticated", 401);
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        type: "chatbot",
      },
      process.env.JWT_SECRET,
      { expiresIn: "2m" } // 2 minutes validity
    );

    return successResponse(res, "Chatbot token generated successfully", {
      token,
      expiresIn: 120,
    });
  } catch (err) {
    console.error("Error generating chatbot token:", err);
    return errorResponse(res, "Failed to generate chatbot token", 500);
  }
});

export default router;
