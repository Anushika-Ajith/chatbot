import { Router } from "express";
import { checkAvailability, holdSlot, confirmAppointment } from "../controllers/appointment.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/check-availability", authenticateToken, checkAvailability);
router.post("/hold", authenticateToken, holdSlot);
router.post("/confirm/:id", authenticateToken, confirmAppointment);

export default router;
