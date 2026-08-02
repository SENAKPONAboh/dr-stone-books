'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  userName?: string;
}

export default function Header({ userName }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    localStorage.removeItem('user');
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="text-xl font-bold text-slate-900 tracking-tight">
          Dr Stone <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full ml-1">Espace Étudiant</span>
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        {userName && (
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Bienvenue,</span>
            <span className="text-sm font-bold text-gray-800">{userName}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/profile"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            👤 Mon Profil
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}