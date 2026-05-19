import { ROLE_CODE } from '@/common/constants/role.constant';
import { prisma } from '../prisma/prisma';

export async function seedRoles() {
  const roles = [
    {
      name: 'Super Admin',
      code: ROLE_CODE.SUPER_ADMIN,
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
    {
      name: 'User',
      code: ROLE_CODE.USER,
      description: 'Limited access',
      access: [],
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        name: role.name,
      },
      update: {
        code: role.code,
        description: role.description,
        access: role.access,
      },
      create: role,
    });
  }

  console.log('Roles seeded');
}
