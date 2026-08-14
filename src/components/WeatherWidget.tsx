import type { ComponentType, SVGProps } from 'react'
import { getHumidityAdvice, getTempAdvice, getUvAdvice } from '../lib/skinAdvice'
import { getUpcomingWeather } from '../services/data'
import type { Season } from '../types/weather'
import { Card } from './Card'
import { HumidityIcon, TempIcon, UvIcon, WeatherConditionIcon } from './icons'
import { Pill } from './Pill'

const DAY_LABELS = ['오늘', '내일', '모레']

const SEASON_TONE: Record<Season, 'coral' | 'yellow' | 'lab'> = {
  봄: 'coral',
  여름: 'yellow',
  가을: 'coral',
  겨울: 'lab',
}

export function WeatherWidget() {
  const days = getUpcomingWeather(3)
  const today = days[0]

  const uv = getUvAdvice(today.uvIndex)
  const humidity = getHumidityAdvice(today.humidity)
  const temp = getTempAdvice(today.tempHigh)

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink">오늘 날씨가 피부에 주는 영향</span>
        <Pill tone={SEASON_TONE[today.season]}>{today.season}</Pill>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <WeatherStat icon={UvIcon} value={`UV ${today.uvIndex}`} advice={uv} />
        <WeatherStat icon={HumidityIcon} value={`습도 ${today.humidity}%`} advice={humidity} />
        <WeatherStat icon={TempIcon} value={`${today.tempHigh}°`} advice={temp} />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {days.map((day, i) => (
          <div
            key={day.date}
            className={`flex flex-col items-center gap-1 rounded-2xl py-2.5 ${
              i === 0 ? 'bg-accent-soft' : 'bg-surface-2'
            }`}
          >
            <span className={`text-xs font-medium ${i === 0 ? 'text-ink' : 'text-ink-faint'}`}>
              {DAY_LABELS[i]}
            </span>
            <WeatherConditionIcon
              condition={day.condition}
              width={20}
              height={20}
              className={i === 0 ? 'text-ink' : 'text-ink-soft'}
            />
            <span className="text-xs font-medium tabular-nums text-ink">
              {day.tempHigh}° / {day.tempLow}°
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}

function WeatherStat({
  icon: Icon,
  value,
  advice,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  value: string
  advice: { label: string; tone: 'accent' | 'coral' | 'yellow' | 'lab' }
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-surface-2 py-3">
      <Icon width={18} height={18} className="text-ink-soft" />
      <span className="text-xs font-semibold tabular-nums text-ink">{value}</span>
      <Pill tone={advice.tone} className="px-2 py-0.5 text-[10px]">
        {advice.label}
      </Pill>
    </div>
  )
}
