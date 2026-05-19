import { prisma } from '../prisma/prisma';

import { seedRoles } from './role.seed';
import { seedUsers } from './user.seed';

async function main() {
  try {
    console.log('Seeding started...');

    await seedRoles();

    await seedUsers();

    console.log('Seeding complete!');
  } catch (error) {
    console.error(error);

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
