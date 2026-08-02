'use client';

import { useState } from 'react';
import Link from 'next/link';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'correction' | 'points' | 'rank' | 'challenge';
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Copie Corrigée',
      message: 'Ta réponse au cas 01 a été corrigée par un expert. Tu as obtenu 45 points.',
      time: 'Il y a 2 heures',
      read: false,
      type: 'correction'
    },
    {
      id: 'n2',
      title: 'Points Ajoutés',
      message: '+45 points ont été crédités sur ton compte suite à ta dernière soumission.',
      time: 'Il y a 2 heures',
      read: false,
      type: 'points'
    },
    {
      id: 'n3',
      title: 'Classement',
      message: 'Tu es maintenant 14e au classement général de la plateforme ! Continue tes efforts.',
      time: 'Hier',
      read: true,
      type: 'rank'
    },
    {
      id: 'n4',
      title: 'Challenge Mensuel',
      message: 'Le grand concours clinique de Février 2026 est officiellement ouvert. Inscris-toi dès maintenant.',
      time: 'Il y a 3 jours',
      read: true,
      type: 'challenge'
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Centre de Notifications</h1>
          <p className="text-gray-500">Restez informé de toutes vos corrections, points et actualités académiques.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={markAllAsRead}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-medium text-sm transition-colors shadow-sm"
          >
            Tout marquer comme lu
          </button>
          <Link href="/dashboard" className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-medium text-sm transition-colors shadow-sm">
            Tableau de bord
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
            Aucune notification pour le moment.
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-6 rounded-2xl border transition-all flex items-start justify-between gap-4 ${notif.read ? 'bg-white border-gray-100' : 'bg-blue-50/50 border-blue-200 shadow-sm'}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {notif.type === 'correction' ? '📝' : notif.type === 'points' ? '⭐' : notif.type === 'rank' ? '🏆' : '🔥'}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-900">{notif.title}</h3>
                    {!notif.read && <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{notif.message}</p>
                  <p className="text-xs text-gray-400 pt-1">{notif.time}</p>
                </div>
              </div>

              <button 
                onClick={() => deleteNotification(notif.id)}
                className="text-gray-400 hover:text-red-600 p-2 text-sm transition-colors"
                title="Supprimer"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}