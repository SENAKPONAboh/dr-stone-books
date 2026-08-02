import { LeaderboardUser } from '../types';

export default function LeaderboardWidget({ leaderboard }: { leaderboard: LeaderboardUser[] }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-gray-900">Top du classement</h3>
        <span className="text-xs font-semibold text-blue-600 cursor-pointer hover:underline">Voir tout</span>
      </div>
      <div className="space-y-2 mb-4">
        {leaderboard.map((user) => (
          <div 
            key={user.rank} 
            className={`flex items-center justify-between p-3 rounded-xl border ${user.isCurrentUser ? 'bg-blue-50/70 border-blue-200 font-semibold' : 'bg-white border-gray-100'}`}
          >
            <div className="flex items-center space-x-3">
              <span className={`w-6 text-center text-sm font-bold ${user.rank <= 3 ? 'text-amber-500' : 'text-gray-500'}`}>
                {user.rank}
              </span>
              <span className="text-sm text-gray-800">{user.name}</span>
            </div>
            <span className="text-xs font-bold text-blue-600">{user.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}