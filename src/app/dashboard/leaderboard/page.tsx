'use client';

import { useState } from 'react';
import Link from 'next/link';

interface LeaderboardUser {
  rank: number;
  name: string;
  university: string;
  points: number;
  casesCompleted: number;
  isCurrentUser?: boolean;
}

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<'all' | 'university'>('all');

  const students: LeaderboardUser[] = [
    { rank: 1, name: 'Aminata Diallo', university: 'Université Cheikh Anta Diop', points: 5200, casesCompleted: 38 },
    { rank: 2, name: 'Kouassi Jean', university: 'Université Félix Houphouët-Boigny', points: 4950, casesCompleted: 35 },
    { rank: 3, name: 'Fatou Ndiaye', university: 'Université Cheikh Anta Diop', points: 4700, casesCompleted: 33 },
    { rank: 14, name: 'Arthur ABOH', university: 'Faculté de Médecine', points: 1250, casesCompleted: 18, isCurrentUser: true },
    { rank: 4, name: 'Ibrahim Traoré', university: 'Université Joseph Ki-Zerbo', points: 4400, casesCompleted: 30 },
    { rank: 5, name: 'Marie Koné', university: 'Université Félix Houphouët-Boigny', points: 4150, casesCompleted: 28 },
  ];

  // Trier par points décroissants
  const sortedStudents = [...students].sort((a, b) => b.points - a.points);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classement Général</h1>
          <p className="text-gray-500">Découvrez votre position parmi les étudiants en médecine de la plateforme.</p>
        </div>
        <Link href="/dashboard" className="self-start px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-sm transition-colors shadow-sm">
          Retour au tableau de bord
        </Link>
      </div>

      {/* Podium des 3 premiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {sortedStudents.slice(0, 3).map((student, idx) => {
          const podiumStyles = [
            'bg-gradient-to-br from-amber-400 to-amber-600 text-white md:-translate-y-2',
            'bg-gradient-to-br from-slate-300 to-slate-500 text-white',
            'bg-gradient-to-br from-amber-700 to-amber-900 text-white'
          ];
          const medals = ['🥇', '🥈', '🥉'];

          return (
            <div key={idx} className={`rounded-2xl p-6 shadow-md flex flex-col justify-between ${podiumStyles[idx]}`}>
              <div className="flex justify-between items-center">
                <span className="text-2xl">{medals[idx]}</span>
                <span className="bg-white/20 text-xs px-2.5 py-1 rounded-full font-bold">Top {idx + 1}</span>
              </div>
              <div className="my-4">
                <h3 className="text-lg font-bold truncate">{student.name}</h3>
                <p className="text-xs opacity-90 truncate">{student.university}</p>
              </div>
              <div className="flex justify-between items-end border-t border-white/20 pt-3">
                <span className="text-xs opacity-80">{student.casesCompleted} cas résolus</span>
                <span className="text-xl font-extrabold">{student.points} pts</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filtres de classement */}
      <div className="flex gap-2 border-b border-gray-200 pb-4">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${filter === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Classement Général
        </button>
        <button 
          onClick={() => setFilter('university')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${filter === 'university' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Mon Université
        </button>
      </div>

      {/* Liste complète du classement */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {sortedStudents.map((student, index) => (
            <div 
              key={index} 
              className={`p-4 md:p-6 flex items-center justify-between transition-colors ${student.isCurrentUser ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-amber-100 text-amber-800' : index === 1 ? 'bg-slate-100 text-slate-700' : index === 2 ? 'bg-amber-50 text-amber-900' : 'bg-gray-100 text-gray-600'}`}>
                  {index + 1}
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    {student.name}
                    {student.isCurrentUser && <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Vous</span>}
                  </h4>
                  <p className="text-xs text-gray-500">{student.university}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-base font-extrabold text-blue-900">{student.points} pts</p>
                <p className="text-xs text-gray-400">{student.casesCompleted} cas validés</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}