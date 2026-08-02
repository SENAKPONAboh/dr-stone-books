import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pendingSubmissions = await prisma.submission.findMany({
      where: { status: 'PENDING' },
      include: {
        user: {
          select: { firstName: true, lastName: true, studyLevel: true },
        },
        case: {
          select: { title: true, number: true, difficulty: true, maxPoints: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(pendingSubmissions, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des copies en attente.', error },
      { status: 500 }
    );
  }
}