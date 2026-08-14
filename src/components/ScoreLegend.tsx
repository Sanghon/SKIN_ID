import { SCORE_LEGEND, TONE_VAR } from '../lib/skinAdvice'

interface ScoreLegendProps {
  /** 'compact' shows just dot + label (for tight spaces like chart captions). 'detailed' also shows the score range. */
  variant?: 'compact' | 'detailed'
  className?: string
}

/** Shared legend explaining what each oil-score color band means, driven by SCORE_LEGEND. */
export function ScoreLegend({ variant = 'compact', className = '' }: ScoreLegendProps) {
  if (variant === 'detailed') {
    return (
      <div className={`grid grid-cols-2 gap-2 ${className}`}>
        {SCORE_LEGEND.map((b) => (
          <div key={b.tone} className="flex items-center gap-2 rounded-xl bg-surface-2 px-2.5 py-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: TONE_VAR[b.tone] }} />
            <div className="min-w-0 leading-tight">
              <p className="truncate text-xs font-medium text-ink">{b.label}</p>
              <p className="text-[10px] text-ink-faint tabular-nums">
                {b.range[0]}–{b.range[1]}
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-ink-faint ${className}`}>
      {SCORE_LEGEND.map((b) => (
        <span key={b.tone} className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: TONE_VAR[b.tone] }} />
          {b.label}
        </span>
      ))}
    </div>
  )
}
