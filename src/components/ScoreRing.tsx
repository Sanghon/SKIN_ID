import type { AdviceTone } from '../lib/skinAdvice'
import { TONE_VAR } from '../lib/skinAdvice'

export function ScoreRing({
  score,
  tone,
  label,
  size = 108,
}: {
  score: number
  tone: AdviceTone
  label: string
  size?: number
}) {
  const stroke = 9
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const filled = (Math.min(100, Math.max(0, score)) / 100) * circumference

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={TONE_VAR[tone]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference - filled}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[28px] font-semibold tabular-nums text-ink">{score}</span>
        <span className="text-[11px] font-medium tracking-wide text-ink-soft">{label}</span>
      </div>
    </div>
  )
}
