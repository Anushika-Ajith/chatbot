import { prisma } from "../config/db.js";

export const DoctorService = {
  async getAllDoctors() {
    return prisma.user.findMany({
      where: { role: "PROVIDER" },
      select: {
        id: true,
        name: true,
        email: true,
        providerAvailability: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },
  async getDoctorById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: { providerAvailability: true },
    });
  },


  async getAvailabilityByDoctorId(doctorId) {
    return prisma.providerAvailability.findMany({
      where: { providerId: doctorId },
      orderBy: { dayOfWeek: "asc" },
    });
  },

  async addAvailability(doctorId, slots) {
    const newSlots = await Promise.all(
      slots.map(async (slot) => {
        const { dayOfWeek, startTime, endTime } = slot;
        return prisma.providerAvailability.create({
          data: {
            providerId: doctorId,
            dayOfWeek,
            startTime,
            endTime,
          },
        });
      })
    );
    return newSlots;
  },

  async deleteAvailability(doctorId, availabilityId) {
    const availability = await prisma.providerAvailability.findUnique({
      where: { id: availabilityId },
    });

    if (!availability || availability.providerId !== doctorId) {
      return null;
    }

    await prisma.providerAvailability.delete({
      where: { id: availabilityId },
    });

    return availabilityId;
  },
};
