import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { userId, code } = data;

    if (!userId || !code) {
      return NextResponse.json(
        { message: 'Utilisateur et code d\'activation requis.' },
        { status: 400 }
      );
    }

    // 1. Rechercher le code et inclure le livre associé
    const activationCode = await prisma.activationCode.findUnique({
      where: { code: code.trim().toUpperCase() },
      include: { book: true },
    });

    // Vérification 1 : Existence du code
    if (!activationCode) {
      return NextResponse.json(
        { message: '❌ Code invalide.' },
        { status: 404 }
      );
    }

    // Vérification 2 : Déjà utilisé
    if (activationCode.isUsed) {
      return NextResponse.json(
        { message: '❌ Ce code a déjà été utilisé.' },
        { status: 400 }
      );
    }

    // 2. Marquer le code comme utilisé et l'associer à l'étudiant
    await prisma.activationCode.update({
      where: { id: activationCode.id },
      data: {
        isUsed: true,
        usedById: userId,
      },
    });

    return NextResponse.json(
      {
        message: '✅ Livre activé avec succès !',
        bookId: activationCode.bookId,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de l\'activation du livre.', error },
      { status: 500 }
    );
  }
}