import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fonction d'aide pour calculer le grade selon les points
function getMedicalRank(points: number) {
  if (points >= 3500) return { title: 'Professeur / Expert', stars: '⭐️⭐️⭐️⭐️⭐️' };
  if (points >= 1500) return { title: 'Médecin Élite', stars: '⭐️⭐️⭐️⭐️' };
  if (points >= 500) return { title: 'Médecin Raisonneur', stars: '⭐️⭐️⭐️' };
  if (points >= 100) return { title: 'Étudiant Interniste', stars: '⭐️⭐️' };
  return { title: 'Étudiant Externe', stars: '⭐️' };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get('limit')) || 50;

    // Récupérer les étudiants triés par points décroissants (rôle ETUDIANT d'après le schéma)
    const topStudents = await prisma.user.findMany({
      where: { role: 'ETUDIANT' },
      select: {
        id: true,
        firstName: true,
        name: true,
        points: true,
        level: true,
        university: true,
      },
      orderBy: { points: 'desc' },
      take: limit,
    });

    // Ajouter le rang, les étoiles et le titre de chaque étudiant
    const leaderboard = topStudents.map((student, index) => {
      const rankInfo = getMedicalRank(student.points);
      const firstNameDisplay = student.firstName || student.name;
      
      return {
        position: index + 1,
        id: student.id,
        fullName: `${firstNameDisplay} ${student.name.charAt(0)}.`,
        points: student.points,
        rankTitle: rankInfo.title,
        stars: rankInfo.stars,
        studyLevel: student.level || 'Non précisé',
        university: student.university || 'Non renseignée',
      };
    });

    return NextResponse.json(leaderboard, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la récupération du classement.', error },
      { status: 500 }
    );
  }
}