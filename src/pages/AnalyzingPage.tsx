import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { analysisEngine } from '../services/analysis'

const STATUS_LINES = [
  '기름종이 영역을 확인하고 있어요',
  '피지 번짐을 분석하고 있어요',
  'T존과 U존 패턴을 비교하고 있어요',
  'Oil Score를 계산하고 있어요',
]

interface CaptureState {
  imageUrl: string
  capturedAt: string
}

export function AnalyzingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [lineIndex, setLineIndex] = useState(0)
  const hasStarted = useRef(false)

  const state = location.state as CaptureState | null

  useEffect(() => {
    if (!state) {
      navigate('/capture', { replace: true })
      return
    }
    if (hasStarted.current) return
    hasStarted.current = true

    const stepMs = 550
    const lineTimer = setInterval(() => {
      setLineIndex((i) => Math.min(i + 1, STATUS_LINES.length - 1))
    }, stepMs)

    Promise.all([
      analysisEngine.analyzeOilPaper({
        imageUrl: state.imageUrl,
        capturedAt: state.capturedAt,
      }),
      new Promise((resolve) => setTimeout(resolve, stepMs * STATUS_LINES.length)),
    ]).then(([result]) => {
      clearInterval(lineTimer)
      const id = `local-${Date.now()}`
      navigate(`/result/${id}`, {
        replace: true,
        state: {
          id,
          userId: 'user-1',
          capturedAt: state.capturedAt,
          imageUrl: state.imageUrl,
          result,
        },
      })
    })

    return () => clearInterval(lineTimer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const progress = Math.round(((lineIndex + 1) / STATUS_LINES.length) * 100)

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <div className="h-10 w-10 rounded-full border-2 border-line border-t-accent animate-spin" />
      <p className="text-sm text-ink-soft transition-opacity">{STATUS_LINES[lineIndex]}</p>
      <div className="h-1.5 w-40 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
