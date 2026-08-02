import { UserProfile, BookProgress, ActivityItem, LeaderboardUser, BadgeItem, Challenge } from './types';

// Données mockées basées sur ton profil et tes exigences
export const mockUser: UserProfile = {
  name: "Arthur",
  university: "Université d'État",
  faculty: "Faculté de Médecine et de Pharmacie",
  level: "EM4 (4ème année)",
  avatarUrl: "", // vide pour afficher les initiales par défaut si besoin
  points: 325,
  currentGrade: {
    title: "Bronze – Interne",
    icon: "🥉",
    minPoints: 0,
    maxPoints: 500,
  },
  nextGradeTitle: "Argent – Interne Confirmé",
};

export const mockBook: BookProgress = {
  title: "Anatomie & Biologie Cellulaire",
  totalChapters: 12,
  totalCases: 40,
  completedCases: 8,
  progressPercent: 20,
};

export const mockActivities: ActivityItem[] = [
  { id: '1', type: 'correction', title: 'Cas 5 corrigé', pointsEarned: 45, timestamp: 'Il y a 2h' },
  { id: '2', type: 'badge', title: 'Nouveau badge débloqué : Premier Cas', timestamp: 'Hier' },
  { id: '3', type: 'challenge', title: 'Nouveau challenge disponible', timestamp: 'Il y a 2 jours' },
  { id: '4', type: 'submission', title: 'Cas 8 envoyé pour correction', timestamp: 'Il y a 3 jours' },
];

export const mockLeaderboard: LeaderboardUser[] = [
  { rank: 1, name: 'Étudiant A', points: 820 },
  { rank: 2, name: 'Étudiant B', points: 750 },
  { rank: 3, name: 'Étudiant C', points: 690 },
  { rank: 18, name: 'Arthur (Moi)', points: 325, isCurrentUser: true },
];

export const mockBadges: BadgeItem[] = [
  { id: '1', title: 'Premier Cas', icon: '🩺', unlocked: true },
  { id: '2', title: 'Premier Livre', icon: '📚', unlocked: true },
  { id: '3', title: 'Série de 10 réussites', icon: '🔥', unlocked: false },
  { id: '4', title: 'Top 10', icon: '🏅', unlocked: false },
];

export const mockChallenge: Challenge = {
  title: 'Grand Challenge Diagnostique d\'Anatomie',
  timeLeft: '4 jours restants',
  participantsCount: 142,
  reward: '+150 Points & Badge Exclusif',
};