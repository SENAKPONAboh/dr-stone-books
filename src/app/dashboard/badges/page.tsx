'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: string;
}

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: 'b1',
      title: 'Premier Cas Validé',
      description: 'A soumis et fait corriger son tout premier cas clinique avec succès.',
      icon: '🏅',
      unlocked: true
    },
    {
      id: 'b2',
      title: 'Explorateur Anatomique',
      description: 'A activé son premier livre Dr Stone Books.',
      icon: '📚',
      unlocked: true
    },
    {
      id: 'b3',
      title: 'Série de 10 Cas',
      description: 'A validé 10 cas cliniques au total.',
      icon: '🔥',
      unlocked: true
    },
    {
      id: 'b4',
      title: 'Top 10 Mensuel',
      description: 'S\'est classé parmi les 10 meilleurs étudiants du mois.',
      icon: '🏆',
      unlocked: false,
      progress: '14e position actuelle'
    },
    {
      id: 'b5',
      title: 'Maître du Raisonnement',
      description: 'A accumulé plus de 5 000 points sur la plateforme.',
      icon: '⭐',
      unlocked: false,
      progress: '1 250 / 5 000 pts'
    },
    {
      id: 'b6',
      title: 'Livre Terminé',
      description: 'A complété 100% des cas d\'un ouvrage pédagogique.',
      icon: '🎓',
      unlocked: false,
      progress: '12 / 20 cas'
    }
  ]);

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Badges & Accomplissements</h1>
          <p className="text-gray-500">Suivez vos succès et débloquez de nouvelles distinctions au fil de votre progression.</p>
        </div>
        <Link href="/dashboard" className="self-start px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-sm transition-colors shadow-sm">
          Retour au tableau de bord
        </Link>
      </div>

      {/* Résumé des badges */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Votre Collection</h2>
          <p className="text-blue-200 text-sm mt-1">{unlockedCount} badges débloqués sur {badges.length} au total</p>
        </div>
        <div className="text-3xl font-extrabold bg-white/10 px-4 py-2 rounded-2xl border border-white/20">
          {Math.round((unlockedCount / badges.length) * 100)}%
        </div>
      </div>

      {/* Grille des badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => (
          <div 
            key={badge.id} 
            className={`rounded-2xl p-6 border transition-all flex flex-col justify-between ${badge.unlocked ? 'bg-white border-blue-100 shadow-sm' : 'bg-gray-50/70 border-gray-200 opacity-75'}`}
          >
            <div className="flex items-start justify-between">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${badge.unlocked ? 'bg-blue-50' : 'bg-gray-200 grayscale'}`}>
                {badge.icon}
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${badge.unlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>
                {badge.unlocked ? '✅ Débloqué' : '🔒 Verrouillé'}
              </span>
            </div>

            <div className="my-4 space-y-1">
              <h3 className="text-base font-bold text-gray-900">{badge.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{badge.description}</p>
            </div>

            <div className="pt-3 border-t border-gray-100 text-xs font-semibold">
              {badge.unlocked ? (
                <span className="text-emerald-700">Obtenu avec succès</span>
              ) : (
                <span className="text-gray-400">Progression : {badge.progress}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}