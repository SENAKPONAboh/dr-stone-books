import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, bookTitle, caseNumber, imageUrl } = body;

    if (!userId || !bookTitle || !caseNumber || !imageUrl) {
      return NextResponse.json(
        { error: "Tous les champs sont requis (utilisateur, livre, numéro de cas et photo)." },
        { status: 400 }
      );
    }

    // Création de la soumission avec statut PENDING par défaut
    const newSubmission = await prisma.caseSubmission.create({
      data: {
        userId,
        bookTitle,
        caseNumber,
        imageUrl,
        status: 'PENDING',
      },
    });

    return NextResponse.json(
      { success: true, message: "Copie envoyée avec succès !", submission: newSubmission },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur POST /api/submissions :", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de la copie." },
      { status: 500 }
    );
  }
}