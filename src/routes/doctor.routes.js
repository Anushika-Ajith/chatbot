import express from "express";
import { body } from "express-validator";
import {
  getAllDoctors,
  getDoctorById,
  getAvailabilityByDoctorId,
  addAvailability,
  deleteAvailability,
} from "../controllers/doctor.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

/**
 * GET /api/doctors
 * List all doctors
 */
router.get("/", getAllDoctors);

/**
 * GET /api/doctors/:id
 * Get one doctor
 */
router.get("/:id", getDoctorById);

/**
 * GET /api/doctors/:id/availability
 * Get doctor availability
 */
router.get("/:id/availability", getAvailabilityByDoctorId);

/**
 * POST /api/doctors/:id/availability
 * Add new availability slots (admin use)
 */
router.post(
  "/:id/availability",
  [
    body("slots").isArray().withMessage("Slots must be an array"),
    body("slots.*.dayOfWeek").isInt({ min: 0, max: 6 }).withMessage("Invalid dayOfWeek"),
    body("slots.*.startTime").isString().withMessage("startTime required"),
    body("slots.*.endTime").isString().withMessage("endTime required"),
  ],
  validateRequest,
  addAvailability
);

/**
 * DELETE /api/doctors/:id/availability/:availabilityId
 * Delete availability
 */
router.delete("/:id/availability/:availabilityId", deleteAvailability);

export default router;
