import * as bcrypt from 'bcrypt';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedSuperAdmin() {
  try {
    const hashedPassword = await bcrypt.hash(
      process.env.SUPER_ADMIN_PASSWORD || '12345678',
      10,
    );

    await prisma.user.upsert({
      where: {
        email: process.env.SUPER_ADMIN_EMAIL || 'superadmin@priveestates.com',
      },
      update: {
        password: hashedPassword,
        fullName: process.env.SUPER_ADMIN_NAME || 'Super Admin',
        role: UserRole.SUPER_ADMIN,
        isOtpVerified: true,
      },
      create: {
        email: process.env.SUPER_ADMIN_EMAIL || 'superadmin@priveestates.com',
        password: hashedPassword,
        fullName: process.env.SUPER_ADMIN_NAME || 'Super Admin',
        role: UserRole.SUPER_ADMIN,
        isOtpVerified: true,
      },
    });

    console.log('✅ Super admin seeded successfully');
  } catch (e) {
    console.error('Seeding error:', e);
  } finally {
    await prisma.$disconnect();
  }
}
