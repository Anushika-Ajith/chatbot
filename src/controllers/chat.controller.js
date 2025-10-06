import { prisma } from "../config/db.js";

/**
 * Create a new chat session for a user
 */
export async function createChatSession(req, res) {
  try {
    const { userId } = req.body;

    const session = await prisma.chatSession.create({
      data: { userId },
    });

    res.status(201).json({ message: "Chat session created", session });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create chat session" });
  }
}

/**
 * Create a new appointment linked to a chat session
 */
export async function createAppointment(req, res) {
  try {
    const { userId, providerId, chatSessionId, startTime, endTime } = req.body;

    const appointment = await prisma.appointment.create({
      data: {
        userId,
        providerId,
        chatSessionId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });

    res.status(201).json({ message: "Appointment created", appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
}
    