import { UserProfile } from '../types';

export default function LevelProgress({ user }: { user: UserProfile }) {
  const currentXP = user.points;
  const maxXP = user.currentGrade.maxPoints;
  const percent = Math.round((currentXP / maxXP) * 100);
  const remainingXP = maxXP - currentXP;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Progression du Grade</span>
          <h2 className="text-lg font-bold text-gray-900">{user.currentGrade.icon} {user.currentGrade.title}</h2>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-blue-600">{currentXP} / {maxXP} XP</span>
          <span className="block text-xs text-gray-400">{percent} %</span>
        </div>
      </div>

      {/* Barre de progression personnalisée */}
      <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-3">
        <div 
          className="bg-blue-600 h-full rounded-full transition-all duration-500" 
          style={{ width: `${percent}%` }}
        ></div>
      </div>

      <p className="text-xs text-gray-600 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/50">
        💡 Encore <span className="font-semibold text-blue-700">{remainingXP} XP</span> pour atteindre <span className="font-semibold text-blue-700">{user.nextGradeTitle}</span>.
      </p>
    </div>
  );
}