import { Link, useLocation, useParams } from 'react-router-dom'
import { Button, Card, FacePhotoDiagram, Pill } from '../components'
import { ArrowRightIcon, CareIcon } from '../components/icons'
import guidePhoto from '../assets/oil-paper-guide.jpg'
import { getOilScoreColorVar, getOilScoreTone, TONE_VAR } from '../lib/skinAdvice'
import type { AdviceTone } from '../lib/skinAdvice'
import { mockMeasurements, SKIN_CHARACTERS } from '../services/data'
import type { Measurement } from '../types/measurement'
import type { FaceZone } from '../types/skin'

const ZONE_STATUS_LABEL: Record<AdviceTone, string> = {
  lab: '낮음',
  accent: '보통',
  yellow: '높음',
  coral: '매우 높음',
}

const T_ZONE = new Set<FaceZone>(['이마', '코'])

function useResolvedMeasurement(): Measurement {
  const location = useLocation()
  const { id } = useParams()
  const stateMeasurement = location.state as Measurement | null
  if (stateMeasurement) return stateMeasurement
  return mockMeasurements.find((m) => m.id === id) ?? mockMeasurements[mockMeasurements.length - 1]
}

function buildHeadline(tZoneScore: number, uZoneScore: number): { title: string; subtitle: string } {
  const diff = tZoneScore - uZoneScore
  if (diff >= 8) {
    return { title: 'T존 유분이 조금 높아요', subtitle: '이마와 코의 유분이 조금 높게 나타났어요.' }
  }
  if (diff <= -8) {
    return { title: '볼과 턱이 조금 건조해요', subtitle: '양볼과 턱의 수분 밸런스를 챙겨보세요.' }
  }
  return { title: '오늘은 균형 잡힌 피부예요', subtitle: '부위별 유분 편차가 크지 않아요.' }
}

export function ResultPage() {
  const measurement = useResolvedMeasurement()
  const { result } = measurement
  const character = SKIN_CHARACTERS[result.skinCharacter]
  const headline = buildHeadline(result.tZoneScore, result.uZoneScore)

  const cheekAvg = Math.round(
    (result.zoneScores.find((z) => z.zone === '왼쪽볼')!.score +
      result.zoneScores.find((z) => z.zone === '오른쪽볼')!.score) /
      2,
  )
  const gridZones: { label: string; score: number }[] = [
    { label: '이마', score: result.zoneScores.find((z) => z.zone === '이마')!.score },
    { label: '코', score: result.zoneScores.find((z) => z.zone === '코')!.score },
    { label: '양볼', score: cheekAvg },
    { label: '턱', score: result.zoneScores.find((z) => z.zone === '턱')!.score },
  ]

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">Skin Check Result</p>
        <h1 className="mt-1 text-lg font-semibold text-ink">피부 체크 결과</h1>
      </header>

      <Card elevated className="flex flex-col gap-4">
        <div className="flex items-start gap-2.5">
          <span
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: TONE_VAR[getOilScoreTone(result.oilScore)] }}
          >
            <CareIcon width={15} height={15} className="text-surface" />
          </span>
          <div>
            <h2 className="text-xl font-bold leading-snug text-ink">{headline.title}</h2>
            <p className="mt-1 text-sm text-ink-soft">{headline.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <FacePhotoDiagram
            photoSrc={guidePhoto}
            markers={result.zoneScores.map((zone) => ({
              zone: zone.zone,
              color: getOilScoreColorVar(zone.score),
              radius: T_ZONE.has(zone.zone) ? 10 : 7,
            }))}
          />
          <div className="flex items-center gap-2">
            <Pill tone="lab">{character.name}</Pill>
            <Pill tone="neutral">{result.skinType}</Pill>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {gridZones.map((zone) => {
            const tone = getOilScoreTone(zone.score)
            return (
              <div key={zone.label} className="flex items-center justify-between rounded-xl bg-surface-2 px-3.5 py-2.5">
                <span className="text-sm text-ink">{zone.label}</span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-ink">
                  {ZONE_STATUS_LABEL[tone]}
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: TONE_VAR[tone] }} />
                </span>
              </div>
            )
          })}
        </div>
      </Card>

      <Card>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">ROI Optical Analysis</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-surface-2 px-2 py-3">
            <p className="text-xl font-bold tabular-nums text-ink">{result.oilCoverage}%</p>
            <p className="mt-1 text-[11px] text-ink-faint">Oil Area</p>
          </div>
          <div className="rounded-xl bg-surface-2 px-2 py-3">
            <p className="text-xl font-bold tabular-nums text-ink">{result.oilIntensity}</p>
            <p className="mt-1 text-[11px] text-ink-faint">Intensity</p>
          </div>
          <div className="rounded-xl bg-surface-2 px-2 py-3">
            <p className="text-xl font-bold tabular-nums text-ink">{result.spotDensity ?? 0}</p>
            <p className="mt-1 text-[11px] text-ink-faint">Spot Density</p>
          </div>
        </div>
        <p className="mt-2 text-center text-[10px] text-ink-faint">Spot Density: ROI 100% 면적당 검출 스팟 수</p>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Link to={`/result/${measurement.id}/zones`} state={measurement}>
          <Button variant="secondary" className="w-full">
            부위별 분석
          </Button>
        </Link>
        <Link to={`/result/${measurement.id}/share`} state={measurement}>
          <Button variant="secondary" className="w-full">
            공유하기
          </Button>
        </Link>
      </div>

      <Link to="/care">
        <Button className="w-full">
          맞춤 가이드 보기
          <ArrowRightIcon width={16} height={16} />
        </Button>
      </Link>
    </div>
  )
}
