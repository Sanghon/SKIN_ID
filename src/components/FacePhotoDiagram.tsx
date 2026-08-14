import type { FaceDiagramMarker, FaceZoneName } from './FaceDiagram'

/** Zone anchor points as % of the photo's width/height, tuned for the default cropped portrait. */
const ZONE_POSITIONS_PCT: Record<FaceZoneName, [number, number]> = {
  이마: [48, 19],
  코: [46, 63],
  왼쪽볼: [23, 62],
  오른쪽볼: [73, 60],
  턱: [44, 88],
}

export function FacePhotoDiagram({
  markers,
  photoSrc,
  className = '',
}: {
  markers: FaceDiagramMarker[]
  photoSrc: string
  className?: string
}) {
  return (
    <div className={`relative mx-auto h-64 w-52 overflow-hidden rounded-3xl ${className}`}>
      <img src={photoSrc} alt="분석에 사용된 얼굴 사진" className="h-full w-full object-cover" />
      {markers.map((m) => {
        const [xPct, yPct] = ZONE_POSITIONS_PCT[m.zone]
        const size = (m.radius ?? 9) * 2
        return (
          <div
            key={m.zone}
            className="absolute flex items-center justify-center rounded-full shadow-sm"
            style={{
              left: `${xPct}%`,
              top: `${yPct}%`,
              width: size,
              height: size,
              transform: 'translate(-50%, -50%)',
              backgroundColor: m.color ?? 'var(--accent-soft)',
              opacity: 0.88,
            }}
          >
            {m.label != null && <span className="text-[9px] font-bold text-ink">{m.label}</span>}
          </div>
        )
      })}
    </div>
  )
}
