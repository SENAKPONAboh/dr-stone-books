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

    // Récupérer les étudiants triés par points décroissants
    const topStudents = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        points: true,
        studyLevel: true,
        university: {
          select: { name: true },
        },
      },
      orderBy: { points: 'desc' },
      take: limit,
    });

    // Ajouter le rang, les étoiles et le titre de chaque étudiant
    const leaderboard = topStudents.map((student, index) => {
      const rankInfo = getMedicalRank(student.points);
      return {
        position: index + 1,
        id: student.id,
        fullName: `${student.firstName} ${student.lastName.charAt(0)}.`, // Nom anonymisé pour confidentialité
        points: student.points,
        rankTitle: rankInfo.title,
        stars: rankInfo.stars,
        studyLevel: student.studyLevel || 'Non précisé',
        university: student.university?.name || 'Non renseignée',
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