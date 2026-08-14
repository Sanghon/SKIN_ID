import type { Badge, StreakInfo, UserBadge } from '../../types/badge'

export const mockBadges: Badge[] = [
  { id: 'badge-first', name: '첫 측정', description: '첫 번째 피지 측정을 완료했어요.', iconUrl: '' },
  { id: 'badge-streak-7', name: '7일 연속', description: '7일 연속으로 측정했어요.', iconUrl: '' },
  { id: 'badge-streak-30', name: '30일 연속', description: '30일 연속으로 측정했어요.', iconUrl: '' },
  { id: 'badge-balance', name: '밸런스 유지', description: '7일간 유분 변동폭이 10 이하였어요.', iconUrl: '' },
]

export const mockUserBadges: UserBadge[] = [
  { badgeId: 'badge-first', earnedAt: '2026-06-02T00:00:00.000Z' },
  { badgeId: 'badge-streak-7', earnedAt: '2026-06-09T00:00:00.000Z' },
]

export const mockStreak: StreakInfo = {
  currentStreak: 5,
  longestStreak: 12,
  lastMeasuredAt: new Date().toISOString(),
}
