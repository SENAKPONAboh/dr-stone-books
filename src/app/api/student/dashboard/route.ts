import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper pour déterminer le Grade / Titre selon les points
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
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { message: "L'identifiant utilisateur est requis." },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur avec ses activations de livres
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        activatedBooks: true,
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
    // @ts-ignore
    const activatedBooks = (user.activatedBooks || []).map((act: any) => ({
      activationId: act.id,
      bookTitle: act.bookTitle,
      activatedAt: act.activatedAt,
    }));

    const responseData = {
      id: user.id,
      firstName: user.firstName,
      name: user.name,
      email: user.email,
      points: user.points,
      rankTitle: rank.title,
      stars: rank.stars,
      studyLevel: user.level,
      university: user.university || 'Non renseignée',
      faculty: user.faculty || 'Non renseignée',
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