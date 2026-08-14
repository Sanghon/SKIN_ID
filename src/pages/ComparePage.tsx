import { Link } from 'react-router-dom'
import { Card } from '../components'
import { mockCurrentUser, mockFriends, mockLatestMeasurement } from '../services/data'

export function ComparePage() {
  const all = [
    { friendId: mockCurrentUser.id, nickname: `${mockCurrentUser.nickname} (나)`, oilScore: mockLatestMeasurement.result.oilScore },
    ...mockFriends.map((f) => ({ friendId: f.friendId, nickname: f.nickname, oilScore: f.oilScore })),
  ].sort((a, b) => a.oilScore - b.oilScore)

  return (
    <div className="flex flex-col gap-4">
      <Link to="/profile" className="text-sm text-ink-soft">
        ← 마이페이지로
      </Link>
      <h1 className="text-lg font-semibold text-ink">친구 비교</h1>

      <div className="flex flex-col gap-2">
        {all.map((f, i) => (
          <Card
            key={f.friendId}
            className={`flex items-center justify-between ${f.friendId === mockCurrentUser.id ? 'border-accent' : ''}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs text-ink-faint tabular-nums">{i + 1}</span>
              <span className="text-sm font-medium text-ink">{f.nickname}</span>
            </div>
            <span className="text-sm tabular-nums text-ink-soft">{f.oilScore}</span>
          </Card>
        ))}
      </div>
    </div>
  )
}
