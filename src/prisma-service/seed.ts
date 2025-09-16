import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seed() {
  const hashedPassword = await bcrypt.hash(
    process.env.SUPER_ADMIN_PASSWORD || '123456',
    12,
  ); // password hash

  await prisma.user.upsert({
    where: { email: process.env.SUPER_ADMIN_EMAIL || 'alvaaro@gmail.com' },
    update: {},
    create: {
      email: process.env.SUPER_ADMIN_EMAIL || 'alvaaro@gmail.com',
      password: hashedPassword,
      fullName: process.env.SUPER_ADMIN_NAME || 'Alvaaro',
      role: UserRole.SUPER_ADMIN,
      isOtpVerified: true,
    },
  });

  console.log('✅ User seeded successfully');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
