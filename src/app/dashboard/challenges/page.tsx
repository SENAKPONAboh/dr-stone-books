import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Action serveur pour inscrire l'étudiant
async function handleJoinChallenge(formData: FormData) {
  'use server';
  const challengeId = formData.get('challengeId') as string;
  const userId = "ID_UTILISATEUR_CONNECTE"; // Remplace par l'ID de l'étudiant connecté (via ta session)

  try {
    await prisma.challengeParticipant.create({
      data: {
        userId,
        challengeId,
      },
    });
    // Incrémente le compteur si tu gères un champ participantsCount
    await prisma.challenge.update({
      where: { id: challengeId },
      data: { participantsCount: { increment: 1 } },
    });
  } catch (e) {
    // Gère le cas où l'utilisateur est déjà inscrit
    console.error("Déjà inscrit ou erreur", e);
  }

  revalidatePath('/dashboard/challenges');
}

export default async function ChallengesPage() {
  // Récupère le challenge actif depuis la base de données
  const activeChallenge = await prisma.challenge.findFirst({
    where: { status: 'ACTIVE' },
    include: {
      _count: {
        select: { participants: true },
      },
    },
  });

  if (!activeChallenge) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <h1 className="text-xl font-bold text-gray-800">Aucun challenge actif pour le moment</h1>
        <p className="text-gray-500 text-sm mt-2">Reviens un peu plus tard !</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
        <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
          🏆 {activeChallenge.month}
        </span>
        <h1 className="text-2xl font-bold text-gray-900">{activeChallenge.title}</h1>
        <p className="text-gray-600 text-sm leading-relaxed">{activeChallenge.description}</p>
        
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs space-y-1">
          <p className="text-amber-900">🎁 <strong className="font-bold">Récompenses :</strong> {activeChallenge.reward}</p>
          <p className="text-amber-700">👥 <strong className="font-bold">{activeChallenge._count.participants}</strong> étudiants participent déjà à ce challenge.</p>
        </div>

        <form action={handleJoinChallenge}>
          <input type="hidden" name="challengeId" value={activeChallenge.id} />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
          >
            S'inscrire et participer au challenge 🚀
          </button>
        </form>
      </div>
    </div>
  );
}