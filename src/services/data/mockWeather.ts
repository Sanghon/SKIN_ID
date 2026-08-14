import type { DailyWeather, Season, WeatherCondition } from '../../types/weather'

const CONDITIONS_BY_SEASON: Record<Season, WeatherCondition[]> = {
  봄: ['sunny', 'sunny', 'cloudy', 'rainy'],
  여름: ['sunny', 'cloudy', 'rainy', 'rainy'],
  가을: ['sunny', 'sunny', 'cloudy', 'rainy'],
  겨울: ['sunny', 'cloudy', 'snowy', 'cloudy'],
}

const TEMP_RANGES: Record<Season, { highMin: number; highMax: number; lowMin: number; lowMax: number }> = {
  봄: { highMin: 14, highMax: 21, lowMin: 4, lowMax: 12 },
  여름: { highMin: 27, highMax: 34, lowMin: 21, lowMax: 26 },
  가을: { highMin: 16, highMax: 23, lowMin: 6, lowMax: 14 },
  겨울: { highMin: -1, highMax: 6, lowMin: -8, lowMax: -2 },
}

const UV_RANGES: Record<Season, { min: number; max: number }> = {
  봄: { min: 4, max: 8 },
  여름: { min: 7, max: 11 },
  가을: { min: 3, max: 6 },
  겨울: { min: 1, max: 3 },
}

export function getSeason(date: Date): Season {
  const month = date.getMonth() + 1
  if (month >= 3 && month <= 5) return '봄'
  if (month >= 6 && month <= 8) return '여름'
  if (month >= 9 && month <= 11) return '가을'
  return '겨울'
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function getWeatherForDate(input: Date | string): DailyWeather {
  const date = typeof input === 'string' ? new Date(input) : input
  const dateKey = toDateKey(date)
  const season = getSeason(date)
  const seed = hashString(dateKey)

  const conditions = CONDITIONS_BY_SEASON[season]
  const condition = conditions[Math.floor(pseudoRandom(seed) * conditions.length)]

  const { highMin, highMax, lowMin, lowMax } = TEMP_RANGES[season]
  const tempHigh = Math.round(highMin + pseudoRandom(seed + 1) * (highMax - highMin))
  const tempLow = Math.round(lowMin + pseudoRandom(seed + 2) * (lowMax - lowMin))

  const rainBoost = condition === 'rainy' || condition === 'snowy' ? 15 : 0
  const humidity = Math.round(32 + pseudoRandom(seed + 3) * 45 + rainBoost)

  const { min: uvMin, max: uvMax } = UV_RANGES[season]
  const uvCloudCut = condition === 'sunny' ? 1 : condition === 'cloudy' ? 0.65 : 0.35
  const uvIndex = Math.max(1, Math.round((uvMin + pseudoRandom(seed + 4) * (uvMax - uvMin)) * uvCloudCut))

  return {
    date: dateKey,
    condition,
    tempHigh,
    tempLow: Math.min(tempLow, tempHigh - 3),
    humidity: Math.min(95, humidity),
    uvIndex,
    season,
  }
}

export function getUpcomingWeather(days = 3): DailyWeather[] {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return getWeatherForDate(date)
  })
}
