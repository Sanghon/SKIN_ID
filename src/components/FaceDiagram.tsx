export type FaceZoneName = '이마' | '코' | '왼쪽볼' | '오른쪽볼' | '턱'

const ZONE_POSITIONS: Record<FaceZoneName, [number, number]> = {
  이마: [60, 31],
  코: [60, 62],
  왼쪽볼: [40, 67],
  오른쪽볼: [80, 67],
  턱: [60, 90],
}

export interface FaceDiagramMarker {
  zone: FaceZoneName
  radius?: number
  color?: string
  label?: string | number
}

export function FaceDiagram({
  markers,
  className = '',
}: {
  markers: FaceDiagramMarker[]
  className?: string
}) {
  return (
    <svg viewBox="0 0 120 132" className={`mx-auto h-52 w-52 ${className}`} aria-hidden="true">
      {/* shoulders */}
      <path
        d="M10 132C10 112 26 100 42 96 48 102 54 105 60 105 66 105 72 102 78 96 94 100 110 112 110 132Z"
        className="fill-ink-faint"
        opacity="0.35"
      />
      {/* neck */}
      <path
        d="M51 86L51 104C54 108 57 109.5 60 109.5 63 109.5 66 108 69 104L69 86Z"
        className="fill-surface-2 stroke-ink-faint"
        strokeWidth="1.2"
      />
      {/* hair, sits behind the face oval so only the frame around it stays visible */}
      <ellipse cx="60" cy="38" rx="42" ry="40" className="fill-ink-soft" opacity="0.9" />
      <line x1="60" y1="1" x2="60" y2="13" className="stroke-paper" strokeWidth="1.4" opacity="0.5" />

      {/* face */}
      <path
        d="M60 19C76 19 84.5 33 83.5 49 82.7 61.5 78.5 73.5 70 83.5 66 89 63 93 60 95 57 93 54 89 50 83.5 41.5 73.5 37.3 61.5 36.5 49 35.5 33 44 19 60 19Z"
        className="fill-surface-2 stroke-ink-faint"
        strokeWidth="1.3"
      />

      {/* ears */}
      <path d="M36.5 53C32.5 52 30 56.5 31.5 62 32.7 66 36 66.5 37.5 63Z" className="fill-surface-2 stroke-ink-faint" strokeWidth="1" />
      <path d="M83.5 53C87.5 52 90 56.5 88.5 62 87.3 66 84 66.5 82.5 63Z" className="fill-surface-2 stroke-ink-faint" strokeWidth="1" />

      {/* brows */}
      <path d="M45.5 45.5C48 42.3 52.3 41.3 55.5 43.2" className="stroke-ink-soft" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M74.5 45.5C72 42.3 67.7 41.3 64.5 43.2" className="stroke-ink-soft" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* eyes */}
      <path d="M44.5 51.5C47 48.7 53 48.7 55.5 51.5 53 54.2 47 54.2 44.5 51.5Z" className="fill-none stroke-ink-soft" strokeWidth="1.1" />
      <circle cx="50" cy="51.6" r="1.7" className="fill-ink" />
      <circle cx="50.7" cy="50.8" r="0.55" className="fill-surface" />
      <path d="M75.5 51.5C73 48.7 67 48.7 64.5 51.5 67 54.2 73 54.2 75.5 51.5Z" className="fill-none stroke-ink-soft" strokeWidth="1.1" />
      <circle cx="70" cy="51.6" r="1.7" className="fill-ink" />
      <circle cx="70.7" cy="50.8" r="0.55" className="fill-surface" />

      {/* blush */}
      <ellipse cx="42.5" cy="64" rx="4.2" ry="2.4" className="fill-pop-coral-soft" opacity="0.55" />
      <ellipse cx="77.5" cy="64" rx="4.2" ry="2.4" className="fill-pop-coral-soft" opacity="0.55" />

      {/* nose */}
      <path
        d="M59 55C57.8 60.5 57 64.5 58.5 68 59.3 69.8 61 69.8 62 68"
        className="fill-none stroke-ink-faint"
        strokeWidth="1.1"
        strokeLinecap="round"
      />

      {/* lips */}
      <path
        d="M51.5 78.5C55 75.5 58 74.6 60 75.6 62 74.6 65 75.5 68.5 78.5 65.5 82.2 61 83.6 60 83.6 59 83.6 54.5 82.2 51.5 78.5Z"
        className="fill-pop-coral-soft stroke-pop-coral"
        strokeWidth="0.5"
        opacity="0.92"
      />
      <path d="M53.5 78.3C56 80 64 80 66.5 78.3" className="fill-none stroke-pop-coral" strokeWidth="0.6" opacity="0.6" />

      {markers.map((m) => {
        const [cx, cy] = ZONE_POSITIONS[m.zone]
        const r = m.radius ?? 9
        return (
          <g key={m.zone}>
            <circle cx={cx} cy={cy} r={r} fill={m.color ?? 'var(--accent-soft)'} opacity="0.88" />
            {m.label != null && (
              <text x={cx} y={cy + 3.4} textAnchor="middle" fontSize="9" fontWeight="700" className="fill-ink">
                {m.label}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
