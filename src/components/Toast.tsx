import { useToastMessage } from '../lib/toast'

/** 화면 하단에 잠깐 떴다 사라지는 전역 토스트. MainLayout에 한 번만 마운트한다. */
export function Toast() {
  const message = useToastMessage()
  if (!message) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4">
      <div className="pointer-events-auto rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-paper shadow-elevated">
        {message}
      </div>
    </div>
  )
}
