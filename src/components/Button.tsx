import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-accent text-accent-ink hover:brightness-105 shadow-elevated',
  secondary: 'bg-surface-2 text-ink hover:bg-line/60',
  ghost: 'bg-transparent text-ink border border-line hover:bg-surface-2',
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[17px] font-semibold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
