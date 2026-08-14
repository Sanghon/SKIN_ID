export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy'

export type Season = '봄' | '여름' | '가을' | '겨울'

export interface DailyWeather {
  date: string
  condition: WeatherCondition
  tempHigh: number
  tempLow: number
  humidity: number
  uvIndex: number
  season: Season
}
