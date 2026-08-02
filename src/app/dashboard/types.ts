export interface UserProfile {
  name: string;
  university: string;
  faculty: string;
  level: string;
  avatarUrl: string;
  points: number;
  currentGrade: {
    title: string;
    icon: string;
    minPoints: number;
    maxPoints: number;
  };
  nextGradeTitle: string;
}

export interface BookProgress {
  title: string;
  totalChapters: number;
  totalCases: number;
  completedCases: number;
  progressPercent: number;
}

export interface ActivityItem {
  id: string;
  type: 'correction' | 'badge' | 'challenge' | 'submission';
  title: string;
  pointsEarned?: number;
  timestamp: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;
  isCurrentUser?: boolean;
}

export interface BadgeItem {
  id: string;
  title: string;
  icon: string;
  unlocked: boolean;
}

export interface Challenge {
  title: string;
  timeLeft: string;
  participantsCount: number;
  reward: string;
}