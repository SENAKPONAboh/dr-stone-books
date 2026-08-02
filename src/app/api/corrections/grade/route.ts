import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { submissionId, score, bonus = 0, feedback } = data;

    if (!submissionId || score === undefined) {
      return NextResponse.json(
        { message: 'ID de soumission et score sont requis.' },
        { status: 400 }
      );
    }

    const totalPointsEarned = Number(score) + Number(bonus);

    // 1. Récupérer la soumission
    const submission = await prisma.caseSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return NextResponse.json(
        { message: 'Soumission introuvable.' },
        { status: 404 }
      );
    }

    // 2. Mettre à jour la copie ET créditer les points dans une seule transaction atomique
    await prisma.$transaction([
      prisma.caseSubmission.update({
        where: { id: submissionId },
        data: {
          grade: totalPointsEarned, // Utilise 'grade' pour être cohérent avec le GET
          feedback: feedback || '',
          status: 'GRADED',
        },
      }),
      prisma.user.update({
        where: { id: submission.userId },
        data: {
          points: { increment: totalPointsEarned },
        },
      }),
    ]);

    return NextResponse.json(
      {
        message: '✅ Correction validée et points attribués avec succès !',
        pointsAdded: totalPointsEarned,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur POST /api/corrections/grade :", error);
    return NextResponse.json(
      { message: 'Erreur lors de la validation de la correction.', error },
      { status: 500 }
    );
  }
}