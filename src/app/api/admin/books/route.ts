import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, edition } = body;

    if (!title || !edition) {
      return NextResponse.json(
        { success: false, error: 'Le titre et l\'édition du livre sont requis.' },
        { status: 400 }
      );
    }

    // Créer le livre avec notre nouveau modèle Prisma
    const newBook = await prisma.book.create({
      data: {
        title,
        edition,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Livre créé avec succès !',
      book: newBook,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Erreur lors de la création du livre :', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
}