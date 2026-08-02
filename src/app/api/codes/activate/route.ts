import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { userId, code } = data;

    if (!userId || !code) {
      return NextResponse.json(
        { message: 'Utilisateur et code d activation requis.' },
        { status: 400 }
      );
    }

    // 1. Rechercher le code
    const activationCode = await prisma.activationCode.findUnique({
      where: { code: code.trim().toUpperCase() },
      include: { edition: true },
    });

    // Vérification 1 : Existence du code
    if (!activationCode) {
      return NextResponse.json(
        { message: '❌ Code invalide.' },
        { status: 404 }
      );
    }

    // Vérification 2 : Déjà utilisé ou bloqué
    if (activationCode.isUsed || activationCode.status !== 'available') {
      return NextResponse.json(
        { message: '❌ Ce code a déjà été activé ou est désactivé.' },
        { status: 400 }
      );
    }

    // 2. Marquer le code comme utilisé et l'associer à l'étudiant
    const updatedCode = await prisma.activationCode.update({
      where: { id: activationCode.id },
      data: {
        isUsed: true,
        status: 'activated',
        userId: userId,
        usedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: '✅ Livre activé avec succès !',
        editionId: activationCode.editionId,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de l'activation du livre.", error },
      { status: 500 }
    );
  }
}