import { hash } from 'bcryptjs';
import { prisma } from '../prisma/prisma';

export async function seedUsers() {
  const superAdminRole = await prisma.role.findFirst({
    where: {
      name: 'Super Admin',
    },
  });

  if (!superAdminRole) {
    throw new Error('Super Admin role not found');
  }

  const password = await hash(
    'password',
    Number(process.env.BCRYPT_SALT_ROUNDS || 12),
  );

  await prisma.user.upsert({
    where: {
      email: 'admin@admin.com',
    },

    update: {},

    create: {
      name: 'Super Admin',
      email: 'admin@admin.com',
      password,
      roleId: superAdminRole.id,
    },
  });

  console.log('Users seeded');
}
