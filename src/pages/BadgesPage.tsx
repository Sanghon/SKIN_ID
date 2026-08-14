import { Link } from 'react-router-dom'
import { Card, Pill } from '../components'
import { mockBadges, mockUserBadges } from '../services/data'

export function BadgesPage() {
  const earnedIds = new Set(mockUserBadges.map((b) => b.badgeId))

  return (
    <div className="flex flex-col gap-4">
      <Link to="/profile" className="text-sm text-ink-soft">
        ← 마이페이지로
      </Link>
      <h1 className="text-lg font-semibold text-ink">뱃지</h1>

      <div className="flex flex-col gap-2">
        {mockBadges.map((badge) => {
          const earned = earnedIds.has(badge.id)
          return (
            <Card key={badge.id} className={`flex items-center justify-between ${earned ? '' : 'opacity-50'}`}>
              <div>
                <p className="text-sm font-medium text-ink">{badge.name}</p>
                <p className="text-xs text-ink-faint">{badge.description}</p>
              </div>
              {earned && <Pill tone="accent">획득</Pill>}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
