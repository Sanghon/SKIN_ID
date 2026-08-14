import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Card, FaceDiagram, FacePhotoDiagram, Pill, ScoreLegend } from '../components'
import userFacePhoto from '../assets/user-face-photo.png'
import { useFacePhoto } from '../lib/facePhoto'
import { getOilScoreColorVar } from '../lib/skinAdvice'
import { mockMeasurements } from '../services/data'
import type { Measurement } from '../types/measurement'
import type { ZoneScore } from '../types/skin'

const T_ZONE = new Set(['이마', '코'])

function ZoneRow({ zone }: { zone: ZoneScore }) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="font-medium text-ink">{zone.zone}</p>
        <span className="text-2xl font-semibold tabular-nums text-ink">{zone.score}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full"
          style={{ width: `${zone.score}%`, backgroundColor: getOilScoreColorVar(zone.score) }}
        />
      </div>
      <p className="text-xs text-ink-faint">
        Coverage {zone.oilCoverage} · Intensity {zone.oilIntensity}
      </p>
    </Card>
  )
}

export function ResultZonesPage() {
  const location = useLocation()
  const { id } = useParams()
  const measurement =
    (location.state as Measurement | null) ??
    mockMeasurements.find((m) => m.id === id) ??
    mockMeasurements[mockMeasurements.length - 1]

  const tZones = measurement.result.zoneScores.filter((z) => T_ZONE.has(z.zone))
  const uZones = measurement.result.zoneScores.filter((z) => !T_ZONE.has(z.zone))

  const { photo, pick, reset, isCustom } = useFacePhoto(measurement.imageUrl || userFacePhoto)
  const [showIllustration, setShowIllustration] = useState(false)

  const zoneMarkers = measurement.result.zoneScores.map((zone) => ({
    zone: zone.zone,
    color: getOilScoreColorVar(zone.score),
    label: zone.score,
  }))

  return (
    <div className="flex flex-col gap-4">
      <header>
        <Link to={`/result/${measurement.id}`} state={measurement} className="text-sm text-ink-soft">
          ← 결과로 돌아가기
        </Link>
        <h1 className="mt-2 text-lg font-semibold text-ink">부위별 분석</h1>
      </header>

      <Card className="flex flex-col items-center gap-2 bg-white">
        {showIllustration ? (
          <FaceDiagram markers={zoneMarkers} />
        ) : (
          <FacePhotoDiagram markers={zoneMarkers} photoSrc={photo} />
        )}
        <p className="text-xs text-ink-faint">부위 원의 색과 숫자는 해당 부위의 피지 점수예요</p>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => void pick()}
            className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-medium text-ink"
          >
            내 사진 선택하기
          </button>
          {isCustom && (
            <button
              type="button"
              onClick={reset}
              className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-medium text-ink-soft"
            >
              기본 사진으로
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowIllustration((v) => !v)}
            className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-medium text-ink-soft"
          >
            {showIllustration ? '사진으로 보기' : '일러스트로 보기'}
          </button>
        </div>
      </Card>

      <Card className="flex flex-col gap-2">
        <p className="text-sm font-medium text-ink">색상이 뜻하는 범위</p>
        <ScoreLegend variant="detailed" />
      </Card>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Pill tone="lab">T존</Pill>
          <span className="text-xs text-ink-faint">이마 · 코 — 평균 {measurement.result.tZoneScore}</span>
        </div>
        <div className="flex flex-col gap-3">
          {tZones.map((zone) => (
            <ZoneRow key={zone.zone} zone={zone} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Pill tone="lab">U존</Pill>
          <span className="text-xs text-ink-faint">
            왼쪽볼 · 오른쪽볼 · 턱 — 평균 {measurement.result.uZoneScore}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {uZones.map((zone) => (
            <ZoneRow key={zone.zone} zone={zone} />
          ))}
        </div>
      </section>
    </div>
  )
}
