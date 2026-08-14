import { Link } from 'react-router-dom'
import { Card, Pill } from '../components'
import { BRAND_THEMES, useBrandTheme } from '../lib/theme'

export function AdminThemePage() {
  const [theme, setTheme] = useBrandTheme()

  return (
    <div className="flex flex-col gap-4">
      <header>
        <Link to="/profile" className="text-sm text-ink-soft">
          ← 마이로 돌아가기
        </Link>
        <h1 className="mt-2 text-lg font-semibold text-ink">관리자 설정</h1>
        <p className="mt-1 text-sm text-ink-faint">앱 전체에 적용할 컬러 테마를 선택하세요.</p>
      </header>

      <div className="flex flex-col gap-3">
        {BRAND_THEMES.map((preset) => {
          const active = preset.id === theme
          return (
            <button key={preset.id} type="button" onClick={() => setTheme(preset.id)} className="text-left">
              <Card
                elevated={active}
                className={`flex items-center gap-3 transition-colors ${active ? 'border-accent' : ''}`}
              >
                <div className="flex shrink-0 -space-x-2">
                  {preset.swatch.map((color, i) => (
                    <span
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-surface"
                      style={{ background: color }}
                    />
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink">{preset.name}</p>
                  <p className="text-xs text-ink-faint">{preset.description}</p>
                </div>
                {active && <Pill tone="accent">적용 중</Pill>}
              </Card>
            </button>
          )
        })}
      </div>

      <p className="text-xs text-ink-faint">
        선택한 테마는 이 브라우저에 저장되어 다음 접속에도 유지돼요. 색상 토큰만 바뀌며 화면 구성은 동일해요.
      </p>
    </div>
  )
}
