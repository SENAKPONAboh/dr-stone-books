import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ChallengeStatus } from '@prisma/client';

// GET : Récupérer tous les challenges avec le nombre de participants
export async function GET() {
  try {
    const challenges = await prisma.challenge.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { participants: true },
        },
      },
    });
    return NextResponse.json(challenges);
  } catch (error) {
    console.error("Erreur GET challenges:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des challenges" }, { status: 500 });
  }
}

// POST : Créer un nouveau challenge
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, month, description, reward, status } = body;

    if (!title || !month || !description || !reward) {
      return NextResponse.json({ error: "Veuillez remplir tous les champs obligatoires." }, { status: 400 });
    }

    let dbStatus: ChallengeStatus = ChallengeStatus.ACTIVE;
    if (status === 'INACTIVE' || status === 'ENDED') {
      dbStatus = ChallengeStatus.ENDED;
    } else if (status === 'UPCOMING') {
      dbStatus = ChallengeStatus.UPCOMING;
    }

    const newChallenge = await prisma.challenge.create({
      data: {
        title,
        month,
        description,
        reward,
        status: dbStatus,
      },
    });

    return NextResponse.json({ success: true, challenge: newChallenge });
  } catch (error) {
    console.error("Erreur POST challenge:", error);
    return NextResponse.json({ error: "Erreur lors de la création du challenge" }, { status: 500 });
  }
}

// PUT : Modifier un challenge existant
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, month, description, reward, status } = body;

    if (!id) {
      return NextResponse.json({ error: "ID du challenge manquant pour la modification." }, { status: 400 });
    }

    let dbStatus: ChallengeStatus = ChallengeStatus.ACTIVE;
    if (status === 'INACTIVE' || status === 'ENDED') {
      dbStatus = ChallengeStatus.ENDED;
    } else if (status === 'UPCOMING') {
      dbStatus = ChallengeStatus.UPCOMING;
    }

    const updatedChallenge = await prisma.challenge.update({
      where: { id },
      data: {
        title,
        month,
        description,
        reward,
        status: dbStatus,
      },
    });

    return NextResponse.json({ success: true, challenge: updatedChallenge });
  } catch (error) {
    console.error("Erreur PUT challenge:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}

// DELETE : Supprimer un challenge
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    await prisma.challenge.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE challenge:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}