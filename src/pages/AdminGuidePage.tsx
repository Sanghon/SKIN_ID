import { Link } from 'react-router-dom'
import { Card } from '../components'
import { TrashIcon } from '../components/icons'
import { useGuidelineImages } from '../lib/guidelineImages'

export function AdminGuidePage() {
  const { images, addImage, removeImage, maxImages } = useGuidelineImages()

  return (
    <div className="flex flex-col gap-4">
      <header>
        <Link to="/profile" className="text-sm text-ink-soft">
          ← 마이로 돌아가기
        </Link>
        <h1 className="mt-2 text-lg font-semibold text-ink">관리자 설정 · 촬영 사용팁</h1>
        <p className="mt-1 text-sm text-ink-faint">
          촬영 화면 &quot;사용팁&quot;에 노출되는 안내 이미지를 최대 {maxImages}장까지 등록할 수 있어요. (현재는 권한
          제한 없이 전체 공개)
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {images.map((src, i) => (
          <Card key={i} className="flex items-center gap-3">
            <img src={src} alt={`사용팁 ${i + 1}`} className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">사용팁 이미지 {i + 1}</p>
            </div>
            <button
              type="button"
              onClick={() => removeImage(i)}
              aria-label="삭제"
              className="shrink-0 text-pop-coral"
            >
              <TrashIcon width={18} height={18} />
            </button>
          </Card>
        ))}
        {images.length === 0 && (
          <p className="text-sm text-ink-faint">등록된 사용팁 이미지가 없어요.</p>
        )}
      </div>

      {images.length < maxImages ? (
        <button
          type="button"
          onClick={() => void addImage()}
          className="rounded-2xl border border-dashed border-line px-4 py-3 text-sm font-medium text-ink-soft"
        >
          + 사용팁 이미지 추가 ({images.length}/{maxImages})
        </button>
      ) : (
        <p className="text-center text-xs text-ink-faint">최대 {maxImages}장까지 등록할 수 있어요.</p>
      )}
    </div>
  )
}
