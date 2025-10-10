// import { Router } from "express";
// import { checkAvailability, holdSlot, confirmAppointment } from "../controllers/appointment.controller.js";
// import { authenticateToken } from "../middleware/auth.middleware.js";

// const router = Router();

// router.get("/check-availability", authenticateToken, checkAvailability);
// router.post("/hold", authenticateToken, holdSlot);
// router.post("/confirm/:id", authenticateToken, confirmAppointment);

// export default router;
import express from "express";
import { body } from "express-validator";
import {
  createAppointment,
  getAppointmentById,
  getAppointmentsByUser,
  getAppointmentsByProvider,
  updateAppointmentStatus,
  deleteAppointment,
} from "../controllers/appointment.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

/**
 * POST /api/appointments
 * Create appointment
 */
router.post(
  "/",
  [
    body("userId").notEmpty().withMessage("userId required"),
    body("providerId").notEmpty().withMessage("providerId required"),
    body("startTime").isISO8601().withMessage("startTime must be valid ISO date"),
    body("endTime").isISO8601().withMessage("endTime must be valid ISO date"),
  ],
  validateRequest,
  createAppointment
);

/**
 * GET /api/appointments/:id
 * Fetch one appointment
 */
router.get("/:id", getAppointmentById);

/**
 * GET /api/appointments/user/:userId
 * Fetch all appointments for a user
 */
router.get("/user/:userId", getAppointmentsByUser);

/**
 * GET /api/appointments/provider/:providerId
 * Fetch all appointments for a provider
 */
router.get("/provider/:providerId", getAppointmentsByProvider);

/**
 * PATCH /api/appointments/:id/status
 * Update appointment status
 */
router.patch("/:id/status", [body("status").notEmpty()], validateRequest, updateAppointmentStatus);

/**
 * DELETE /api/appointments/:id
 * Soft delete appointment
 */
router.delete("/:id", deleteAppointment);

export default router;
