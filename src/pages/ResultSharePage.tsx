import { Link, useLocation, useParams } from 'react-router-dom'
import { Card } from '../components'
import { mockMeasurements, SKIN_CHARACTERS } from '../services/data'
import type { Measurement } from '../types/measurement'

export function ResultSharePage() {
  const location = useLocation()
  const { id } = useParams()
  const measurement =
    (location.state as Measurement | null) ??
    mockMeasurements.find((m) => m.id === id) ??
    mockMeasurements[mockMeasurements.length - 1]
  const character = SKIN_CHARACTERS[measurement.result.skinCharacter]

  return (
    <div className="flex flex-col gap-4">
      <header>
        <Link to={`/result/${measurement.id}`} state={measurement} className="text-sm text-ink-soft">
          ← 결과로 돌아가기
        </Link>
        <h1 className="mt-2 text-lg font-semibold text-ink">공유 카드</h1>
      </header>

      <Card elevated className="flex flex-col items-center gap-2 py-10 text-center">
        <p className="text-sm text-ink-soft">{character.nameEn}</p>
        <p className="text-6xl font-semibold tabular-nums text-ink">{measurement.result.oilScore}</p>
        <p className="text-sm text-ink-faint">{character.name} · {measurement.result.skinType}</p>
      </Card>

      <p className="text-center text-xs text-ink-faint">
        SNS 공유 카드 이미지 내보내기는 Phase 5(Engagement)에서 구현될 예정이에요.
      </p>
    </div>
  )
}
