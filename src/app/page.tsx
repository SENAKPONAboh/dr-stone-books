export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center py-16 px-4">
      {/* Conteneur principal */}
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* En-tête bleu */}
        <div className="bg-blue-600 text-white text-center py-12 px-6">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">Dr Stone Books 📚</h1>
          <p className="text-blue-100 text-lg">La plateforme de cas cliniques de référence pour vos révisions.</p>
        </div>
        
        {/* Contenu de la page */}
        <div className="p-8">
          <div className="border-l-4 border-blue-500 pl-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Livre à la Une</h2>
            <p className="text-gray-500 text-sm">Disponible dès maintenant</p>
          </div>
          
          {/* Carte du livre */}
          <div className="bg-slate-100 p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">Anatomie & Biologie Cellulaire</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                Nouveau
              </span>
            </div>
            <p className="text-slate-600 mb-6">
              Testez vos connaissances et votre raisonnement médical avec nos cas cliniques approfondis.
            </p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
              Accéder aux cas cliniques
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}