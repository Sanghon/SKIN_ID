import { useState, type ComponentType, type SVGProps } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, PhotoAdjustSheet, Pill, ScoreRing, WeatherWidget } from '../components'
import userFacePhoto from '../assets/user-face-photo.png'
import {
  ArrowRightIcon,
  BellIcon,
  CameraIcon,
  ChevronRightIcon,
  HistoryIcon,
  ScanIcon,
  SparkleIcon,
} from '../components/icons'
import { useHeroPhoto } from '../lib/heroPhoto'
import { buildSkinInsight, getOilScoreTone, getSkinTypeLabel } from '../lib/skinAdvice'
import { getUpcomingWeather, mockLatestMeasurement, mockStreak, SKIN_CHARACTERS } from '../services/data'

function isToday(iso: string): boolean {
  const d = new Date(iso)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

interface MenuRow {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  subtitle: string
  to: string
  swatch: string
}

export function HomePage() {
  const { result, capturedAt } = mockLatestMeasurement
  const character = SKIN_CHARACTERS[result.skinCharacter]
  const measuredToday = isToday(capturedAt)
  const measuredDate = new Date(capturedAt).toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })

  const today = getUpcomingWeather(1)[0]
  const insight = buildSkinInsight(result.oilScore, today.humidity, today.tempHigh)
  const { photo: heroPhoto, pickRaw: pickHeroPhotoRaw, commit: commitHeroPhoto } = useHeroPhoto(userFacePhoto)
  const [adjustingPhotoUrl, setAdjustingPhotoUrl] = useState<string | null>(null)

  async function handlePickHeroPhoto() {
    const rawUrl = await pickHeroPhotoRaw()
    if (rawUrl) setAdjustingPhotoUrl(rawUrl)
  }

  function handleCancelAdjust() {
    if (adjustingPhotoUrl) URL.revokeObjectURL(adjustingPhotoUrl)
    setAdjustingPhotoUrl(null)
  }

  function handleConfirmAdjust(dataUrl: string) {
    commitHeroPhoto(dataUrl)
    handleCancelAdjust()
  }

  const menuRows: MenuRow[] = [
    {
      icon: ScanIcon,
      title: '기름종이 가이드',
      subtitle: '5개 부위 사용법을 확인해요',
      to: '/guide',
      swatch: 'bg-lab-soft',
    },
    {
      icon: HistoryIcon,
      title: '사용 기록',
      subtitle: '이전 기록과 변화를 살펴봐요',
      to: '/history',
      swatch: 'bg-accent-soft',
    },
    {
      icon: SparkleIcon,
      title: '피부 팁',
      subtitle: '유분 관리에 도움되는 팁을 읽어요',
      to: '/care',
      swatch: 'bg-pop-coral-soft',
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-start justify-between pt-1">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">Today&apos;s Skin</p>
          <h1 className="mt-1 text-[28px] font-bold leading-tight text-ink">오늘의 피부 컨디션</h1>
          <p className="mt-1.5 text-sm text-ink-soft">
            {measuredDate} · {today.tempHigh}° · {today.season}
          </p>
        </div>
        <button type="button" aria-label="알림" className="mt-1 shrink-0 text-ink-soft">
          <BellIcon width={22} height={22} />
        </button>
      </header>

      <Card elevated className="flex flex-col gap-0 overflow-hidden p-0">
        <div className="relative h-72 w-full bg-white">
          <img src={heroPhoto} alt="내 피부 대표 사진" className="h-full w-full rounded-t-[23px] object-cover" />
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/25 to-transparent" />
          <button
            type="button"
            onClick={() => void handlePickHeroPhoto()}
            aria-label="대표 이미지 변경"
            className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-all active:scale-95"
          >
            <CameraIcon width={17} height={17} />
          </button>
        </div>
        <div className="flex items-center gap-4 p-5">
          <ScoreRing
            score={result.oilScore}
            tone={getOilScoreTone(result.oilScore)}
            label={getSkinTypeLabel(result.skinType)}
          />
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Pill tone="lab">{character.name}</Pill>
              <Pill tone="accent">{mockStreak.currentStreak}일 연속</Pill>
            </div>
            <p className="text-sm leading-snug text-ink">{insight}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 px-5 text-sm">
          <div className="rounded-xl bg-surface-2 px-3 py-2">
            <p className="text-ink-faint">T존</p>
            <p className="font-medium text-ink tabular-nums">{result.tZoneScore}</p>
          </div>
          <div className="rounded-xl bg-surface-2 px-3 py-2">
            <p className="text-ink-faint">U존</p>
            <p className="font-medium text-ink tabular-nums">{result.uZoneScore}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 p-5">
          <Link to="/guide">
            <Button className="w-full">
              피부 체크 시작하기
              <ArrowRightIcon width={16} height={16} />
            </Button>
          </Link>
          {!measuredToday && (
            <p className="text-center text-xs text-ink-faint">아직 오늘 측정 기록이 없어요</p>
          )}
        </div>
      </Card>

      <WeatherWidget />

      <div className="flex flex-col gap-3">
        {menuRows.map((row) => {
          const Icon = row.icon
          return (
            <Link key={row.to} to={row.to}>
              <Card className="flex items-center gap-3">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${row.swatch}`}>
                  <Icon width={19} height={19} className="text-ink" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink">{row.title}</p>
                  <p className="text-xs text-ink-faint">{row.subtitle}</p>
                </div>
                <ChevronRightIcon width={18} height={18} className="shrink-0 text-ink-faint" />
              </Card>
            </Link>
          )
        })}
      </div>

      {adjustingPhotoUrl && (
        <PhotoAdjustSheet
          imageUrl={adjustingPhotoUrl}
          onCancel={handleCancelAdjust}
          onConfirm={handleConfirmAdjust}
        />
      )}
    </div>
  )
}
