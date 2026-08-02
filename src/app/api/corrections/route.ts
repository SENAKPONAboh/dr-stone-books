import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Utilise l'instance singleton global

export async function GET() {
  try {
    const submissions = await prisma.caseSubmission.findMany({
      include: {
        user: {
          select: {
            name: true,
            university: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    const formatted = submissions.map((sub) => ({
      id: sub.id,
      studentName: sub.user?.name || 'Étudiant inconnu',
      university: sub.user?.university || 'Faculté de Médecine',
      bookTitle: sub.bookTitle,
      caseNumber: sub.caseNumber,
      submittedAt: new Date(sub.submittedAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      status: sub.status === 'GRADED' ? 'graded' : 'pending',
      grade: sub.grade ?? undefined,
      feedback: sub.feedback ?? undefined,
      imageUrl: sub.imageUrl,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Erreur GET /api/corrections :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}