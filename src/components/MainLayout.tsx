import { Outlet } from 'react-router-dom'
import { AppFrame } from './AppFrame'
import { BottomNav } from './BottomNav'
import { CartBadge } from './CartBadge'
import { Toast } from './Toast'

/** Shell for every screen after onboarding — keeps the bottom nav (홈 / 기록 / 케어 / 마이) always visible. */
export function MainLayout() {
  return (
    <AppFrame>
      <CartBadge />
      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <Outlet />
      </div>
      <BottomNav />
      <Toast />
    </AppFrame>
  )
}
