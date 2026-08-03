import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Fonction pour générer un code aléatoire et sécurisé
function generateUniqueCode(prefix = 'DSB'): string {
  const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}-${randomHex.slice(0, 4)}-${randomHex.slice(4, 8)}`;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { editionId, bookId, quantity = 10, prefix = 'DSB' } = data;

    if (!editionId || !bookId) {
      return NextResponse.json(
        { message: "L'identifiant de l'édition et l'identifiant du livre sont requis." },
        { status: 400 }
      );
    }

    const codesToCreate = [];
    const generatedCodesSet = new Set<string>();

    while (generatedCodesSet.size < quantity) {
      const code = generateUniqueCode(prefix);
      generatedCodesSet.add(code);
    }

    for (const code of generatedCodesSet) {
      codesToCreate.push({
        code,
        editionId,
        bookId,
        status: 'available',
      });
    }

    // Insertion en masse dans la base de données
    await prisma.activationCode.createMany({
      data: codesToCreate,
      skipDuplicates: true,
    });

    return NextResponse.json(
      {
        message: `${quantity} codes générés avec succès.`,
        count: quantity,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la génération des codes.', error },
      { status: 500 }
    );
  }
}