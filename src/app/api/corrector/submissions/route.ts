import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. Récupérer toutes les soumissions en attente de correction
export async function GET() {
  try {
    const submissions = await prisma.caseSubmission.findMany({
      where: { status: 'PENDING' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            university: true,
          },
        },
      },
      orderBy: { submittedAt: 'asc' }, // Les plus anciennes en premier
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Erreur GET /api/corrector/submissions:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des copies." }, { status: 500 });
  }
}

// 2. Enregistrer la note et le feedback d'une copie
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { submissionId, grade, feedback, correctedById } = body;

    if (!submissionId || grade === undefined || grade === null) {
      return NextResponse.json(
        { success: false, error: "L'identifiant de la copie et la note sont requis." },
        { status: 400 }
      );
    }

    // Récupérer la soumission pour connaître l'utilisateur concerné
    const existingSubmission = await prisma.caseSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!existingSubmission) {
      return NextResponse.json(
        { success: false, error: "Copie introuvable." },
        { status: 404 }
      );
    }

    const numericGrade = parseInt(grade, 10);

    // Mettre à jour la soumission + créditer les points à l'étudiant dans une transaction
    await prisma.$transaction([
      prisma.caseSubmission.update({
        where: { id: submissionId },
        data: {
          status: 'GRADED',
          grade: numericGrade,
          feedback: feedback || '',
          correctedById: correctedById || null,
        },
      }),
      prisma.user.update({
        where: { id: existingSubmission.userId },
        data: {
          points: { increment: numericGrade },
        },
      }),
    ]);

    return NextResponse.json({ success: true, message: "Copie corrigée avec succès !" });
  } catch (error) {
    console.error("Erreur POST /api/corrector/submissions:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'enregistrement de la correction." },
      { status: 500 }
    );
  }
}