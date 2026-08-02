import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function run() {
  const hashedPassword = await bcrypt.hash('muguicha2.0', 10);

  const updated = await prisma.user.upsert({
    where: { email: 'abohsenakpon@gmail.com' },
    update: {
      password: hashedPassword,
      role: Role.ADMIN,
    },
    create: {
      name: 'Arthur ABOH',
      email: 'abohsenakpon@gmail.com',
      password: hashedPassword,
      role: Role.ADMIN,
      university: 'Faculté de Médecine',
    },
  });

  console.log('✅ Nouveau compte admin créé/mis à jour avec succès :', updated.email);
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());