import type { HTMLAttributes, ReactNode } from 'react'

type Tone = 'neutral' | 'accent' | 'lab' | 'coral' | 'yellow'

interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  tone?: Tone
}

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-surface-2 text-ink-soft',
  accent: 'bg-accent-soft text-ink',
  lab: 'bg-lab-soft text-lab',
  coral: 'bg-pop-coral-soft text-ink',
  yellow: 'bg-pop-yellow-soft text-ink',
}

export function Pill({ children, tone = 'neutral', className = '', ...props }: PillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
