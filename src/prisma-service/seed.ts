import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seed() {
  try {
    const hashedPassword = await bcrypt.hash(
      process.env.SUPER_ADMIN_PASSWORD || '12345678',
      10,
    ); // password hash

    await prisma.user.upsert({
      where: { email: process.env.SUPER_ADMIN_EMAIL || 'alvaaro@gmail.com' },
      update: {
        password: hashedPassword,
        fullName: process.env.SUPER_ADMIN_NAME || 'Alvaaro',
        role: UserRole.ADMIN,
        isOtpVerified: true,
      },
      create: {
        email: process.env.SUPER_ADMIN_EMAIL || 'alvaaro@gmail.com',
        password: hashedPassword,
        fullName: process.env.SUPER_ADMIN_NAME || 'Alvaaro',
        role: UserRole.ADMIN,
        isOtpVerified: true,
      },
    });

    console.log('✅ User seeded successfully');
  } catch (e) {
    console.error('Seeding error:', e);
  } finally {
    await prisma.$disconnect();
  }
}
 
seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
