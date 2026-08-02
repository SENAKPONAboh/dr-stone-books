'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ClinicalCase {
  id: string;
  number: string;
  title: string;
  chapter: string;
  difficulty: string;
  basePoints: number;
  status: 'pending' | 'submitted' | 'correcting' | 'corrected';
  score?: number;
  feedback?: string;
  imageUrl?: string;
}

export default function CasesPage() {
  const [selectedBook, setSelectedBook] = useState('Anatomie & Biologie Cellulaire');
  const [selectedCase, setSelectedCase] = useState<ClinicalCase | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Liste des cas pour le livre actif
  const [cases, setCases] = useState<ClinicalCase[]>([
    {
      id: 'c1',
      number: 'Cas 01',
      title: 'Analyse d’une lésion traumatique du membre supérieur et rapports anatomiques',
      chapter: 'Chapitre 2 : Ostéologie et Traumatologie',
      difficulty: '⭐⭐ Intermédiaire',
      basePoints: 30,
      status: 'corrected',
      score: 45,
      feedback: 'Excellente analyse des repères anatomiques et bonne justification de la fracture.'
    },
    {
      id: 'c2',
      number: 'Cas 02',
      title: 'Étude des structures vasculaires profondes et syndromes compartimentaux',
      chapter: 'Chapitre 3 : Angiologie clinique',
      difficulty: '⭐⭐⭐ Difficile',
      basePoints: 40,
      status: 'pending'
    },
    {
      id: 'c3',
      number: 'Cas 03',
      title: 'Anatomie fonctionnelle de l’articulation du genou et ménisques',
      chapter: 'Chapitre 4 : Arthrologie',
      difficulty: '⭐ Facile',
      basePoints: 20,
      status: 'pending'
    }
  ]);

  // Sauvegarder dans le localStorage pour persistance
  useEffect(() => {
    const saved = localStorage.getItem('userCases');
    if (saved) {
      setCases(JSON.parse(saved));
    }
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitSolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !imagePreview) return;

    setSubmitting(true);
    setTimeout(() => {
      const updated = cases.map(c => {
        if (c.id === selectedCase.id) {
          return { ...c, status: 'submitted' as const, imageUrl: imagePreview };
        }
        return c;
      });

      setCases(updated);
      localStorage.setItem('userCases', JSON.stringify(updated));
      setSubmitting(false);
      setSuccessMsg('✅ Votre réponse a été transmise avec succès au pôle de correction !');
      setImagePreview(null);
      setSelectedCase(null);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cas Cliniques & Exercices</h1>
          <p className="text-gray-500">Résous les cas dans ton livre physique, puis envoie la photo de ta copie pour correction.</p>
        </div>
        <Link href="/dashboard" className="self-start px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-sm transition-colors shadow-sm">
          Retour au tableau de bord
        </Link>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl font-medium text-sm">
          {successMsg}
        </div>
      )}

      {/* Modal d'envoi de photo si un cas est sélectionné */}
      {selectedCase ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">{selectedCase.number}</span>
              <h2 className="text-xl font-bold text-gray-900 mt-2">{selectedCase.title}</h2>
              <p className="text-sm text-gray-500">{selectedCase.chapter}</p>
            </div>
            <button 
              onClick={() => { setSelectedCase(null); setImagePreview(null); }}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              ✕
            </button>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-sm text-blue-900 space-y-2">
            <p className="font-bold">📝 Rappel de la méthode Dr Stone Books :</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-800">
              <li>As-tu rédigé ta réponse claire et argumentée directement dans ton livre physique ?</li>
              <li>Prends une photo nette et lisible de ta page de réponse.</li>
              <li>Importe ou capture l'image ci-dessous pour l'envoyer à un correcteur.</li>
            </ol>
          </div>

          <form onSubmit={handleSubmitSolution} className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <img src={imagePreview} alt="Aperçu copie" className="max-h-64 mx-auto rounded-xl shadow-md object-contain" />
                  <button 
                    type="button" 
                    onClick={() => setImagePreview(null)} 
                    className="text-sm text-red-600 font-medium hover:underline"
                  >
                    Changer de photo
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer space-y-2 block">
                  <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-sm font-semibold text-gray-700">Clique ici pour prendre ou importer la photo de ta réponse</p>
                  <p className="text-xs text-gray-400">Formats acceptés : JPG, PNG, HEIC</p>
                  <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" required />
                </label>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => { setSelectedCase(null); setImagePreview(null); }}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                disabled={!imagePreview || submitting}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center gap-2"
              >
                {submitting ? 'Envoi en cours...' : 'Envoyer ma réponse'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Liste des cas disponibles */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Livre : {selectedBook}</h3>
            <span className="text-sm font-medium text-gray-500">{cases.length} cas disponibles</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {cases.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">{c.number}</span>
                    <span className="text-xs font-medium text-gray-500">{c.difficulty}</span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">Base : {c.basePoints} pts</span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900 mt-2">{c.title}</h4>
                  <p className="text-xs text-gray-500">{c.chapter}</p>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  {c.status === 'corrected' && (
                    <div className="text-right">
                      <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-1">
                        Corrigé : {c.score} pts
                      </span>
                      <p className="text-xs text-gray-500 max-w-xs truncate">{c.feedback}</p>
                    </div>
                  )}

                  {c.status === 'submitted' && (
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3.5 py-2 rounded-xl">
                      ⏳ En attente de correction
                    </span>
                  )}

                  {c.status === 'pending' && (
                    <button 
                      onClick={() => setSelectedCase(c)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Envoyer ma réponse
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}