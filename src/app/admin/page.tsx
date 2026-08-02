'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CodeBatch {
  id: string;
  bookTitle: string;
  edition: string;
  quantity: number;
  prefix: string;
  createdAt: string;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CORRECTEUR' | 'ETUDIANT';
  university?: string;
}

interface AdminChallenge {
  id: string;
  title: string;
  month: string;
  description: string;
  reward: string;
  startDate?: string;
  endDate?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface AdminStats {
  totalUsers: number;
  activeBooks: number;
  pendingCopies: number;
  activeCorrectors: number;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'codes' | 'users' | 'cases' | 'challenges'>('overview');
  
  // Statistiques dynamiques
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeBooks: 0,
    pendingCopies: 0,
    activeCorrectors: 0,
  });

  const [bookTitle, setBookTitle] = useState('Anatomie & Biologie Cellulaire');
  const [edition, setEdition] = useState('Édition 2027');
  const [quantity, setQuantity] = useState(100);
  const [successMsg, setSuccessMsg] = useState('');

  const [batches, setBatches] = useState<CodeBatch[]>([
    {
      id: 'b-1',
      bookTitle: 'Anatomie & Biologie Cellulaire',
      edition: 'Édition 2027',
      quantity: 500,
      prefix: 'DSB-APB-2027-',
      createdAt: '2026-06-15'
    }
  ]);

  const [users, setUsers] = useState<UserItem[]>([]);

  // Gestion des challenges dans l'admin
  const [challenges, setChallenges] = useState<AdminChallenge[]>([]);
  const [editingChallengeId, setEditingChallengeId] = useState<string | null>(null);
  const [challengeForm, setChallengeForm] = useState({
    title: '',
    month: '',
    description: '',
    reward: '',
    startDate: '',
    endDate: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  });
  const [challengeMsg, setChallengeMsg] = useState('');
  const [challengeError, setChallengeError] = useState('');

  // Fonction pour charger les statistiques réelles
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Erreur chargement statistiques", err);
    }
  };

  // Fonction pour charger les utilisateurs depuis l'API
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (err) {
      console.error("Erreur chargement utilisateurs", err);
    }
  };

  // Fonction pour charger les challenges
  const fetchChallenges = async () => {
    try {
      const res = await fetch('/api/admin/challenges');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setChallenges(data);
        }
      }
    } catch (err) {
      console.error("Erreur chargement challenges", err);
    }
  };

  useEffect(() => {
    fetchStats();
    if (activeTab === 'users') {
      fetchUsers();
    }
    if (activeTab === 'challenges') {
      fetchChallenges();
    }
  }, [activeTab]);

  const handleGenerateCodes = (e: React.FormEvent) => {
    e.preventDefault();
    const prefix = 'DSB-' + bookTitle.substring(0, 3).toUpperCase() + '-2027-';

    setBatches(prev => [
      {
        id: Date.now().toString(),
        bookTitle,
        edition,
        quantity,
        prefix,
        createdAt: new Date().toISOString().split('T')[0]
      },
      ...prev
    ]);
    setSuccessMsg(`✅ ${quantity} codes générés avec succès pour ${bookTitle} !`);
  };

  const handleChallengeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChallengeError('');
    setChallengeMsg('');

    try {
      const url = '/api/admin/challenges';
      const method = editingChallengeId ? 'PUT' : 'POST';
      const bodyData = editingChallengeId ? { ...challengeForm, id: editingChallengeId } : challengeForm;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de l'enregistrement du challenge.");
      }

      setChallengeMsg(editingChallengeId ? "Challenge mis à jour avec succès !" : "Challenge créé avec succès !");
      setChallengeForm({ title: '', month: '', description: '', reward: '', startDate: '', endDate: '', status: 'ACTIVE' });
      setEditingChallengeId(null);
      fetchChallenges();
    } catch (err: any) {
      setChallengeError(err.message);
    }
  };

  const handleEditChallenge = (ch: AdminChallenge) => {
    setEditingChallengeId(ch.id);
    setChallengeForm({
      title: ch.title,
      month: ch.month,
      description: ch.description,
      reward: ch.reward,
      startDate: ch.startDate || '',
      endDate: ch.endDate || '',
      status: ch.status,
    });
  };

  const handleDeleteChallenge = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce challenge ?")) return;

    try {
      const res = await fetch(`/api/admin/challenges?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setChallengeMsg("Challenge supprimé.");
        fetchChallenges();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Admin</span>
            <h1 className="text-lg font-bold">Dr Stone Books — Centre de Contrôle</h1>
          </div>
          <Link href="/dashboard" className="text-xs bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition-colors font-medium">
            Retour à l'espace étudiant
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 space-y-8">
        <div className="flex gap-2 border-b border-gray-200 pb-4 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
          >
            Vue d'ensemble & Statistiques
          </button>
          <button 
            onClick={() => setActiveTab('codes')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'codes' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
          >
            Génération des Codes d'Activation
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'users' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
          >
            Gestion des Utilisateurs
          </button>
          <button 
            onClick={() => setActiveTab('cases')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'cases' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
          >
            Gestion des Cas Pédagogiques
          </button>
          <button 
            onClick={() => { setActiveTab('challenges'); fetchChallenges(); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'challenges' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
          >
            Gestion des Challenges
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">Étudiants Inscrits</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{stats.totalUsers}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">Livres Activés</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{stats.activeBooks}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">Copies en Attente</p>
                <h3 className="text-3xl font-extrabold text-amber-600 mt-2">{stats.pendingCopies}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">Correcteurs Actifs</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{stats.activeCorrectors}</h3>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'codes' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Générer un lot de codes uniques</h2>
                <p className="text-xs text-gray-500 mt-1">Créez des codes sécurisés non prédictifs pour les nouveaux tirages physiques.</p>
              </div>

              {successMsg && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleGenerateCodes} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Livre concerné</label>
                  <select 
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="Anatomie & Biologie Cellulaire">Anatomie & Biologie Cellulaire</option>
                    <option value="Physiologie & Embryologie">Physiologie & Embryologie</option>
                    <option value="Sémiologie & Urgences Médicales">Sémiologie & Urgences Médicales</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Édition</label>
                  <input 
                    type="text" 
                    value={edition}
                    onChange={(e) => setEdition(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Quantité à générer</label>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min={1}
                    max={10000}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-sm text-sm"
                >
                  Générer le lot de codes
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Lots de codes récents</h3>
              <div className="space-y-3">
                {batches.map((batch) => (
                  <div key={batch.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{batch.bookTitle}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{batch.edition} — {batch.quantity} codes générés</p>
                      <span className="inline-block mt-2 font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">Préfixe : {batch.prefix}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{batch.createdAt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Autoriser un nouvel utilisateur</h2>
              <p className="text-xs text-gray-500 mb-6">Créez un compte et attribuez-lui son rôle (Étudiant, Correcteur ou Admin).</p>

              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const formData = new FormData(form);
                  
                  const data = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    role: formData.get('role'),
                    university: formData.get('university'),
                  };

                  try {
                    const res = await fetch('/api/admin/users', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(data),
                    });
                    const result = await res.json();
                    if (result.success) {
                      alert(result.message);
                      form.reset();
                      fetchUsers();
                    } else {
                      alert(result.error || "Une erreur est survenue.");
                    }
                  } catch (err) {
                    console.error(err);
                    alert("Erreur de connexion au serveur.");
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nom & Prénom</label>
                  <input type="text" name="name" placeholder="Ex: Jean Dupont" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" required />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Adresse Email</label>
                  <input type="email" name="email" placeholder="utilisateur@email.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" required />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mot de passe temporaire</label>
                  <input type="password" name="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" required />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Rôle attribué</label>
                  <select name="role" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
                    <option value="ETUDIANT">Étudiant</option>
                    <option value="CORRECTEUR">Correcteur</option>
                    <option value="ADMIN">Administrateur</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Université / Pôle</label>
                  <input type="text" name="university" placeholder="Ex: Faculté de Médecine" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                </div>

                <div className="md:col-span-2">
                  <button type="submit" className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-sm text-sm">
                    Enregistrer et autoriser l'utilisateur
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Utilisateurs enregistrés</h3>
                  <p className="text-xs text-gray-500">Modifiez les rôles des utilisateurs en direct.</p>
                </div>
                <button 
                  onClick={fetchUsers}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                >
                  Rafraîchir la liste
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="pb-3">Nom</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Université</th>
                      <th className="pb-3">Rôle Actuel</th>
                      <th className="pb-3 text-right">Changer le rôle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-400 text-xs">
                          Aucun utilisateur trouvé ou chargement en cours...
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50/50">
                          <td className="py-3 font-semibold text-slate-900">{u.name}</td>
                          <td className="py-3 text-gray-600 text-xs">{u.email}</td>
                          <td className="py-3 text-gray-500 text-xs">{u.university || 'N/A'}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                              u.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                              u.role === 'CORRECTEUR' ? 'bg-purple-100 text-purple-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <select 
                              value={u.role}
                              onChange={async (e) => {
                                const newRole = e.target.value;
                                try {
                                  const res = await fetch('/api/admin/users', {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ userId: u.id, role: newRole }),
                                  });
                                  const data = await res.json();
                                  if (data.success) {
                                    fetchUsers();
                                  } else {
                                    alert(data.error || "Erreur lors de la modification");
                                  }
                                } catch (err) {
                                  console.error(err);
                                  alert("Erreur réseau");
                                }
                              }}
                              className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-medium focus:outline-none"
                            >
                              <option value="ETUDIANT">Étudiant</option>
                              <option value="CORRECTEUR">Correcteur</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Gestion des Cas Cliniques</h2>
                <p className="text-xs text-gray-500">Ajoutez et configurez les cas de raisonnement associés aux ouvrages.</p>
              </div>
              <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                + Ajouter un nouveau cas
              </button>
            </div>
            <div className="p-12 text-center text-gray-400 border border-dashed border-gray-200 rounded-xl">
              Module de gestion des cas et barèmes prêt à être relié à la base de données.
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingChallengeId ? "Modifier le challenge" : "Créer un nouveau challenge"}
                  </h2>
                  <p className="text-xs text-gray-500">Définissez les dates, la récompense et activez le challenge pour le dashboard étudiant.</p>
                </div>
                {editingChallengeId && (
                  <button 
                    onClick={() => {
                      setEditingChallengeId(null);
                      setChallengeForm({ title: '', month: '', description: '', reward: '', startDate: '', endDate: '', status: 'ACTIVE' });
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700 font-semibold underline"
                  >
                    Annuler la modification
                  </button>
                )}
              </div>

              {challengeMsg && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                  {challengeMsg}
                </div>
              )}
              {challengeError && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold">
                  {challengeError}
                </div>
              )}

              <form onSubmit={handleChallengeSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Titre du challenge</label>
                  <input 
                    type="text" 
                    value={challengeForm.title}
                    onChange={(e) => setChallengeForm({ ...challengeForm, title: e.target.value })}
                    placeholder="Ex: Grand Concours de Sémiologie" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Période / Mois</label>
                  <input 
                    type="text" 
                    value={challengeForm.month}
                    onChange={(e) => setChallengeForm({ ...challengeForm, month: e.target.value })}
                    placeholder="Ex: Février 2026" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Date de début</label>
                  <input 
                    type="date" 
                    value={challengeForm.startDate}
                    onChange={(e) => setChallengeForm({ ...challengeForm, startDate: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Date de fin</label>
                  <input 
                    type="date" 
                    value={challengeForm.endDate}
                    onChange={(e) => setChallengeForm({ ...challengeForm, endDate: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                  <textarea 
                    value={challengeForm.description}
                    onChange={(e) => setChallengeForm({ ...challengeForm, description: e.target.value })}
                    rows={3}
                    placeholder="Détails des règles du challenge..." 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Récompense</label>
                  <input 
                    type="text" 
                    value={challengeForm.reward}
                    onChange={(e) => setChallengeForm({ ...challengeForm, reward: e.target.value })}
                    placeholder="Ex: 1er Prix : Stéthoscope Littmann" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Statut</label>
                  <select 
                    value={challengeForm.status}
                    onChange={(e) => setChallengeForm({ ...challengeForm, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="ACTIVE">Actif (Visible sur le dashboard)</option>
                    <option value="INACTIVE">Inactif</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                  {editingChallengeId && (
                    <button 
                      type="button"
                      onClick={() => {
                        setEditingChallengeId(null);
                        setChallengeForm({ title: '', month: '', description: '', reward: '', startDate: '', endDate: '', status: 'ACTIVE' });
                      }}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors"
                    >
                      Annuler
                    </button>
                  )}
                  <button type="submit" className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-sm text-sm">
                    {editingChallengeId ? "Mettre à jour le challenge" : "Enregistrer et publier le challenge"}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Challenges enregistrés</h3>
              <div className="space-y-3">
                {challenges.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">Aucun challenge enregistré en base de données.</p>
                ) : (
                  challenges.map((ch) => (
                    <div key={ch.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${ch.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'}`}>
                            {ch.status}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm">{ch.title} ({ch.month})</h4>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{ch.description}</p>
                        <p className="text-xs font-semibold text-amber-700 mt-1">🏆 {ch.reward}</p>
                        {(ch.startDate || ch.endDate) && (
                          <p className="text-[11px] text-gray-400 mt-1">Du {ch.startDate || 'N/A'} au {ch.endDate || 'N/A'}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditChallenge(ch)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-xl transition-colors"
                        >
                          Modifier
                        </button>
                        <button 
                          onClick={() => handleDeleteChallenge(ch.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-colors"
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
        )}
      </main>
    </div>
  );
}