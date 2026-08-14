import { useState } from 'react'
import type { ReactElement } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, Pill, ScoreLegend } from '../components'
import { InfoIcon, StarIcon, WeatherConditionIcon } from '../components/icons'
import { getOilScoreTone, getSkinTypeLabel, SCORE_LEGEND, TONE_VAR } from '../lib/skinAdvice'
import type { AdviceTone } from '../lib/skinAdvice'
import { getWeatherForDate, mockMeasurements, mockProducts, mockRoutineEvents } from '../services/data'

const TONE_SOFT_CLASS: Record<AdviceTone, string> = {
  lab: 'bg-lab-soft text-lab',
  accent: 'bg-accent-soft text-ink',
  yellow: 'bg-pop-yellow-soft text-ink',
  coral: 'bg-pop-coral-soft text-ink',
}

/** Reference-band opacity increases with oiliness so "darker = more oil" reads correctly at a glance. */
const BAND_OPACITY: Record<AdviceTone, number> = {
  lab: 0.07,
  accent: 0.07,
  yellow: 0.12,
  coral: 0.18,
}

type OilFace = 'cry' | 'smile' | 'neutral'

function oilFaceForTone(tone: AdviceTone): OilFace {
  if (tone === 'lab' || tone === 'coral') return 'cry'
  if (tone === 'accent') return 'smile'
  return 'neutral'
}

interface OilDropDotProps {
  cx?: number
  cy?: number
  payload?: ChartDatumRef
}

interface ChartDatumRef {
  oilScore: number
}

/** Custom chart marker: an oil-drop character whose expression communicates the score band, replacing the plain line dot. */
function OilDropDot({ cx, cy, payload }: OilDropDotProps) {
  if (cx == null || cy == null || !payload) return null
  const tone = getOilScoreTone(payload.oilScore)
  const face = oilFaceForTone(tone)
  const color = TONE_VAR[tone]
  const r = 7.2
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <path
        d={`M0 ${-r * 1.3} C ${r * 0.95} ${-r * 0.15}, ${r} ${r * 0.55}, 0 ${r} C ${-r} ${r * 0.55}, ${-r * 0.95} ${-r * 0.15}, 0 ${-r * 1.3} Z`}
        fill={color}
      />
      <circle cx={-2.3} cy={0.4} r={0.9} fill="var(--surface)" />
      <circle cx={2.3} cy={0.4} r={0.9} fill="var(--surface)" />
      {face === 'smile' && (
        <path d="M-2.3 3 Q0 4.9 2.3 3" stroke="var(--surface)" strokeWidth={0.9} fill="none" strokeLinecap="round" />
      )}
      {face === 'neutral' && (
        <line x1={-2.1} y1={3.4} x2={2.1} y2={3.4} stroke="var(--surface)" strokeWidth={0.9} strokeLinecap="round" />
      )}
      {face === 'cry' && (
        <path d="M-2.3 4.3 Q0 2.6 2.3 4.3" stroke="var(--surface)" strokeWidth={0.9} fill="none" strokeLinecap="round" />
      )}
    </g>
  )
}

const pad2 = (n: number) => String(n).padStart(2, '0')
const toDateKey = (date: Date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`

const routineByMeasurementId = new Map(mockRoutineEvents.map((e) => [e.measurementId, e]))
const productById = new Map(mockProducts.map((p) => [p.id, p]))

const chartData = mockMeasurements.map((m, i) => {
  const weather = getWeatherForDate(m.capturedAt)
  const prev = mockMeasurements[i - 1]
  const capturedDate = new Date(m.capturedAt)
  return {
    id: m.id,
    dateKey: toDateKey(capturedDate),
    day: capturedDate.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }),
    dateLabel: capturedDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }),
    oilScore: m.result.oilScore,
    tZoneScore: m.result.tZoneScore,
    uZoneScore: m.result.uZoneScore,
    skinType: m.result.skinType,
    delta: prev ? m.result.oilScore - prev.result.oilScore : 0,
    humidity: weather.humidity,
    condition: weather.condition,
    tempHigh: weather.tempHigh,
    tempLow: weather.tempLow,
    routineEvent: routineByMeasurementId.get(m.id),
  }
})

const dataByDateKey = new Map(chartData.map((d) => [d.dateKey, d]))

const average = Math.round(chartData.reduce((sum, d) => sum + d.oilScore, 0) / chartData.length)
const weekAvg = (slice: typeof chartData) =>
  Math.round(slice.reduce((sum, d) => sum + d.oilScore, 0) / slice.length)
const lastWeek = weekAvg(chartData.slice(-7))
const prevWeek = weekAvg(chartData.slice(0, 7))
const weekDelta = lastWeek - prevWeek
const averageTone = getOilScoreTone(average)

type ChartDatum = (typeof chartData)[number]

interface TooltipPayloadItem {
  dataKey: string
  value: number
  color: string
  payload: ChartDatum
}

function ScoreTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-xl border border-line bg-surface px-3 py-2 text-xs shadow-elevated">
      <p className="mb-1 font-medium text-ink">{d.dateLabel}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="tabular-nums">
          {p.dataKey === 'oilScore' ? 'Oil Score' : p.dataKey} {p.value}
        </p>
      ))}
      <p className="mt-1 text-ink-faint">
        습도 {d.humidity}% · {d.tempLow}°~{d.tempHigh}°
      </p>
    </div>
  )
}

function ScoreTrendCard() {
  return (
    <Card elevated className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-ink">Oil Score 추이</p>
          <p className="mt-0.5 text-xs text-ink-faint">최근 14일 · 오일 캐릭터의 표정으로 그날 상태를 확인해요</p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-semibold tabular-nums" style={{ color: TONE_VAR[averageTone] }}>
            {average}
          </p>
          <p className="text-[11px] text-ink-faint">
            지난주 대비 {weekDelta > 0 ? '+' : ''}
            {weekDelta}
          </p>
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 12, right: 12, left: -22, bottom: 0 }}>
            {SCORE_LEGEND.map((b) => (
              <ReferenceArea
                key={b.tone}
                y1={b.range[0]}
                y2={b.range[1]}
                fill={TONE_VAR[b.tone]}
                fillOpacity={BAND_OPACITY[b.tone]}
                label={{ value: b.label, position: 'insideTopRight', fontSize: 9, fill: 'var(--ink-faint)' }}
              />
            ))}
            <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--ink-faint)' }} axisLine={false} tickLine={false} />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: 'var(--ink-faint)' }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip content={<ScoreTooltip />} />
            <Line
              dataKey="oilScore"
              stroke="none"
              isAnimationActive={false}
              dot={<OilDropDot />}
              activeDot={<OilDropDot />}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <ScoreLegend />
    </Card>
  )
}

function ZoneCompareCard() {
  return (
    <Card className="flex flex-col gap-2">
      <p className="text-sm font-medium text-ink">T존 · U존 비교</p>
      <div className="h-36 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
            <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--ink-faint)' }} axisLine={false} tickLine={false} />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: 'var(--ink-faint)' }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip content={<ScoreTooltip />} />
            <Line dataKey="tZoneScore" stroke="var(--accent)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Line dataKey="uZoneScore" stroke="var(--pop-coral)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-3 text-[11px] text-ink-faint">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full" style={{ background: 'var(--accent)' }} />
          T존 (이마 · 코)
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full" style={{ background: 'var(--pop-coral)' }} />
          U존 (볼 · 턱)
        </span>
      </div>
    </Card>
  )
}

function MonthCalendarCard() {
  const latestDate = new Date(mockMeasurements[mockMeasurements.length - 1].capturedAt)
  const year = latestDate.getFullYear()
  const month = latestDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startWeekday = new Date(year, month, 1).getDay()
  const todayKey = toDateKey(new Date())

  const cells: ({ day: number; dateKey: string } | null)[] = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, dateKey: `${year}-${pad2(month + 1)}-${pad2(i + 1)}` })),
  ]

  return (
    <Card elevated className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <p className="text-sm font-medium text-ink">
          {year}년 {month + 1}월
        </p>
        <span className="group relative inline-flex">
          <button
            type="button"
            aria-label="달력 설명 보기"
            className="flex h-5 w-5 items-center justify-center text-ink-faint"
          >
            <InfoIcon width={14} height={14} />
          </button>
          <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 w-56 -translate-x-1/2 rounded-xl bg-ink px-3 py-2 text-[11px] leading-relaxed text-paper opacity-0 shadow-elevated transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            날짜별 색이 그날의 유분 상태예요 · 별표는 루틴 변경 기록이에요
          </span>
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {['일', '월', '화', '수', '목', '금', '토'].map((w) => (
          <span key={w} className="text-[11px] text-ink-faint">
            {w}
          </span>
        ))}
        {cells.map((cell, i) => {
          if (!cell) return <span key={`empty-${i}`} />
          const data = dataByDateKey.get(cell.dateKey)
          const tone = data ? getOilScoreTone(data.oilScore) : null
          const isToday = cell.dateKey === todayKey
          return (
            <div key={cell.dateKey} className="flex flex-col items-center gap-0.5">
              <div className="relative">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium tabular-nums ${
                    tone ? TONE_SOFT_CLASS[tone] : 'text-ink-faint'
                  } ${isToday ? 'ring-2 ring-ink' : ''}`}
                >
                  {cell.day}
                </span>
                {data?.routineEvent && (
                  <span
                    className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-surface"
                    title={`루틴 변경: ${data.routineEvent.note}`}
                  >
                    <StarIcon className="h-3 w-3" style={{ color: 'var(--pop-yellow)' }} />
                  </span>
                )}
              </div>
              <span className="flex h-3 items-center justify-center">
                {data && <WeatherConditionIcon condition={data.condition} className="h-3 w-3 text-ink-faint" />}
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function DailyRow({ d }: { d: ChartDatum }) {
  const tone = getOilScoreTone(d.oilScore)
  const routineProduct = d.routineEvent ? productById.get(d.routineEvent.productId) : undefined
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <WeatherConditionIcon condition={d.condition} className="h-6 w-6 shrink-0 text-ink-faint" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{d.dateLabel}</p>
          <p className="text-xs text-ink-faint">
            {d.tempLow}°~{d.tempHigh}° · 습도 {d.humidity}%
            {d.delta !== 0 && (
              <span className="ml-1">
                · 전일 대비 {d.delta > 0 ? '+' : ''}
                {d.delta}
              </span>
            )}
          </p>
        </div>
        <Pill tone={tone}>{getSkinTypeLabel(d.skinType)}</Pill>
        <span className="font-display w-8 text-right text-lg font-semibold tabular-nums" style={{ color: TONE_VAR[tone] }}>
          {d.oilScore}
        </span>
      </div>
      {d.routineEvent && (
        <p className="flex items-center gap-1.5 text-xs text-ink-soft">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
          {d.routineEvent.note}
          {routineProduct && <span className="text-ink-faint">· {routineProduct.name}</span>}
        </p>
      )}
    </Card>
  )
}

export function HistoryPage(): ReactElement {
  const [showDaily, setShowDaily] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <header>
        <p className="text-sm text-ink-soft">최근 14일</p>
        <h1 className="text-lg font-semibold text-ink">Skin History</h1>
      </header>

      <MonthCalendarCard />
      <ScoreTrendCard />
      <ZoneCompareCard />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink">Daily 기록</p>
          <button
            type="button"
            role="switch"
            aria-checked={showDaily}
            onClick={() => setShowDaily((v) => !v)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              showDaily ? 'bg-accent' : 'bg-surface-2'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-surface shadow-sm transition-transform ${
                showDaily ? 'translate-x-[22px]' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
        {showDaily &&
          [...chartData].reverse().map((d) => <DailyRow key={d.id} d={d} />)}
      </div>
    </div>
  )
}
