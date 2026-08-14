import { NavLink } from 'react-router-dom'
import { CareIcon, HistoryIcon, HomeIcon, MyIcon, ScanIcon } from './icons'

type Tone = 'accent' | 'lab' | 'coral' | 'yellow'

const toneActiveText: Record<Tone, string> = {
  accent: 'text-accent-ink',
  lab: 'text-lab',
  coral: 'text-pop-coral',
  yellow: 'text-pop-yellow',
}

const tonePillBg: Record<Tone, string> = {
  accent: 'bg-accent-soft',
  lab: 'bg-lab-soft',
  coral: 'bg-pop-coral-soft',
  yellow: 'bg-pop-yellow-soft',
}

const tabs = [
  { to: '/', label: '홈', icon: HomeIcon, tone: 'accent' as Tone },
  { to: '/history', label: '기록', icon: HistoryIcon, tone: 'lab' as Tone },
] as const

const tabsAfterScan = [
  { to: '/care', label: '케어', icon: CareIcon, tone: 'coral' as Tone },
  { to: '/profile', label: '마이', icon: MyIcon, tone: 'yellow' as Tone },
] as const

/** Center-SCAN emphasized 5-element layout: HOME / HISTORY / [SCAN] / CARE / MY. */
export function BottomNav() {
  return (
    <nav
      aria-label="주요 메뉴"
      className="sticky bottom-0 z-20 border-t border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 items-end px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5">
        {tabs.map((tab) => (
          <NavTab key={tab.to} {...tab} />
        ))}

        <div className="flex justify-center">
          <NavLink
            to="/capture"
            aria-label="측정 시작"
            className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-ink shadow-elevated transition-transform hover:scale-105 hover:brightness-105 active:scale-95"
          >
            <ScanIcon width={26} height={26} />
          </NavLink>
        </div>

        {tabsAfterScan.map((tab) => (
          <NavTab key={tab.to} {...tab} />
        ))}
      </div>
    </nav>
  )
}

function NavTab({
  to,
  label,
  icon: Icon,
  tone,
}: {
  to: string
  label: string
  icon: typeof HomeIcon
  tone: Tone
}) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className="group flex flex-col items-center gap-1 py-1.5 text-[11px] font-semibold transition-colors"
    >
      {({ isActive }) => (
        <>
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-2xl transition-colors ${
              isActive ? tonePillBg[tone] : 'group-hover:bg-surface-2'
            }`}
          >
            <Icon
              width={19}
              height={19}
              className={`transition-colors ${isActive ? toneActiveText[tone] : 'text-ink-soft group-hover:text-ink'}`}
            />
          </span>
          <span className={`transition-colors ${isActive ? 'text-ink' : 'text-ink-soft group-hover:text-ink'}`}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  )
}
