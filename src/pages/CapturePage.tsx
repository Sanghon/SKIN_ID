import { useRef, useState, type PointerEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card } from '../components'
import { ChevronLeftIcon, GalleryIcon, LockIcon, RefreshIcon, ScanIcon } from '../components/icons'
import { cameraProvider } from '../services/camera'
import type { NormalizedRoi } from '../types/measurement'

interface Captured { imageUrl: string; capturedAt: string }
const DEFAULT_ROI: NormalizedRoi = { x: 0.15, y: 0.18, width: 0.7, height: 0.64 }

export function CapturePage() {
  const navigate = useNavigate()
  const imageBoxRef = useRef<HTMLDivElement>(null)
  const dragStart = useRef<{ x: number; y: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [preview, setPreview] = useState<Captured | null>(null)
  const [roi, setRoi] = useState<NormalizedRoi>(DEFAULT_ROI)

  async function handleCapture() {
    setError(null); setIsCapturing(true)
    try { setPreview(await cameraProvider.capture()); setRoi(DEFAULT_ROI) }
    catch { setError('촬영이 취소됐어요. 다시 시도해주세요.') }
    finally { setIsCapturing(false) }
  }

  function point(event: PointerEvent<HTMLDivElement>) {
    const box = imageBoxRef.current!.getBoundingClientRect()
    return { x: Math.min(1, Math.max(0, (event.clientX - box.left) / box.width)), y: Math.min(1, Math.max(0, (event.clientY - box.top) / box.height)) }
  }
  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId); dragStart.current = point(event)
    setRoi({ ...dragStart.current, width: 0.01, height: 0.01 })
  }
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragStart.current) return
    const current = point(event); const x = Math.min(dragStart.current.x, current.x); const y = Math.min(dragStart.current.y, current.y)
    setRoi({ x, y, width: Math.max(0.01, Math.abs(current.x - dragStart.current.x)), height: Math.max(0.01, Math.abs(current.y - dragStart.current.y)) })
  }
  function handlePointerUp() { dragStart.current = null }
  function handleAnalyze() {
    if (!preview) return
    if (roi.width * roi.height < 0.04) { setError('분석 영역을 조금 더 크게 지정해주세요.'); return }
    navigate('/analyzing', { state: { ...preview, roi } })
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <header><button type="button" onClick={() => navigate(-1)} aria-label="뒤로 가기" className="text-ink"><ChevronLeftIcon width={22} height={22} /></button></header>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">Photo & ROI</p>
        <h1 className="mt-1 text-2xl font-bold leading-tight text-ink">{preview ? '분석할 기름종이 영역을 지정하세요' : '기름종이 사진을 촬영해주세요'}</h1>
        <p className="mt-1.5 text-sm text-ink-soft">{preview ? '사진 위를 드래그해 ROI를 다시 지정할 수 있어요.' : '밝고 그림자가 적은 곳에서 기름종이 전체가 보이게 촬영해주세요.'}</p>
      </div>
      <Card className="relative flex flex-1 items-center justify-center overflow-hidden bg-white p-0">
        {preview ? (
          <div ref={imageBoxRef} className="relative max-h-96 max-w-full touch-none select-none" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
            <img src={preview.imageUrl} alt="촬영한 기름종이" className="block max-h-96 max-w-full object-contain" draggable={false} />
            <div className="pointer-events-none absolute border-2 border-accent bg-accent/15 shadow-[0_0_0_999px_rgba(0,0,0,0.3)]" style={{ left: `${roi.x * 100}%`, top: `${roi.y * 100}%`, width: `${roi.width * 100}%`, height: `${roi.height * 100}%` }}>
              <span className="absolute left-1 top-1 rounded bg-ink/75 px-1.5 py-0.5 text-[10px] font-semibold text-white">ROI</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-[40%] border-[3px] border-line px-10 py-16"><ScanIcon width={40} height={40} className="text-ink-faint" strokeWidth={1.4} /><p className="text-center text-sm text-ink-faint">사진을 촬영하거나 업로드해주세요</p></div>
        )}
      </Card>
      {error && <p className="text-sm text-danger">{error}</p>}
      {preview ? (
        <div className="grid grid-cols-2 gap-3"><Button variant="secondary" onClick={() => setPreview(null)}><RefreshIcon width={17} height={17} /> 다시 촬영</Button><Button onClick={handleAnalyze}>ROI 분석 시작</Button></div>
      ) : (
        <><div className="flex items-center justify-center gap-8"><button type="button" onClick={handleCapture} disabled={isCapturing} aria-label="사진 업로드" className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-2 text-ink-soft active:scale-95 disabled:opacity-50"><GalleryIcon width={20} height={20} /></button><button type="button" onClick={handleCapture} disabled={isCapturing} aria-label="촬영" className="flex h-16 w-16 items-center justify-center rounded-full bg-ink shadow-elevated active:scale-95 disabled:opacity-50"><span className="h-12 w-12 rounded-full border-2 border-paper" /></button><span className="h-11 w-11" /></div><p className="flex items-center justify-center gap-1.5 text-xs text-ink-faint"><LockIcon width={14} height={14} /> {isCapturing ? '불러오는 중…' : '분석은 브라우저 안에서 처리돼요'}</p></>
      )}
    </div>
  )
}
