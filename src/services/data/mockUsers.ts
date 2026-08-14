import type { FriendComparison, User } from '../../types/user'

export const mockCurrentUser: User = {
  id: 'user-1',
  nickname: '민지',
  avatarUrl: null,
  skinTypeEstimate: '지성',
  createdAt: '2026-06-01T00:00:00.000Z',
}

export const mockFriends: FriendComparison[] = [
  { friendId: 'user-2', nickname: '서연', avatarUrl: null, oilScore: 42, rankDelta: 1 },
  { friendId: 'user-3', nickname: '하은', avatarUrl: null, oilScore: 58, rankDelta: -1 },
  { friendId: 'user-4', nickname: '지우', avatarUrl: null, oilScore: 33, rankDelta: 0 },
]
