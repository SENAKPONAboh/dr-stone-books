import { UserProfile } from '../types';

export default function WelcomeBanner({ user }: { user: UserProfile }) {
  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 rounded-2xl shadow-md mb-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Bonjour {user.name} 👋
      </h1>
      <p className="text-blue-100 mb-4 opacity-90">
        Bienvenue sur Dr Stone Books Platform. Prêt à progresser aujourd'hui ?
      </p>
      <div className="flex flex-wrap gap-2 text-xs md:text-sm">
        <span className="bg-blue-800/80 px-3 py-1 rounded-full border border-blue-600/50">
          🏛️ {user.university}
        </span>
        <span className="bg-blue-800/80 px-3 py-1 rounded-full border border-blue-600/50">
          🔬 {user.faculty}
        </span>
        <span className="bg-blue-600 px-3 py-1 rounded-full font-semibold">
          🎓 {user.level}
        </span>
      </div>
    </div>
  );
}