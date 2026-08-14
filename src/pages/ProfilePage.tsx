import { Link } from 'react-router-dom'
import { Card } from '../components'
import { mockCurrentUser, mockStreak, mockUserBadges } from '../services/data'

export function ProfilePage() {
  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center gap-3 pt-1">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-sm font-medium text-ink-soft">
          {mockCurrentUser.nickname.slice(0, 1)}
        </div>
        <div>
          <p className="font-medium text-ink">{mockCurrentUser.nickname}</p>
          <p className="text-xs text-ink-faint">{mockCurrentUser.skinTypeEstimate} 추정</p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <Card className="text-sm">
          <p className="text-ink-faint">현재 스트릭</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-ink">{mockStreak.currentStreak}일</p>
        </Card>
        <Card className="text-sm">
          <p className="text-ink-faint">최장 스트릭</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-ink">{mockStreak.longestStreak}일</p>
        </Card>
      </div>

      <Link to="/profile/badges">
        <Card className="flex items-center justify-between text-sm">
          <span className="font-medium text-ink">뱃지</span>
          <span className="text-ink-faint">{mockUserBadges.length}개 획득</span>
        </Card>
      </Link>

      <Link to="/compare">
        <Card className="flex items-center justify-between text-sm">
          <span className="font-medium text-ink">친구 비교</span>
          <span className="text-ink-faint">→</span>
        </Card>
      </Link>

      <Link to="/admin/theme">
        <Card className="flex items-center justify-between text-sm">
          <span className="font-medium text-ink">관리자 설정</span>
          <span className="text-ink-faint">테마 →</span>
        </Card>
      </Link>

      <Link to="/admin/care">
        <Card className="flex items-center justify-between text-sm">
          <span className="font-medium text-ink">관리자 설정</span>
          <span className="text-ink-faint">케어 제품 →</span>
        </Card>
      </Link>

      <Link to="/admin/guide">
        <Card className="flex items-center justify-between text-sm">
          <span className="font-medium text-ink">관리자 설정</span>
          <span className="text-ink-faint">촬영 사용팁 →</span>
        </Card>
      </Link>
    </div>
  )
}
