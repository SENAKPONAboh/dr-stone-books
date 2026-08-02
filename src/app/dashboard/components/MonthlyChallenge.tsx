'use client';

import Link from 'next/link';

interface ChallengeProps {
  challenge?: {
    id?: string;
    title?: string;
    description?: string;
    endDate?: string;
    participantsCount?: number;
    reward?: string;
    isQualified?: boolean;
  };
}

export default function MonthlyChallenge({ challenge }: ChallengeProps) {
  // Valeurs par défaut basées sur les données réelles ou de démo
  const title = challenge?.title || "Challenge Médical du Mois";
  const description = challenge?.description || "Résous un maximum de cas de raisonnement ce mois-ci pour te qualifier dans le Top 100 et tenter de gagner une bourse d'étude ou du matériel médical.";
  const endDate = challenge?.endDate || "31 Octobre";
  const reward = challenge?.reward || "Matériel Médical & Livres";

  return (
    <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
      {/* Badge décoratif en arrière-plan */}
      <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
            🏆 Grand Challenge Mensuel
          </span>
          <span className="text-xs text-orange-100 font-medium">Fin : {endDate}</span>
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-white mt-1">
            {title}
          </h3>
          <p className="text-orange-100 text-xs leading-relaxed mt-2">
            {description}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 text-xs space-y-1">
          <p className="text-orange-100">🎁 <strong className="text-white">Récompenses :</strong> {reward}</p>
        </div>

        {/* Bouton fonctionnel avec redirection */}
        <div className="pt-2">
          <Link
            href="/dashboard/challenges"
            className="w-full inline-block text-center bg-white hover:bg-orange-50 text-orange-600 font-bold px-5 py-3 rounded-xl transition-all shadow-md hover:shadow-lg text-sm group"
          >
            <span className="group-hover:translate-x-0.5 transition-transform inline-block">
              Participer au challenge →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}