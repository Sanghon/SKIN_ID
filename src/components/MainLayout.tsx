import { Outlet } from 'react-router-dom'
import { AppFrame } from './AppFrame'
import { BottomNav } from './BottomNav'
import { CartBadge } from './CartBadge'
import { Toast } from './Toast'
import { brand } from '../config/brand'

/** Shell for every screen after onboarding — keeps the bottom nav (홈 / 기록 / 케어 / 마이) always visible. */
export function MainLayout() {
  return (
    <AppFrame>
      <CartBadge />
      <header className="flex items-center gap-1.5 px-4 pb-1 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <img src={brand.logo.icon} alt={brand.name} className="h-5 w-5" />
        <span className="text-[13px] font-bold tracking-tight text-ink">{brand.name}</span>
      </header>
      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-1">
        <Outlet />
      </div>
      <BottomNav />
      <Toast />
    </AppFrame>
  )
}
