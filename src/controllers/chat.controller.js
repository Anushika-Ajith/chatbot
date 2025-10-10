import { prisma } from "../config/db.js";
import { getIO } from "../socket/chat.gateway.js";

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

export const emitBotMessage = (req, res) => {
  const io = getIO(); 
  if (!io) {
    return res.status(500).json({ message: "Socket.io not initialized" });
  }

  const { roomId, message } = req.body;
  io.to(roomId).emit("new_message", message);

  res.json({ success: true });
};