'use client';

import Link from 'next/link';

interface CurrentBookProps {
  book?: {
    id?: string;
    title?: string;
    level?: string;
    currentChapter?: string;
    progress?: number;
  };
}

export default function CurrentBookCard({ book }: CurrentBookProps) {
  // Si l'utilisateur n'a pas encore de livre en cours
  if (!book) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md">
        <div className="max-w-md">
          <span className="bg-blue-500/40 text-blue-100 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Aucun livre actif
          </span>
          <h2 className="text-xl font-bold mt-3">Commence ton apprentissage</h2>
          <p className="text-blue-100 text-sm mt-1">
            Active ton premier exemplaire physique Dr Stone Books avec ton code unique pour accéder aux cas de raisonnement.
          </p>
          <Link
            href="/dashboard/books/activate"
            className="mt-4 inline-block bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors shadow-sm text-sm"
          >
            Activer un livre
          </Link>
        </div>
      </div>
    );
  }

  // Si l'utilisateur a un livre en cours
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">
              Livre en cours
            </span>
            <span className="text-xs text-gray-500">{book.level || 'Première année'}</span>
          </div>

          <h3 className="text-xl font-bold text-gray-900">
            {book.title || 'Anatomie & Biologie Cellulaire'}
          </h3>

          <p className="text-sm text-gray-600">
            Chapitre actuel : <span className="font-medium text-gray-800">{book.currentChapter || 'Cas 04 — Ostéologie du membre supérieur'}</span>
          </p>

          {/* Barre de progression */}
          <div className="w-full bg-gray-100 h-2.5 rounded-full mt-3 overflow-hidden max-w-md">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${book.progress || 45}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Progression globale : {book.progress || 45}%</p>
        </div>

        {/* Bouton fonctionnel avec redirection */}
        <div className="flex items-center">
          <Link
            href={`/dashboard/cases/${book.id || 'current'}`}
            className="w-full md:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow text-sm"
          >
            Continuer ma lecture
          </Link>
        </div>
      </div>
    </div>
  );
}