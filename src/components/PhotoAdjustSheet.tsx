import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { Button } from './Button'
import { CloseIcon } from './icons'

interface PhotoAdjustSheetProps {
  imageUrl: string
  onCancel: () => void
  onConfirm: (dataUrl: string) => void
}

const OUTPUT_WIDTH = 1000
const OUTPUT_HEIGHT = 800

/** Drag-to-pan + zoom crop tool. Lets the user choose what part of an uploaded photo shows
 * inside the fixed-aspect frame, so the frame stays fully filled without an arbitrary crop. */
export function PhotoAdjustSheet({ imageUrl, onCancel, onConfirm }: PhotoAdjustSheetProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null)

  function clampPan(nextPan: { x: number; y: number }, currentZoom: number) {
    const box = boxRef.current
    if (!box || !naturalSize) return nextPan
    const bw = box.clientWidth
    const bh = box.clientHeight
    const coverScale = Math.max(bw / naturalSize.w, bh / naturalSize.h)
    const es = coverScale * currentZoom
    const maxX = Math.max(0, (naturalSize.w * es - bw) / 2)
    const maxY = Math.max(0, (naturalSize.h * es - bh) / 2)
    return {
      x: Math.min(maxX, Math.max(-maxX, nextPan.x)),
      y: Math.min(maxY, Math.max(-maxY, nextPan.y)),
    }
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    dragRef.current = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y }
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    setPan(clampPan({ x: dragRef.current.panX + dx, y: dragRef.current.panY + dy }, zoom))
  }

  function handlePointerUp() {
    dragRef.current = null
  }

  function handleZoomChange(next: number) {
    setZoom(next)
    setPan((prev) => clampPan(prev, next))
  }

  function handleImageLoad() {
    const img = imgRef.current
    if (!img) return
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight })
  }

  function handleConfirm() {
    const box = boxRef.current
    const img = imgRef.current
    if (!box || !img || !naturalSize) return

    const bw = box.clientWidth
    const bh = box.clientHeight
    const coverScale = Math.max(bw / naturalSize.w, bh / naturalSize.h)
    const es = coverScale * zoom

    const imgDisplayLeft = bw / 2 + pan.x - (naturalSize.w * es) / 2
    const imgDisplayTop = bh / 2 + pan.y - (naturalSize.h * es) / 2
    const srcX = -imgDisplayLeft / es
    const srcY = -imgDisplayTop / es
    const srcW = bw / es
    const srcH = bh / es

    const canvas = document.createElement('canvas')
    canvas.width = OUTPUT_WIDTH
    canvas.height = OUTPUT_HEIGHT
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT)
    onConfirm(canvas.toDataURL('image/jpeg', 0.85))
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 p-5">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-3xl bg-white p-4 shadow-elevated">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink">사진 위치 조정</p>
          <button type="button" onClick={onCancel} aria-label="닫기" className="text-ink-faint">
            <CloseIcon width={18} height={18} />
          </button>
        </div>

        <div
          ref={boxRef}
          className="relative h-72 w-full touch-none select-none overflow-hidden rounded-2xl bg-surface-2"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <img
            ref={imgRef}
            src={imageUrl}
            alt="위치를 조정할 사진"
            onLoad={handleImageLoad}
            draggable={false}
            className="pointer-events-none absolute left-1/2 top-1/2 max-w-none"
            style={
              naturalSize
                ? {
                    width: naturalSize.w,
                    height: naturalSize.h,
                    transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${
                      Math.max(
                        boxRef.current ? boxRef.current.clientWidth / naturalSize.w : 0,
                        boxRef.current ? boxRef.current.clientHeight / naturalSize.h : 0,
                      ) * zoom
                    })`,
                  }
                : { opacity: 0 }
            }
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-ink-faint">확대</span>
          <input
            type="range"
            min={1}
            max={2.5}
            step={0.05}
            value={zoom}
            onChange={(e) => handleZoomChange(Number(e.target.value))}
            className="flex-1 accent-accent"
          />
        </div>
        <p className="text-center text-xs text-ink-faint">드래그해서 위치를 옮기고, 슬라이더로 확대해보세요</p>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={onCancel}>
            취소
          </Button>
          <Button onClick={handleConfirm} disabled={!naturalSize}>
            적용
          </Button>
        </div>
      </div>
    </div>
  )
}
