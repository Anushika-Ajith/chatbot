import { prisma } from "../config/db.js";

export const SessionService = {
  async createOrResumeSession({ userId, metadata }) {
    const existing = await prisma.chatSession.findFirst({
      where: { userId, status: "ACTIVE" },
    });

    if (existing) {
      return { session: existing, resumed: true };
    }

    const newSession = await prisma.chatSession.create({
      data: {
        userId,
        status: "ACTIVE",
        metadata: metadata || {},
      },
    });

    return { session: newSession, resumed: false };
  },

  // Get a chat session by ID
  async getSessionById(id) {
    return prisma.chatSession.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        appointments: true,
      },
    });
  },

  // List all sessions for a given user
  async getSessionsByUser(userId) {
    return prisma.chatSession.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  // Update session status
  async updateSessionStatus(id, status) {
    return prisma.chatSession.update({
      where: { id },
      data: { status },
    });
  },
};
