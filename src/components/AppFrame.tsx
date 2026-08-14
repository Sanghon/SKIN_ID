import type { ReactNode } from 'react'

export function AppFrame({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex w-full max-w-md flex-1 flex-col">{children}</div>
}
