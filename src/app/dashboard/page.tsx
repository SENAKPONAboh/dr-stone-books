import Header from './components/Header';
import WelcomeBanner from './components/WelcomeBanner';
import StatsGrid from './components/StatsGrid';
import LevelProgress from './components/LevelProgress';
import CurrentBookCard from './components/CurrentBookCard';
import QuickActions from './components/QuickActions';
import RecentActivity from './components/RecentActivity';
import LeaderboardWidget from './components/LeaderboardWidget';
import BadgesSection from './components/BadgesSection';
import MonthlyChallenge from './components/MonthlyChallenge';

import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  
  // 1. Récupérer l'utilisateur
  const dbUser = await prisma.user.findFirst({
    where: { role: 'ETUDIANT' },
    orderBy: { createdAt: 'asc' }
  });

  const user = dbUser ? {
    id: dbUser.id,
    name: dbUser.name,
    university: dbUser.university || "Université non renseignée",
    faculty: dbUser.faculty || "Faculté de Médecine",
    level: dbUser.level || "Étudiant",
    avatarUrl: "",
    points: dbUser.points,
    currentGrade: {
      title: dbUser.points >= 500 ? "Argent – Interne Confirmé" : "Bronze – Interne",
      icon: dbUser.points >= 500 ? "🥈" : "🥉",
      minPoints: 0,
      maxPoints: 500,
    },
    nextGradeTitle: "Argent – Interne Confirmé",
  } : {
    id: '',
    name: "Étudiant",
    university: "Non renseigné",
    faculty: "Médecine",
    level: "EM",
    avatarUrl: "",
    points: 0,
    currentGrade: { title: "Bronze", icon: "🥉", minPoints: 0, maxPoints: 500 },
    nextGradeTitle: "Argent",
  };

  // 2. Récupérer les statistiques réelles depuis la base de données
  const activatedBooksCount = dbUser ? await prisma.bookActivation.count({
    where: { userId: dbUser.id }
  }) : 0;

  const completedCasesCount = dbUser ? await prisma.caseSubmission.count({
    where: { userId: dbUser.id, status: 'GRADED' }
  }) : 0;

  const activeBookRecord = dbUser ? await prisma.bookActivation.findFirst({
    where: { userId: dbUser.id },
    orderBy: { activatedAt: 'desc' }
  }) : null;

  const bookData = {
    title: activeBookRecord ? activeBookRecord.bookTitle : "Aucun livre activé",
    totalChapters: 12,
    totalCases: 0, // Zéro valeur fictive : basé sur la réalité de la base
    completedCases: completedCasesCount,
    progressPercent: 0,
  };

  // Statistiques dynamiques pour le composant StatsGrid
  const statsData = {
    activatedBooks: activatedBooksCount,
    completedCases: completedCasesCount,
    points: user.points,
  };

  // 3. Activités récentes avec typage strict
  const userSubmissions = dbUser ? await prisma.caseSubmission.findMany({
    where: { userId: dbUser.id },
    orderBy: { updatedAt: 'desc' },
    take: 5
  }) : [];

  const activitiesData = userSubmissions.length > 0 ? userSubmissions.map((sub: any) => ({
    id: sub.id,
    type: (sub.status === 'GRADED' ? 'correction' : 'submission') as "challenge" | "badge" | "correction" | "submission",
    title: sub.status === 'GRADED' ? `${sub.caseNumber} corrigé (+${sub.grade || 0} pts)` : `${sub.caseNumber} envoyé pour correction`,
    pointsEarned: sub.grade || 0,
    timestamp: new Date(sub.updatedAt).toLocaleDateString(),
  })) : [
    { id: '1', type: 'submission' as const, title: 'Aucune activité récente', pointsEarned: 0, timestamp: '-' }
  ];

  // 4. Classement dynamique
  const allStudents = await prisma.user.findMany({
    where: { role: 'ETUDIANT' },
    orderBy: { points: 'desc' },
    take: 10
  });

  const leaderboardData = allStudents.length > 0 ? allStudents.map((s, index) => ({
    rank: index + 1,
    name: s.id === dbUser?.id ? `${s.name} (Moi)` : s.name,
    points: s.points,
    isCurrentUser: s.id === dbUser?.id
  })) : [
    { rank: 1, name: 'Aucun classement disponible', points: 0, isCurrentUser: false }
  ];

  // 5. Badges
  const badgesData = dbUser ? await prisma.userBadge.findMany({
    where: { userId: dbUser.id },
    include: { badge: true }
  }) : [];

  const formattedBadges = badgesData.length > 0 ? badgesData.map((ub: any) => ({
    id: ub.badge.id,
    title: ub.badge.title,
    icon: ub.badge.icon,
    unlocked: true
  })) : [
    { id: '1', title: 'Aucun badge pour le moment', icon: '🔒', unlocked: false }
  ];

  // 6. Challenge actif
  const currentChallenge = await prisma.challenge.findFirst({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' }
  });

  const challengeData = currentChallenge ? {
    title: currentChallenge.title,
    month: currentChallenge.month,
    description: currentChallenge.description,
    reward: currentChallenge.reward,
    participantsCount: currentChallenge.participantsCount
  } : {
    title: "Aucun challenge en cours",
    month: "À venir",
    description: "Revenez plus tard ! L'équipe Dr Stone prépare de nouveaux défis.",
    reward: "-",
    participantsCount: 0
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header userName={user.name}  />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <WelcomeBanner user={user} />
        <StatsGrid  />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <LevelProgress user={user} />
            <CurrentBookCard book={bookData} />
            <QuickActions />
            <BadgesSection badges={formattedBadges} />
          </div>

          <div className="space-y-6">
            <MonthlyChallenge challenge={challengeData} />
            <RecentActivity activities={activitiesData} />
            <LeaderboardWidget leaderboard={leaderboardData} />
          </div>
        </div>
      </main>
    </div>
  );
}