import type { SVGProps } from 'react'

const base = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  stroke: 'none',
}

export function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.8 21 10v9.2a1.8 1.8 0 0 1-1.8 1.8H4.8A1.8 1.8 0 0 1 3 19.2V10l9-7.2Z" />
      <path d="M9.3 12.5h5.4a1 1 0 0 1 1 1V21h-7.4v-7.5a1 1 0 0 1 1-1Z" fill="var(--surface)" />
    </svg>
  )
}

export function HistoryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="13.5" width="4.4" height="6.7" rx="1.4" />
      <rect x="9.8" y="8.5" width="4.4" height="11.7" rx="1.4" />
      <rect x="15.6" y="3.5" width="4.4" height="16.7" rx="1.4" />
    </svg>
  )
}

export function ScanIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M9 4.2h6l1.1 2.3H19a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8.5a2 2 0 0 1 2-2h2.9L9 4.2Z" />
      <circle cx="12" cy="13" r="4.1" fill="var(--surface)" />
      <circle cx="12" cy="13" r="1.7" />
    </svg>
  )
}

export function CareIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3C12 3 5.8 11.2 5.8 15.6a6.2 6.2 0 0 0 12.4 0C18.2 11.2 12 3 12 3Z" />
      <ellipse cx="9.6" cy="14.6" rx="1.2" ry="1.9" fill="var(--surface)" opacity="0.85" />
    </svg>
  )
}

export function MyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="7.8" r="3.8" />
      <path d="M4 22c0-4.6 3.7-7.7 8-7.7s8 3.1 8 7.7v0.4H4V22Z" />
    </svg>
  )
}

export function UvIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="none" {...props}>
      <circle cx="12" cy="12" r="4.6" fill="currentColor" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="12"
          y1="3.4"
          x2="12"
          y2="5.6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
    </svg>
  )
}

export function HumidityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.6c3.4 4.6 6.6 8.9 6.6 12.7a6.6 6.6 0 0 1-13.2 0C5.4 11.5 8.6 7.2 12 2.6Z" />
      <ellipse cx="9.6" cy="14.4" rx="1.3" ry="2.1" fill="var(--surface)" opacity="0.85" />
    </svg>
  )
}

export function TempIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="none" {...props}>
      <path
        d="M13.4 13.9V5.2a1.4 1.4 0 0 0-2.8 0v8.7a3.4 3.4 0 1 0 2.8 0Z"
        fill="currentColor"
      />
      <circle cx="12" cy="16.6" r="1.6" fill="var(--surface)" />
      <line x1="14.6" y1="6" x2="16.6" y2="6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="14.6" y1="9" x2="16.6" y2="9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export function SunnyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="none" {...props} className={`icon-anim-sunny ${props.className ?? ''}`}>
      <circle
        cx="12"
        cy="12"
        r="4.2"
        fill="currentColor"
        style={{ transformOrigin: '12px 12px', animation: 'sun-core-pulse 2.4s ease-in-out infinite' }}
      />
      <g style={{ transformOrigin: '12px 12px', animation: 'sun-spin 9s linear infinite' }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
          <g key={deg} transform={`rotate(${deg} 12 12)`}>
            <line
              x1="12"
              y1="3.6"
              x2="12"
              y2="5.4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              style={{
                transformOrigin: 'center',
                transformBox: 'fill-box',
                animation: `sun-glow 1.8s ease-in-out ${i * 0.12}s infinite`,
              }}
            />
          </g>
        ))}
      </g>
    </svg>
  )
}

export function CloudyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M7.4 17.6a4.4 4.4 0 0 1-.5-8.77 5.2 5.2 0 0 1 10-1.53 4.1 4.1 0 0 1-.5 10.3H7.4Z" />
    </svg>
  )
}

export function RainyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="none" {...props} className={`icon-anim-rainy ${props.className ?? ''}`}>
      <path
        d="M7.2 14.6a4.1 4.1 0 0 1-.4-8.18A4.85 4.85 0 0 1 16.5 5a3.8 3.8 0 0 1-.4 9.6H7.2Z"
        fill="currentColor"
        style={{ transformOrigin: 'center', transformBox: 'fill-box', animation: 'rain-cloud-drift 3s ease-in-out infinite' }}
      />
      {[
        { x1: 9, y1: 17, x2: 8, y2: 20.4, delay: 0 },
        { x1: 13, y1: 17, x2: 12, y2: 20.4, delay: 0.3 },
        { x1: 17, y1: 17, x2: 16, y2: 20.4, delay: 0.6 },
      ].map((drop) => (
        <line
          key={drop.x1}
          x1={drop.x1}
          y1={drop.y1}
          x2={drop.x2}
          y2={drop.y2}
          stroke="var(--lab)"
          strokeWidth="1.6"
          strokeLinecap="round"
          style={{ animation: `rain-fall 1.1s ease-in ${drop.delay}s infinite` }}
        />
      ))}
    </svg>
  )
}

export function SnowyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="none" {...props}>
      <path
        d="M7.2 14.6a4.1 4.1 0 0 1-.4-8.18A4.85 4.85 0 0 1 16.5 5a3.8 3.8 0 0 1-.4 9.6H7.2Z"
        fill="currentColor"
      />
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="9" y1="16.8" x2="9" y2="20.8" />
        <line x1="7.3" y1="18.8" x2="10.7" y2="18.8" />
        <line x1="15" y1="16.8" x2="15" y2="20.8" />
        <line x1="13.3" y1="18.8" x2="16.7" y2="18.8" />
      </g>
    </svg>
  )
}

export function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.5c.7 4.8 2.1 6.8 6.8 7.5-4.7.7-6.1 2.7-6.8 7.5-.7-4.8-2.1-6.8-6.8-7.5 4.7-.7 6.1-2.7 6.8-7.5Z" />
      <circle cx="18.7" cy="5.3" r="1.3" />
    </svg>
  )
}

export function InfoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="none" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 11v5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="7.8" r="1.05" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="none" {...props}>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="none" {...props}>
      <path
        d="M4 12h14.5M13 6.5 19 12l-6 5.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ChevronLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="none" {...props}>
      <path
        d="M15 5.5 8.5 12l6.5 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="none" {...props}>
      <path
        d="M9 5.5 15.5 12 9 18.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function BookmarkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M6.5 3.5h11a1 1 0 0 1 1 1V21l-6.5-4-6.5 4V4.5a1 1 0 0 1 1-1Z" />
    </svg>
  )
}

export function ShareIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="none" {...props}>
      <path
        d="M12 15.5V4M12 4 7.5 8.5M12 4l4.5 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 13v6a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function BellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="none" {...props}>
      <path
        d="M6 10.5a6 6 0 0 1 12 0v3.3l1.6 2.7H4.4L6 13.8V10.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9.6 19a2.4 2.4 0 0 0 4.8 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function GalleryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="none" {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="8.6" cy="9.4" r="1.7" fill="currentColor" />
      <path
        d="M4.5 16.8 9 12.3a1.6 1.6 0 0 1 2.26 0l1.24 1.24a1.6 1.6 0 0 0 2.26 0L17.5 10.7l2.5 3.1V17a1.6 1.6 0 0 1-1.6 1.6H6a1.6 1.6 0 0 1-1.5-1Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  )
}

export function CameraIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="none" {...props}>
      <path
        d="M9 5.5 7.8 7.5H5.4A1.9 1.9 0 0 0 3.5 9.4v8.2a1.9 1.9 0 0 0 1.9 1.9h13.2a1.9 1.9 0 0 0 1.9-1.9V9.4a1.9 1.9 0 0 0-1.9-1.9h-2.4L15 5.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13.2" r="3.3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

export function RefreshIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="none" {...props}>
      <path
        d="M19 5v4.5h-4.5M5 19v-4.5H9.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.1 9.5A6.5 6.5 0 0 1 18.2 8M17.9 14.5A6.5 6.5 0 0 1 5.8 16"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function LockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="none" {...props}>
      <rect x="5.5" y="10.5" width="13" height="9" rx="2.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="14.8" r="1.4" fill="currentColor" />
    </svg>
  )
}

export function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="none" {...props}>
      <path
        d="M5.5 7.5h13M9.5 7.5V5.8a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1.7M10 11v6M14 11v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M7 7.5 7.8 19a1.8 1.8 0 0 0 1.8 1.7h4.8A1.8 1.8 0 0 0 16.2 19L17 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.6 14.8 8.9l6.9.7-5.2 4.6 1.6 6.8L12 17.5l-6.1 3.5 1.6-6.8-5.2-4.6 6.9-.7L12 2.6Z" />
    </svg>
  )
}

export function HeartIcon({ filled = false, ...props }: SVGProps<SVGSVGElement> & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={22}
      height={22}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 20.5s-7.5-4.6-10-9.3C.5 7.8 2.3 4.5 5.8 4c2.1-.3 4.1.8 6.2 3 2.1-2.2 4.1-3.3 6.2-3 3.5.5 5.3 3.8 3.8 7.2-2.5 4.7-10 9.3-10 9.3Z" />
    </svg>
  )
}

export function CartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="none" {...props}>
      <path
        d="M6 8h12l-1 12.5a1 1 0 0 1-1 .9H8a1 1 0 0 1-1-.9L6 8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

const CONDITION_ICON = {
  sunny: SunnyIcon,
  cloudy: CloudyIcon,
  rainy: RainyIcon,
  snowy: SnowyIcon,
} as const

export function WeatherConditionIcon({
  condition,
  ...props
}: SVGProps<SVGSVGElement> & { condition: keyof typeof CONDITION_ICON }) {
  const Icon = CONDITION_ICON[condition]
  return <Icon {...props} />
}

export function SaharaCharacterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="none" {...props}>
      <circle cx="12" cy="7.4" r="3.2" fill="currentColor" />
      <path d="M2.5 18.6c2-2.5 4.6-3.9 7.2-3.9s4.6 1.5 6.4 1.5 3-1 5.4-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M2.5 22c2-2.1 4.6-3.3 7.2-3.3s4.6 1.3 6.4 1.3 3-0.8 5.4-0.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  )
}

export function CactusCharacterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="10" y="6" width="4" height="14" rx="2" />
      <path
        d="M10 10H7.6a1.9 1.9 0 0 0-1.9 1.9v2.6a1.9 1.9 0 0 0 1.9 1.9H10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M14 8h2.4a1.9 1.9 0 0 1 1.9 1.9v1.6a1.9 1.9 0 0 1-1.9 1.9H14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <rect x="6" y="20" width="12" height="1.8" rx="0.9" />
    </svg>
  )
}

export function BalanceCharacterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="none" {...props}>
      <line x1="12" y1="3.4" x2="12" y2="19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="5" y1="7" x2="19" y2="7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5 7 2.6 12.2a2.6 2.6 0 0 0 4.8 0L5 7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M19 7l-2.4 5.2a2.6 2.6 0 0 0 4.8 0L19 7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8.5 20.5h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function DoubleLifeCharacterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3a9 9 0 1 0 0 18V3Z" />
      <path d="M12 3a9 9 0 1 1 0 18" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function OilFieldCharacterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="none" {...props}>
      <path d="M12 3 6 19h12L12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <line x1="8.4" y1="12" x2="15.6" y2="12" stroke="currentColor" strokeWidth="1.4" />
      <line x1="7.2" y1="15.5" x2="16.8" y2="15.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="3" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function OilKingCharacterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9.5 8 13l4-7 4 7 4-3.5-1.6 9.3H5.6L4 9.5Z" />
      <circle cx="12" cy="19.3" r="1.1" />
    </svg>
  )
}

const CHARACTER_ICON = {
  sahara: SaharaCharacterIcon,
  cactus: CactusCharacterIcon,
  balance: BalanceCharacterIcon,
  'double-life': DoubleLifeCharacterIcon,
  'oil-field': OilFieldCharacterIcon,
  'oil-king': OilKingCharacterIcon,
} as const

export function SkinCharacterIcon({
  characterId,
  ...props
}: SVGProps<SVGSVGElement> & { characterId: keyof typeof CHARACTER_ICON }) {
  const Icon = CHARACTER_ICON[characterId]
  return <Icon {...props} />
}
