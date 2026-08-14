import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, Pill } from '../components'
import {
  BookmarkIcon,
  CareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  HumidityIcon,
  ScanIcon,
  ShareIcon,
  SparkleIcon,
  SunnyIcon,
} from '../components/icons'
import { useProductStore } from '../lib/productStore'
import { showToast } from '../lib/toast'
import { useWishlist } from '../lib/wishlist'
import { mockLatestMeasurement } from '../services/data'
import type { CareStep } from '../types/product'

const STEP_LABELS: Record<CareStep, string> = {
  cleansing: 'STEP 1 · 클렌징',
  hydration: 'STEP 2 · 수분',
  'oil-control': 'STEP 3 · 피지 케어',
  'sun-care': 'STEP 4 · 선 케어',
}

const STEP_TAGS: Record<CareStep, string> = {
  cleansing: '이마·코 추천',
  hydration: '양볼·턱 추천',
  'oil-control': '이마·코 추천',
  'sun-care': '얼굴 전체 추천',
}

const STEP_SWATCH: Record<CareStep, string> = {
  cleansing: 'bg-surface-2',
  hydration: 'bg-accent-soft',
  'oil-control': 'bg-lab-soft',
  'sun-care': 'bg-pop-coral-soft',
}

const STEP_ICON: Record<CareStep, typeof CareIcon> = {
  cleansing: CareIcon,
  hydration: HumidityIcon,
  'oil-control': ScanIcon,
  'sun-care': SunnyIcon,
}

const STEP_ORDER: CareStep[] = ['cleansing', 'hydration', 'oil-control', 'sun-care']

export function CarePage() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [showWhy, setShowWhy] = useState(false)
  const { products } = useProductStore()
  const { isWishlisted, toggle: toggleWishlist } = useWishlist()

  function handleWishlistToggle(productId: string) {
    const wasWishlisted = isWishlisted(productId)
    toggleWishlist(productId)
    if (!wasWishlisted) showToast('장바구니에 추가되었습니다')
  }

  const { tZoneScore, uZoneScore } = mockLatestMeasurement.result
  const fitScore = products.length
    ? Math.round(products.reduce((sum, p) => sum + p.matchScore, 0) / products.length)
    : 0
  const topPick = [...products].sort((a, b) => b.matchScore - a.matchScore)[0]
  const routineProducts = STEP_ORDER.map((step) => products.find((p) => p.step === step)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  )

  const whyReasons = [
    tZoneScore >= 60
      ? `T존 유분 점수가 ${tZoneScore}점으로 높아, 무거운 크림 대신 가벼운 젤·로션 제형의 피지 케어를 우선했어요.`
      : `T존 유분 점수가 ${tZoneScore}점으로 안정적이라, 자극이 적은 순한 클렌징 위주로 구성했어요.`,
    uZoneScore < 40
      ? `U존 수분 점수가 ${uZoneScore}점으로 낮아, 볼·턱에는 보습력이 높은 제품을 배치해 수분 밸런스를 채웠어요.`
      : `U존 수분 점수가 ${uZoneScore}점으로 양호해, 과도한 보습보다 유수분 밸런스를 유지하는 데 초점을 맞췄어요.`,
    '자외선 차단은 유·수분 상태와 무관하게 얼굴 전체에 매일 필요해 마지막 단계에 항상 포함했어요.',
  ]

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-center justify-between">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로 가기" className="text-ink">
          <ChevronLeftIcon width={22} height={22} />
        </button>
        <div className="flex items-center gap-3 text-ink-soft">
          <BookmarkIcon width={19} height={19} />
          <ShareIcon width={19} height={19} />
        </div>
      </header>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">Your Personal Routine</p>
        <h1 className="mt-1 text-[30px] font-bold leading-tight text-ink">오늘 피부에 딱 맞는 4-Step 케어</h1>
        <p className="mt-1.5 text-[15px] text-ink-soft">
          T존 유분은 가볍게 정돈하고, U존은 편안하게 채워보세요.
        </p>
      </div>

      {routineProducts.length > 0 && (
        <Card elevated className="flex flex-col gap-0 overflow-hidden p-0">
          <div className="relative">
            <div className="grid grid-cols-2 gap-0.5 bg-line">
              {routineProducts.slice(0, 4).map((p) => (
                <div key={p.id} className="aspect-square overflow-hidden bg-white">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-surface-2 text-[10px] text-ink-faint">
                      {p.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 top-0 flex flex-wrap items-start gap-1.5 p-4">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                <CareIcon width={12} height={12} />
                T존 유분 {tZoneScore >= 60 ? '높음' : '보통'}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                <HumidityIcon width={12} height={12} />
                U존 {uZoneScore < 40 ? '수분 부족' : '밸런스 양호'}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">루틴 적합도</p>
              <p className="font-display text-5xl font-semibold leading-tight tabular-nums text-white">
                {fitScore}
                <span className="text-xl align-top text-white/80">%</span>
              </p>
            </div>
          </div>
          <div className="flex items-start justify-between gap-3 border-t border-line/60 px-4 py-4">
            <div className="min-w-0">
              <Pill tone="accent" className="w-fit">
                1순위 추천 조합
              </Pill>
              <p className="mt-1.5 font-medium text-ink">오늘의 맞춤 케어 팩</p>
              <p className="mt-0.5 text-xs text-ink-faint">
                {routineProducts.map((p) => p.name).join(' · ')}
              </p>
              <p className="mt-1 text-[11px] text-ink-faint">패키지 구매 시 추가 할인 혜택은 준비 중이에요.</p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        <div>
          <p className="text-[15px] font-semibold text-ink">당신을 위한 맞춤 루틴</p>
          <p className="text-xs text-ink-faint">오늘의 피부 측정 결과를 바탕으로 골랐어요.</p>
        </div>

        {STEP_ORDER.map((step) => {
          const product = products.find((p) => p.step === step)
          if (!product) return null
          const Icon = STEP_ICON[step]
          const wishlisted = isWishlisted(product.id)
          return (
            <div key={step} className="relative">
              <Link to={`/care/${product.id}`}>
                <Card className="flex items-stretch gap-0 overflow-hidden p-0">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-28 shrink-0 self-stretch object-cover"
                    />
                  ) : (
                    <span className={`flex w-28 shrink-0 items-center justify-center ${STEP_SWATCH[step]}`}>
                      <Icon width={24} height={24} className="text-ink" />
                    </span>
                  )}
                  <div className="min-w-0 flex-1 p-3">
                    <div className="flex items-start justify-between gap-2 pr-7">
                      <p className="text-xs font-medium text-ink-faint">{STEP_LABELS[step]}</p>
                      <Pill tone="accent" className="shrink-0">
                        {product.matchScore}% 맞춤
                      </Pill>
                    </div>
                    <p className="mt-0.5 truncate font-medium text-ink">{product.name}</p>
                    <p className="text-xs text-ink-faint">{product.brand}</p>
                    <p className="mt-1 text-xs text-ink-soft">{product.reason}</p>
                    <Pill tone="neutral" className="mt-1.5">
                      {STEP_TAGS[step]}
                    </Pill>
                  </div>
                  <div className="flex shrink-0 items-center pr-3">
                    <ChevronRightIcon width={18} height={18} className="text-ink-faint" />
                  </div>
                </Card>
              </Link>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleWishlistToggle(product.id)
                }}
                aria-label={wishlisted ? '관심품목에서 빼기' : '관심품목에 담기'}
                className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full shadow-card transition-colors ${
                  wishlisted ? 'bg-pop-coral text-white' : 'bg-surface text-ink-faint'
                }`}
              >
                <HeartIcon width={14} height={14} filled={wishlisted} />
              </button>
            </div>
          )
        })}
      </div>

      <Card className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setShowWhy((v) => !v)}
          className="flex w-full items-center gap-3 text-left"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft">
            <SparkleIcon width={17} height={17} className="text-ink" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink">왜 이 루틴인가요?</p>
            <p className="mt-0.5 text-xs text-ink-soft">부위별 유분·수분 차이를 반영해 자극은 줄이고 밸런스를 맞췄어요.</p>
          </div>
          <ChevronRightIcon
            width={16}
            height={16}
            className={`shrink-0 text-ink-faint transition-transform ${showWhy ? 'rotate-90' : ''}`}
          />
        </button>
        {showWhy && (
          <ul className="flex flex-col gap-2 border-t border-line pt-3">
            {whyReasons.map((reason, i) => (
              <li key={i} className="flex gap-2 text-xs leading-relaxed text-ink-soft">
                <span className="mt-0.5 shrink-0 text-ink-faint">·</span>
                {reason}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <button
        type="button"
        onClick={() => setSaved((v) => !v)}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-5 text-[17px] font-semibold text-accent-ink shadow-elevated transition-all active:scale-95"
      >
        <BookmarkIcon width={17} height={17} />
        {saved ? '루틴 저장됨' : '내 루틴 저장하기'}
      </button>
      {topPick && (
        <Link to={`/care/${topPick.id}`} className="-mt-2 text-center text-xs text-ink-faint">
          제품 자세히 보기 →
        </Link>
      )}
    </div>
  )
}
