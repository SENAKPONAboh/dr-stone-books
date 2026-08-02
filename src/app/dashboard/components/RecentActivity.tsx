import { ActivityItem } from '../types';

export default function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
      <h3 className="text-base font-bold text-gray-900 mb-4">Dernières activités</h3>
      <div className="space-y-3">
        {activities.map((act) => (
          <div key={act.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/60 border border-gray-100">
            <div className="flex items-center space-x-3">
              <span className="text-emerald-500 font-bold">✔</span>
              <div>
                <p className="text-sm font-medium text-gray-800">{act.title}</p>
                <span className="text-xs text-gray-400">{act.timestamp}</span>
              </div>
            </div>
            {act.pointsEarned && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                +{act.pointsEarned} pts
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}