'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AdminChallenge {
  id: string;
  title: string;
  month: string;
  description: string;
  reward: string;
  status: 'ACTIVE' | 'INACTIVE';
  participantsCount: number;
}

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<AdminChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mode édition ou création
  const [editingId, setEditingId] = useState<string | null>(null);

  // Formulaire
  const [formData, setFormData] = useState({
    title: '',
    month: '',
    description: '',
    reward: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  });

  const fetchChallenges = async () => {
    try {
      const res = await fetch('/api/admin/challenges');
      if (res.ok) {
        const data = await res.json();
        setChallenges(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const url = '/api/admin/challenges';
      const method = editingId ? 'PUT' : 'POST';
      const bodyData = editingId ? { ...formData, id: editingId } : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de l'enregistrement du challenge.");
      }

      setSuccess(editingId ? "Challenge modifié avec succès !" : "Challenge créé avec succès !");
      setFormData({ title: '', month: '', description: '', reward: '', status: 'ACTIVE' });
      setEditingId(null);
      fetchChallenges();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (ch: AdminChallenge) => {
    setEditingId(ch.id);
    setFormData({
      title: ch.title,
      month: ch.month,
      description: ch.description,
      reward: ch.reward,
      status: ch.status,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', month: '', description: '', reward: '', status: 'ACTIVE' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce challenge ?")) return;

    try {
      const res = await fetch(`/api/admin/challenges?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSuccess("Challenge supprimé.");
        fetchChallenges();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement des challenges...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 p-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administration des Challenges</h1>
          <p className="text-sm text-gray-500">Créez, modifiez et gérez les concours affichés sur le dashboard étudiant</p>
        </div>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
        >
          Retour au Dashboard
        </Link>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-sm font-semibold">
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Formulaire de création / modification */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-900">
            {editingId ? "Modifier le challenge" : "Créer un nouveau challenge"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-xs text-gray-500 hover:text-gray-700 font-semibold underline"
            >
              Annuler la modification
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Titre du challenge</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Période / Mois</label>
            <input
              type="text"
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              placeholder="Ex: Février 2026"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Récompense</label>
            <input
              type="text"
              value={formData.reward}
              onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
              placeholder="Ex: 1er Prix : Pack complet..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="ACTIVE">Actif (Visible sur le dashboard)</option>
              <option value="INACTIVE">Inactif</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end pt-2 gap-3">
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
          >
            {editingId ? "Mettre à jour le challenge" : "Ajouter le challenge"}
          </button>
        </div>
      </form>

      {/* Liste des challenges existants */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Challenges enregistrés</h2>
        <div className="space-y-3">
          {challenges.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun challenge enregistré en base de données.</p>
          ) : (
            challenges.map((ch) => (
              <div key={ch.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-2xl border border-gray-200 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${ch.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'}`}>
                      {ch.status}
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm">{ch.title} ({ch.month})</h3>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{ch.description}</p>
                  <p className="text-xs font-semibold text-amber-700 mt-1">🏆 {ch.reward}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(ch)}
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-xl transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(ch.id)}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}