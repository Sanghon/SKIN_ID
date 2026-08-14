import { Link, useParams } from 'react-router-dom'
import { Button, Card } from '../components'
import { HeartIcon } from '../components/icons'
import { useProductStore } from '../lib/productStore'
import { showToast } from '../lib/toast'
import { useWishlist } from '../lib/wishlist'

export function ProductDetailPage() {
  const { productId } = useParams()
  const { products } = useProductStore()
  const product = products.find((p) => p.id === productId)
  const { isWishlisted, toggle: toggleWishlist } = useWishlist()

  if (!product) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-ink-soft">제품을 찾을 수 없어요.</p>
        <Link to="/care" className="text-sm text-ink underline">
          케어 목록으로
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Link to="/care" className="text-sm text-ink-soft">
        ← 케어 목록으로
      </Link>

      {product.imageUrl && (
        <img src={product.imageUrl} alt={product.name} className="h-56 w-full rounded-3xl object-cover" />
      )}

      <Card elevated className="flex flex-col gap-2">
        <p className="text-xs text-ink-faint">{product.brand}</p>
        <h1 className="text-lg font-semibold text-ink">{product.name}</h1>
        <p className="text-sm text-ink-soft">{product.description}</p>
        <p className="mt-2 text-sm font-medium text-ink tabular-nums">{product.price.toLocaleString('ko-KR')}원</p>
      </Card>

      <Card className="text-sm text-ink-soft">
        <p className="font-medium text-ink">Match Score {product.matchScore}</p>
        <p className="mt-1">{product.reason}</p>
      </Card>

      <div className="grid grid-cols-[auto_1fr] gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            const wasWishlisted = isWishlisted(product.id)
            toggleWishlist(product.id)
            if (!wasWishlisted) showToast('장바구니에 추가되었습니다')
          }}
          aria-label={isWishlisted(product.id) ? '관심품목에서 빼기' : '관심품목에 담기'}
        >
          <HeartIcon width={17} height={17} filled={isWishlisted(product.id)} className={isWishlisted(product.id) ? 'text-pop-coral' : ''} />
        </Button>
        <Button className="w-full">구매하러 가기</Button>
      </div>
      <p className="text-center text-xs text-ink-faint">
        결제 연동 전이라 지금은 외부 링크/모의 결제로만 동작해요.
      </p>
    </div>
  )
}
