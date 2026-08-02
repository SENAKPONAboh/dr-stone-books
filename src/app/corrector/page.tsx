'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Submission {
  id: string;
  bookTitle: string;
  caseNumber: string;
  imageUrl: string;
  submittedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    university?: string;
  };
}

export default function CorrectorPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [grade, setGrade] = useState<number | ''>('');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Charger les soumissions en attente
  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/corrector/submissions');
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
        if (data.length > 0) {
          setSelectedSubmission(data[0]);
        } else {
          setSelectedSubmission(null);
        }
      }
    } catch (err) {
      console.error("Erreur de chargement des copies :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Soumettre la correction
  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission || grade === '') return;

    setSubmitting(true);
    try {
      const savedUser = localStorage.getItem('user');
      const currentUser = savedUser ? JSON.parse(savedUser) : null;

      const res = await fetch('/api/corrector/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          grade: Number(grade),
          feedback,
          correctedById: currentUser?.id,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert("Correction enregistrée !");
        setGrade('');
        setFeedback('');
        await fetchSubmissions();
      } else {
        alert(result.error || "Erreur lors de la sauvegarde.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('user');
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navigation supérieure */}
      <header className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Espace Correcteur — Dr Stone</h1>
          <p className="text-xs text-slate-400">Évaluation des cas cliniques et attribution des points</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl font-semibold transition-colors"
        >
          Déconnexion
        </button>
      </header>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-6 gap-6">
        
        {/* Colonne 1 : Liste des copies à corriger */}
        <div className="w-full lg:w-1/3 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
            <h2 className="font-bold text-slate-800 text-sm">Copies en attente</h2>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {submissions.length}
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-gray-400 animate-pulse">Chargement des copies...</div>
          ) : submissions.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              🎉 Aucune copie en attente de correction !
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto flex-1 pr-1">
              {submissions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedSubmission(item);
                    setGrade('');
                    setFeedback('');
                  }}
                  className={`p-4 rounded-xl cursor-pointer border transition-all ${
                    selectedSubmission?.id === item.id
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-blue-700 uppercase">{item.caseNumber}</span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(item.submittedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{item.user.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{item.bookTitle}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Colonne 2 : Visualisation de la copie et Panneau de notation */}
        {selectedSubmission ? (
          <div className="w-full lg:w-2/3 flex flex-col lg:flex-row gap-6">
            
            {/* Visualisation de l'image de la copie */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col">
              <div className="mb-3">
                <h2 className="font-bold text-slate-900 text-sm">{selectedSubmission.caseNumber} — {selectedSubmission.bookTitle}</h2>
                <p className="text-xs text-gray-500">Étudiant : {selectedSubmission.user.name} ({selectedSubmission.user.email})</p>
              </div>
              
              <div className="flex-1 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center min-h-[350px] border border-gray-800">
                <img
                  src={selectedSubmission.imageUrl}
                  alt="Copie soumise"
                  className="max-h-[550px] w-auto object-contain"
                />
              </div>
            </div>

            {/* Formulaire de correction */}
            <div className="w-full lg:w-80 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-4 pb-2 border-b border-gray-100">
                  Évaluation
                </h3>

                <form onSubmit={handleGradeSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Note / Points attribués
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ex: 18"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold text-slate-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Commentaires / Feedback
                    </label>
                    <textarea
                      rows={5}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Remarques explicatives pour l'étudiant..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl transition-colors shadow-sm text-sm"
                  >
                    {submitting ? 'Validation...' : 'Valider la correction'}
                  </button>
                </form>
              </div>
            </div>

          </div>
        ) : (
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-8 flex items-center justify-center text-gray-400 text-sm">
            Sélectionnez une copie à gauche pour la corriger.
          </div>
        )}

      </div>
    </div>
  );
}