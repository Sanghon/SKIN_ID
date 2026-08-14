export type SkinType = '극건성' | '건성' | '중성' | '지성' | '극지성' | '복합성'

export type SkinCharacterId =
  | 'sahara'
  | 'cactus'
  | 'balance'
  | 'double-life'
  | 'oil-field'
  | 'oil-king'

export interface SkinCharacter {
  id: SkinCharacterId
  name: string
  nameEn: string
  skinType: SkinType
  description: string
}

export type FaceZone = '이마' | '코' | '왼쪽볼' | '오른쪽볼' | '턱'

export interface ZoneScore {
  zone: FaceZone
  oilCoverage: number
  oilIntensity: number
  score: number
}
