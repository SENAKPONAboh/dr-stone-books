'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Book {
  id: string;
  title: string;
  level: string;
  edition: string;
  progress: number;
  totalCases: number;
  completedCases: number;
  coverColor: string;
}

export default function BooksPage() {
  const [activationCode, setActivationCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [books, setBooks] = useState<Book[]>([]);

  // Charger les livres activés au démarrage
  useEffect(() => {
    const savedBooks = localStorage.getItem('userBooks');
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    } else {
      // Livre par défaut initial (ex: Anatomie)
      const initialBooks = [
        {
          id: '1',
          title: 'Anatomie & Biologie Cellulaire',
          level: '1ère année de médecine',
          edition: 'Édition 2027',
          progress: 60,
          totalCases: 20,
          completedCases: 12,
          coverColor: 'from-blue-600 to-indigo-800'
        }
      ];
      setBooks(initialBooks);
      localStorage.setItem('userBooks', JSON.stringify(initialBooks));
    }
  }, []);

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!activationCode.trim()) {
      setErrorMsg('Veuillez entrer un code d\'activation.');
      return;
    }

    // Simulation de vérification de code (Exemple valide : DSB-2027-TEST)
    if (activationCode.toUpperCase() === 'DSB-2027-TEST' || activationCode.startsWith('DSB-')) {
      const newBook: Book = {
        id: Date.now().toString(),
        title: 'Physiologie & Embryologie',
        level: '1ère année de médecine',
        edition: 'Édition 2027',
        progress: 0,
        totalCases: 25,
        completedCases: 0,
        coverColor: 'from-emerald-600 to-teal-800'
      };

      const updatedBooks = [...books, newBook];
      setBooks(updatedBooks);
      localStorage.setItem('userBooks', JSON.stringify(updatedBooks));
      setSuccessMsg('✅ Livre activé avec succès ! Bienvenue dans votre nouveau support.');
      setActivationCode('');
    } else {
      setErrorMsg('❌ Code invalide ou déjà utilisé. Vérifiez votre saisie.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Livres Dr Stone Books</h1>
          <p className="text-gray-500">Gérez vos exemplaires physiques et activez vos nouveaux accès.</p>
        </div>
        <Link href="/dashboard" className="self-start px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-sm transition-colors shadow-sm">
          Retour au tableau de bord
        </Link>
      </div>

      {/* Section Activation de Code */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-6 md:p-8 text-white shadow-lg">
        <h2 className="text-xl font-bold mb-2">Activer un nouveau livre</h2>
        <p className="text-blue-200 text-sm mb-6">Entrez le code unique fourni dans votre exemplaire physique Dr Stone Books.</p>
        
        <form onSubmit={handleActivate} className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={activationCode}
            onChange={(e) => setActivationCode(e.target.value)}
            placeholder="Ex: DSB-APB-2027-XXXXXX" 
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono uppercase"
          />
          <button 
            type="submit"
            className="bg-white text-blue-900 hover:bg-blue-50 font-bold px-6 py-3 rounded-xl transition-colors shadow-md"
          >
            Activer mon livre
          </button>
        </form>

        {errorMsg && <p className="mt-3 text-red-300 text-sm font-medium">{errorMsg}</p>}
        {successMsg && <p className="mt-3 text-emerald-300 text-sm font-medium">{successMsg}</p>}
      </div>

      {/* Liste des Livres Activés */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Bibliothèque active ({books.length})</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {books.map((book) => (
            <div key={book.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
              <div className={`p-6 bg-gradient-to-r ${book.coverColor} text-white`}>
                <span className="bg-white/20 text-xs px-2.5 py-1 rounded-full font-medium">{book.level}</span>
                <h4 className="text-xl font-bold mt-3">{book.title}</h4>
                <p className="text-white/80 text-sm mt-1">{book.edition}</p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span className="text-gray-600">Progression des cas</span>
                    <span className="text-blue-600 font-bold">{book.completedCases} / {book.totalCases} ({book.progress}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${book.progress}%` }}></div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">Statut : ✅ Activé</span>
                  <Link 
                    href={`/dashboard/cases?book=${book.id}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                  >
                    Voir les cas
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}