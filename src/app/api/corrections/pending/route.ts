import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pendingSubmissions = await prisma.caseSubmission.findMany({
      where: { status: 'PENDING' },
      include: {
        user: {
          select: { name: true, firstName: true, level: true, university: true },
        },
      },
      orderBy: { submittedAt: 'asc' },
    });

    return NextResponse.json(pendingSubmissions, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des copies en attente.', error },
      { status: 500 }
    );
  }
}