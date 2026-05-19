import { prisma } from '../prisma/prisma';

export async function seedRoles() {
  const roles = [
    {
      name: 'Super Admin',
      description: 'Full system access',
      access: [
        'module.master-data.user.index',
        'module.master-data.user.create',
        'module.master-data.user.update',
        'module.master-data.user.delete',
        'module.master-data.role.index',
        'module.master-data.role.create',
        'module.master-data.role.update',
        'module.master-data.role.delete',
      ],
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        name: role.name,
      },
      update: {
        description: role.description,
        access: role.access,
      },
      create: role,
    });
  }

  console.log('Roles seeded');
}
