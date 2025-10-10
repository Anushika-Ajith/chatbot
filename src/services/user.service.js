import { prisma } from "../config/db.js";
import { hashPassword } from "../utils/hashPassword.js";

export const UserService = {
  async createOrUpdateUser({ name, email, password, role }) {
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.upsert({
      where: { email },
      update: { name, passwordHash, role },
      create: { name, email, passwordHash, role },
    });

    return user;
  },

  async getUserById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        providerAvailability: true,
        appointments: true,
        providerAppointments: true,
      },
    });
  },

  async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  },
};
