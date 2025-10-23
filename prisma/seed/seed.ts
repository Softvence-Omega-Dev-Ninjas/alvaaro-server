import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    // SuperAdmin
    const superAdminEmail =
      process.env.SUPER_ADMIN_EMAIL || 'superadmin@priveestates.com';
    const superAdminPassword =
      process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin123!';
    const superAdminName = process.env.SUPER_ADMIN_NAME || 'Super Admin';
    const superAdminHashed = await bcrypt.hash(superAdminPassword, 10);

    await prisma.user.upsert({
      where: { email: superAdminEmail },
      update: {
        password: superAdminHashed,
        fullName: superAdminName,
        role: UserRole.SUPER_ADMIN,
        isOtpVerified: true,
      },
      create: {
        email: superAdminEmail,
        password: superAdminHashed,
        fullName: superAdminName,
        role: UserRole.SUPER_ADMIN,
        isOtpVerified: true,
      },
    });
    console.log('🌱 SuperAdmin user seeded successfully');

    // Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@priveestates.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
    const adminName = process.env.ADMIN_NAME || 'Admin';
    const adminHashed = await bcrypt.hash(adminPassword, 10);

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        password: adminHashed,
        fullName: adminName,
        role: UserRole.ADMIN,
        isOtpVerified: true,
      },
      create: {
        email: adminEmail,
        password: adminHashed,
        fullName: adminName,
        role: UserRole.ADMIN,
        isOtpVerified: true,
      },
    });
    console.log('🌱 Admin user seeded successfully');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed
// eslint-disable-next-line @typescript-eslint/no-floating-promises
seedUsers();
