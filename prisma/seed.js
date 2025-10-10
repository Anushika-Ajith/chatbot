import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Example 1: Create a doctor (provider)
  const doctor = await prisma.user.create({
    data: {
      name: "Dr. Arjun Rao",
      email: "arjun@hospital.com",
      passwordHash: "hashed_password_here",
      role: "PROVIDER",
    },
  });
  console.log("✅ Doctor created:", doctor);

  // Example 2: Add availability for that doctor
  await prisma.providerAvailability.createMany({
    data: [
      { providerId: doctor.id, dayOfWeek: 1, startTime: "09:00", endTime: "12:00" },
      { providerId: doctor.id, dayOfWeek: 3, startTime: "14:00", endTime: "18:00" },
    ],
  });
  console.log("✅ Availability added for", doctor.name);
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error("❌ Error:", err);
    prisma.$disconnect();
  });
