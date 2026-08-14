import { useNavigate } from 'react-router-dom'
import { Button } from '../components'
import { brand } from '../config/brand'

export function OnboardingPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
      <img src={brand.logo.wordmark} alt={brand.name} className="h-8 w-auto" />

      <div className="flex flex-col gap-2">
        <p className="text-lg font-medium text-ink">{brand.tagline}</p>
        <p className="text-sm text-ink-soft">
          기름종이 한 장으로 오늘의 피지 패턴을 기록하고
          <br />
          변화를 눈으로 확인해보세요.
        </p>
      </div>

      <Button onClick={() => navigate('/')} className="w-full max-w-xs">
        시작하기
      </Button>
    </div>
  )
}
