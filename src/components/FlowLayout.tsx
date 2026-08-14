import { Outlet } from 'react-router-dom'
import { AppFrame } from './AppFrame'

/** Shell for the pre-entry splash (온보딩) — no bottom nav, no prior data yet. */
export function FlowLayout() {
  return (
    <AppFrame>
      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-[max(1rem,env(safe-area-inset-top))]">
        <Outlet />
      </div>
    </AppFrame>
  )
}
