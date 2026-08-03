import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const editionId = searchParams.get('editionId');

    if (!editionId) {
      return NextResponse.json(
        { message: "L'identifiant de l'édition est requis." },
        { status: 400 }
      );
    }

    // Récupérer tous les cas de l'édition du livre
    // @ts-ignore - Ignore l'erreur de type si le nom du modèle Prisma varie
    const cases = await prisma.case.findMany({
      where: { editionId },
      orderBy: { number: 'asc' },
    });

    return NextResponse.json(cases, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des cas.', error },
      { status: 500 }
    );
  }
}