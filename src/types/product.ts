export type CareStep = 'cleansing' | 'hydration' | 'oil-control' | 'sun-care'

export interface Product {
  id: string
  name: string
  brand: string
  step: CareStep
  price: number
  imageUrl: string
  description: string
  matchScore: number
  reason: string
}

export interface RoutineEvent {
  id: string
  measurementId: string
  productId: string
  note: string
}
