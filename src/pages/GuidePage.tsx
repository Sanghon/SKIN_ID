import { useNavigate } from 'react-router-dom'
import { Button, Card } from '../components'
import { ArrowRightIcon, ScanIcon, SparkleIcon } from '../components/icons'
import guidePhoto from '../assets/oil-paper-guide.jpg'
import { FACE_ZONES } from '../types/measurement'

export function GuidePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-1 flex-col gap-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">Self Care Guide</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink">기름종이 사용법</h1>
        <p className="mt-1.5 text-sm text-ink-soft">5개 부위를 순서대로 가볍게 눌러주세요.</p>
      </div>

      <div className="overflow-hidden rounded-3xl shadow-elevated">
        <img src={guidePhoto} alt="기름종이로 눌러야 할 이마, 코, 양쪽 볼, 턱 5개 부위 예시" className="block w-full" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {FACE_ZONES.map((zone, i) => (
          <div
            key={zone}
            className={`flex items-center gap-3 rounded-2xl border border-line bg-surface px-3.5 py-3 ${
              i === FACE_ZONES.length - 1 ? 'col-span-2' : ''
            }`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-ink">
              {i + 1}
            </span>
            <span className="text-sm text-ink">{zone}</span>
          </div>
        ))}
      </div>

      <Card className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft">
          <SparkleIcon className="h-4.5 w-4.5 text-ink" />
        </span>
        <div className="text-sm text-ink-soft">
          <p className="font-medium text-ink">사용 팁</p>
          <p className="mt-1">
            한 장으로 5개 부위를 순서대로 지긋이 눌러 사용해요.
          </p>
        </div>
      </Card>

      <div className="mt-auto">
        <Button onClick={() => navigate('/capture')} className="w-full">
          <ScanIcon className="h-5 w-5" />
          촬영 시작하기
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
