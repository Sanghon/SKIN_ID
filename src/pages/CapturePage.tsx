import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card } from '../components'
import { ChevronLeftIcon, GalleryIcon, LockIcon, RefreshIcon, ScanIcon, SparkleIcon } from '../components/icons'
import { useGuidelineImages } from '../lib/guidelineImages'
import { cameraProvider } from '../services/camera'
import { FACE_ZONES } from '../types/measurement'

interface Captured {
  imageUrl: string
  capturedAt: string
}

interface ZoneCapture extends Captured {
  zone: (typeof FACE_ZONES)[number]
}

export function CapturePage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [zoneCaptures, setZoneCaptures] = useState<ZoneCapture[]>([])
  const [preview, setPreview] = useState<Captured | null>(null)
  const [showTips, setShowTips] = useState(false)
  const [expandedTip, setExpandedTip] = useState<string | null>(null)
  const { images: tipImages } = useGuidelineImages()

  const stepIndex = zoneCaptures.length
  const currentZone = FACE_ZONES[stepIndex]
  const isLastZone = stepIndex === FACE_ZONES.length - 1

  async function handleCapture() {
    setError(null)
    setIsCapturing(true)
    try {
      const { imageUrl, capturedAt } = await cameraProvider.capture()
      setPreview({ imageUrl, capturedAt })
    } catch {
      setError('촬영이 취소됐어요. 다시 시도해주세요.')
    } finally {
      setIsCapturing(false)
    }
  }

  function handleConfirmZone() {
    if (!preview || !currentZone) return
    const next = [...zoneCaptures, { ...preview, zone: currentZone }]
    setPreview(null)
    if (next.length === FACE_ZONES.length) {
      const rep = next.find((z) => z.zone === '이마') ?? next[0]
      navigate('/analyzing', { state: { imageUrl: rep.imageUrl, capturedAt: rep.capturedAt } })
      return
    }
    setZoneCaptures(next)
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <header className="flex items-center justify-between">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로 가기" className="text-ink">
          <ChevronLeftIcon width={22} height={22} />
        </button>
        <button
          type="button"
          onClick={() => setShowTips((v) => !v)}
          className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            showTips ? 'bg-accent text-accent-ink' : 'bg-surface-2 text-ink-soft'
          }`}
        >
          <SparkleIcon width={14} height={14} />
          사용팁
        </button>
      </header>

      <div className="flex items-center justify-center gap-2">
        {FACE_ZONES.map((zone, i) => (
          <div
            key={zone}
            className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold transition-colors ${
              i < stepIndex
                ? 'bg-accent text-accent-ink'
                : i === stepIndex
                  ? 'border-2 border-accent text-ink'
                  : 'bg-surface-2 text-ink-faint'
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
          {stepIndex + 1} / {FACE_ZONES.length} · {currentZone}
        </p>
        <h1 className="mt-1 text-2xl font-bold leading-tight text-ink">
          {preview ? '이 사진으로 진행할까요?' : '기름종이를 프레임에 맞춰주세요'}
        </h1>
        <p className="mt-1.5 text-sm text-ink-soft">
          {preview
            ? '기름종이 전체와 번짐이 선명하게 보이는지 확인해주세요.'
            : `밝은 곳에서 ${currentZone} 부위의 기름종이 전체가 보이도록 찍어주세요.`}
        </p>
      </div>

      <Card className="relative flex flex-1 items-center justify-center overflow-hidden bg-white p-0">
        {preview ? (
          <img src={preview.imageUrl} alt={`촬영한 ${currentZone} 기름종이`} className="h-full max-h-96 w-full object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-[40%] border-[3px] border-line px-10 py-16">
            <ScanIcon width={40} height={40} className="text-ink-faint" strokeWidth={1.4} />
            <p className="text-sm text-ink-faint">{currentZone} 사진을 촬영하거나 업로드해주세요</p>
          </div>
        )}
      </Card>

      {showTips && (
        <Card className="flex flex-col gap-2">
          {tipImages.length > 0 ? (
            <div className="flex snap-x gap-2 overflow-x-auto pb-1">
              {tipImages.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setExpandedTip(src)}
                  aria-label={`사용팁 ${i + 1} 크게 보기`}
                  className="shrink-0 snap-center"
                >
                  <img src={src} alt={`사용팁 ${i + 1}`} className="h-40 w-40 rounded-2xl object-cover" />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-faint">등록된 사용팁 이미지가 아직 없어요.</p>
          )}
        </Card>
      )}

      {expandedTip && (
        <button
          type="button"
          onClick={() => setExpandedTip(null)}
          aria-label="확대 이미지 닫기"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
        >
          <img src={expandedTip} alt="사용팁 확대 이미지" className="max-h-full max-w-full rounded-2xl object-contain" />
        </button>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      {preview ? (
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={() => setPreview(null)}>
            <RefreshIcon width={17} height={17} />
            다시 촬영
          </Button>
          <Button onClick={handleConfirmZone}>{isLastZone ? '분석 시작' : '다음 부위'}</Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center gap-8">
            <button
              type="button"
              onClick={handleCapture}
              disabled={isCapturing}
              aria-label="갤러리에서 선택"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-2 text-ink-soft transition-all active:scale-95 disabled:opacity-50"
            >
              <GalleryIcon width={20} height={20} />
            </button>
            <button
              type="button"
              onClick={handleCapture}
              disabled={isCapturing}
              aria-label="촬영"
              className="flex h-16 w-16 items-center justify-center rounded-full bg-ink shadow-elevated transition-all active:scale-95 disabled:opacity-50"
            >
              <span className="h-12 w-12 rounded-full border-2 border-paper" />
            </button>
            <button
              type="button"
              disabled
              aria-label="다시 시도"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-2 text-ink-faint opacity-50"
            >
              <RefreshIcon width={20} height={20} />
            </button>
          </div>
          <p className="flex items-center justify-center gap-1.5 text-xs text-ink-faint">
            <LockIcon width={14} height={14} />
            {isCapturing ? '불러오는 중…' : '사진은 안전하게 처리돼요'}
          </p>
        </>
      )}
    </div>
  )
}
