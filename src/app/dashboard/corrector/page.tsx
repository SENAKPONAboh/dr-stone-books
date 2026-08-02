'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Submission {
  id: string;
  studentName: string;
  university: string;
  bookTitle: string;
  caseNumber: string;
  submittedAt: string;
  status: 'pending' | 'graded';
  grade?: number;
  feedback?: string;
  imageUrl?: string;
}

export default function CorrectorPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [grade, setGrade] = useState<number>(40);
  const [feedback, setFeedback] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Charger les vraies soumissions depuis l'API
  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/corrections'); // Assure-toi d'avoir une route API qui renvoie les soumissions
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des copies", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGradeModal = (sub: Submission) => {
    setSelectedSub(sub);
    setGrade(40);
    setFeedback('');
    setSuccessMsg('');
  };

  const handleValidateGrading = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    try {
      const response = await fetch('/api/corrections/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: selectedSub.id,
          score: grade,
          feedback: feedback,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la notation");
      }

      setSuccessMsg('✅ Copie corrigée et points attribués avec succès !');
      
      // Rafraîchir la liste
      fetchSubmissions();

      setTimeout(() => {
        setSelectedSub(null);
        setSuccessMsg('');
      }, 1200);
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de l'enregistrement de la note.");
    }
  };

  const pendingList = submissions.filter(s => s.status === 'pending');
  const gradedList = submissions.filter(s => s.status === 'graded');

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Espace Correcteur</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">File d&apos;attente des copies</h1>
          <p className="text-gray-500">Examinez les soumissions des étudiants, attribuez les notes et rédigez vos commentaires.</p>
        </div>
        <Link href="/dashboard" className="self-start px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-sm transition-colors shadow-sm">
          Retour au tableau de bord
        </Link>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Copies en attente de correction</p>
          <h3 className="text-3xl font-extrabold text-amber-600 mt-2">{pendingList.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Copies déjà corrigées</p>
          <h3 className="text-3xl font-extrabold text-emerald-600 mt-2">{gradedList.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Temps moyen de traitement</p>
          <h3 className="text-3xl font-extrabold text-blue-900 mt-2">&lt; 18h</h3>
        </div>
      </div>

      {/* Liste des copies en attente */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-gray-900">Soumissions à traiter</h2>
        {loading ? (
          <div className="text-center py-6 text-gray-400">Chargement des copies...</div>
        ) : pendingList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
            🎉 Aucune copie en attente ! Toutes les soumissions ont été corrigées.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingList.map((sub) => (
              <div key={sub.id} className="bg-white rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-base">{sub.studentName}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">{sub.university}</span>
                  </div>
                  <p className="text-xs text-blue-900 font-semibold">{sub.bookTitle} — <span className="text-gray-600">{sub.caseNumber}</span></p>
                  <p className="text-[11px] text-gray-400">Soumis {sub.submittedAt}</p>
                </div>

                <button 
                  onClick={() => handleOpenGradeModal(sub)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
                >
                  Corriger la copie
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE CORRECTION */}
      {selectedSub && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Correction de copie</span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">{selectedSub.studentName}</h3>
                <p className="text-xs text-gray-500">{selectedSub.bookTitle} — {selectedSub.caseNumber}</p>
              </div>
              <button 
                onClick={() => setSelectedSub(null)}
                className="text-gray-400 hover:text-gray-700 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            {successMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                {successMsg}
              </div>
            )}

            {/* Aperçu de l'image de la copie */}
            <div className="bg-gray-100 border border-gray-200 rounded-2xl p-4 text-center">
              {selectedSub.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selectedSub.imageUrl} alt="Copie de l'étudiant" className="max-h-80 mx-auto rounded-lg object-contain" />
              ) : (
                <p className="text-gray-500 text-xs py-8">🖼️ [Aucune image disponible pour cette copie]</p>
              )}
            </div>

            <form onSubmit={handleValidateGrading} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Attribuer des points (ex: 0 à 50)</label>
                <input 
                  type="number" 
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  min={0}
                  max={100}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Feedback & Commentaires pédagogiques</label>
                <textarea 
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Rédigez vos conseils et corrections pour l'étudiant..."
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
                >
                  Valider et envoyer les points
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}