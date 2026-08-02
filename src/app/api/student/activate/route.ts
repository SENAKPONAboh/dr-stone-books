import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, studentId } = body;

    if (!code || !studentId) {
      return NextResponse.json(
        { success: false, error: "Le code d'activation et l'ID de l'étudiant sont requis." },
        { status: 400 }
      );
    }

    // 1. Rechercher le code dans la base de données avec son livre associé
    const activationCode = await prisma.activationCode.findUnique({
      where: { code },
      include: { book: true },
    });

    if (!activationCode) {
      return NextResponse.json(
        { success: false, error: "❌ Ce code d'activation est invalide." },
        { status: 404 }
      );
    }

    // 2. Vérifier si le code a déjà été utilisé
    if (activationCode.isUsed) {
      return NextResponse.json(
        { success: false, error: "❌ Ce code a déjà été utilisé." },
        { status: 400 }
      );
    }

    // 3. Activer le code et l'associer à l'étudiant dans une transaction sécurisée
    await prisma.$transaction([
      prisma.activationCode.update({
        where: { id: activationCode.id },
        data: {
          isUsed: true,
          usedById: studentId,
        },
      }),
      prisma.bookActivation.create({
        data: {
          userId: studentId,
          bookTitle: activationCode.book.title,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "✅ Livre activé avec succès !",
    });

  } catch (error) {
    console.error("Erreur lors de l'activation du code :", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}