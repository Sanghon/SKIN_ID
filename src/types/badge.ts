export interface Badge {
  id: string
  name: string
  description: string
  iconUrl: string
}

export interface UserBadge {
  badgeId: string
  earnedAt: string
}

export interface StreakInfo {
  currentStreak: number
  longestStreak: number
  lastMeasuredAt: string | null
}
