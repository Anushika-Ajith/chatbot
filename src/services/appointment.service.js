import { prisma } from "../config/db.js";

export const AppointmentService = {
  async createAppointment({ userId, providerId, chatSessionId, startTime, endTime, metadata }) {
    return prisma.appointment.create({
      data: {
        userId,
        providerId,
        chatSessionId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: "PENDING",
        metadata: metadata || {},
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        provider: { select: { id: true, name: true, email: true } },
      },
    });
  },

  async getAppointmentById(id) {
    return prisma.appointment.findUnique({
      where: { id },
      include: {
        user: true,
        provider: true,
        chatSession: true,
      },
    });
  },

  async getAppointmentsByUser(userId) {
    return prisma.appointment.findMany({
      where: { userId, deletedAt: null },
      orderBy: { startTime: "asc" },
      include: {
        provider: { select: { id: true, name: true } },
      },
    });
  },

  async getAppointmentsByProvider(providerId) {
    return prisma.appointment.findMany({
      where: { providerId, deletedAt: null },
      orderBy: { startTime: "asc" },
      include: {
        user: { select: { id: true, name: true } },
      },
    });
  },

  async updateAppointmentStatus(id, status) {
    return prisma.appointment.update({
      where: { id },
      data: { status },
    });
  },

  async softDeleteAppointment(id) {
    return prisma.appointment.update({
      where: { id },
      data: { deletedAt: new Date(), status: "CANCELLED" },
    });
  },
};
