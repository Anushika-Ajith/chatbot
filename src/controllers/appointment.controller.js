import { prisma } from "../config/db.js";
import { addMinutes, isBefore } from "date-fns";

/**
 * Check provider availability for a given time range
 */
export async function checkAvailability(req, res) {
  try {
    const { providerId, startTime, endTime } = req.query;

    const overlapping = await prisma.appointment.findFirst({
      where: {
        providerId,
        status: { in: ["HELD", "CONFIRMED"] },
        OR: [
          {
            startTime: { lt: new Date(endTime) },
            endTime: { gt: new Date(startTime) },
          },
        ],
      },
    });

    res.json({ available: !overlapping });
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({ error: "Failed to check availability" });
  }
}

/**
 * Hold a time slot temporarily
 */
export async function holdSlot(req, res) {
  try {
    const { userId, providerId, chatSessionId, startTime, endTime } = req.body;

    // Check if already booked
    const overlapping = await prisma.appointment.findFirst({
      where: {
        providerId,
        status: { in: ["HELD", "CONFIRMED"] },
        OR: [
          {
            startTime: { lt: new Date(endTime) },
            endTime: { gt: new Date(startTime) },
          },
        ],
      },
    });

    if (overlapping) {
      return res.status(409).json({ error: "Slot already taken" });
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId,
        providerId,
        chatSessionId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: "HELD",
        holdExpiresAt: addMinutes(new Date(), 5), // 5-min hold
      },
    });

    res.status(201).json({ message: "Slot held successfully", appointment });
  } catch (error) {
    console.error("Error holding slot:", error);
    res.status(500).json({ error: "Failed to hold slot" });
  }
}

/**
 * Confirm appointment
 */
export async function confirmAppointment(req, res) {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({ where: { id } });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (appointment.status !== "HELD") {
      return res.status(400).json({ error: "Only held appointments can be confirmed" });
    }

    if (appointment.holdExpiresAt && isBefore(appointment.holdExpiresAt, new Date())) {
      return res.status(410).json({ error: "Hold expired" });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: "CONFIRMED", holdExpiresAt: null },
    });

    res.json({ message: "Appointment confirmed", appointment: updated });
  } catch (error) {
    console.error("Error confirming appointment:", error);
    res.status(500).json({ error: "Failed to confirm appointment" });
  }
}
