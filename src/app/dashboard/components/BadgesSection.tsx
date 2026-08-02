import { BadgeItem } from '../types';

export default function BadgesSection({ badges }: { badges: BadgeItem[] }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
      <h3 className="text-base font-bold text-gray-900 mb-4">Badges & Récompenses</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {badges.map((badge) => (
          <div 
            key={badge.id} 
            className={`p-4 rounded-xl border flex flex-col items-center text-center transition ${badge.unlocked ? 'bg-amber-50/40 border-amber-200' : 'bg-gray-50 border-gray-200 opacity-50 grayscale'}`}
          >
            <span className="text-3xl mb-2">{badge.icon}</span>
            <span className="text-xs font-bold text-gray-800">{badge.title}</span>
            <span className="text-[10px] mt-1 text-gray-500">{badge.unlocked ? 'Débloqué' : 'Verrouillé'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}