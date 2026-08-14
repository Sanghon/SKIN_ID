import type { SkinType } from './skin'

export interface User {
  id: string
  nickname: string
  avatarUrl: string | null
  skinTypeEstimate: SkinType | null
  createdAt: string
}

export interface FriendComparison {
  friendId: string
  nickname: string
  avatarUrl: string | null
  oilScore: number
  rankDelta: number
}
