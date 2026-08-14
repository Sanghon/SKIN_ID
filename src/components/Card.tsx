import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  elevated?: boolean
}

export function Card({ children, elevated = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-3xl border border-line bg-white p-4 ${elevated ? 'shadow-elevated' : 'shadow-card'} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
