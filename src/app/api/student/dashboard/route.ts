import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper pour déterminer le Grade / Titre selon les points
function getMedicalRank(points: Int) {
  if (points >= 3500) return { title: 'Professeur / Expert', stars: '⭐️⭐️⭐️⭐️⭐️' };
  if (points >= 1500) return { title: 'Médecin Élite', stars: '⭐️⭐️⭐️⭐️' };
  if (points >= 500) return { title: 'Médecin Raisonneur', stars: '⭐️⭐️⭐️' };
  if (points >= 100) return { title: 'Étudiant Interniste', stars: '⭐️⭐️' };
  return { title: 'Étudiant Externe', stars: '⭐️' };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { message: "L'identifiant utilisateur est requis." },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur avec ses livres activés et universités
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        university: true,
        faculty: true,
        activations: {
          include: {
            edition: {
              include: {
                book: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Utilisateur introuvable.' },
        { status: 404 }
      );
    }

    const rank = getMedicalRank(user.points);

    // Formater la liste des livres activés
    const activatedBooks = user.activations.map((act) => ({
      activationId: act.id,
      bookTitle: act.edition.book.title,
      edition: act.edition.edition,
      activatedAt: act.usedAt,
    }));

    const responseData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      points: user.points,
      rankTitle: rank.title,
      stars: rank.stars,
      studyLevel: user.studyLevel,
      university: user.university?.name || 'Non renseignée',
      faculty: user.faculty?.name || 'Non renseignée',
      booksCount: activatedBooks.length,
      activatedBooks,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des données.', error },
      { status: 500 }
    );
  }
}