import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Nettoyage de sécurité (optionnel puisque la base vient d'être reset)
  await prisma.user.deleteMany({});

  // Hashage sécurisé de ton mot de passe Admin
  const hashedPassword = await bcrypt.hash('Arthur2.0', 10);

  // Création du compte Administrateur Principal
  const adminUser = await prisma.user.create({
    data: {
      name: 'Arthur ABOH',
      email: 'aboharthur73@gmail.com',
      password: hashedPassword,
      role: Role.ADMIN,
      university: 'Faculté de Médecine',
    },
  });

  console.log('✅ Compte Admin créé avec succès :', adminUser.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });