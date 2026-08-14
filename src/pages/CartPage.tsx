import { Link, useNavigate } from 'react-router-dom'
import { Button, Card } from '../components'
import { ChevronLeftIcon, ShareIcon, TrashIcon } from '../components/icons'
import { useProductStore } from '../lib/productStore'
import { showToast } from '../lib/toast'
import { useWishlist } from '../lib/wishlist'

export function CartPage() {
  const navigate = useNavigate()
  const { products } = useProductStore()
  const { ids, remove, clear } = useWishlist()

  const items = ids.map((id) => products.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p))
  const total = items.reduce((sum, p) => sum + p.price, 0)

  function handleCheckout() {
    showToast('결제가 완료되었어요 (모의 결제)')
    clear()
  }

  function handleShareToFriend() {
    showToast('카카오톡 공유 링크를 복사했어요 (모의 기능)')
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center gap-3">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로 가기" className="text-ink">
          <ChevronLeftIcon width={22} height={22} />
        </button>
        <h1 className="text-lg font-semibold text-ink">장바구니</h1>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
          <p className="text-sm text-ink-soft">담긴 관심 품목이 없어요.</p>
          <Link to="/care" className="text-sm text-ink underline">
            케어 추천 보러 가기 →
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {items.map((product) => (
              <Card key={product.id} className="flex items-center gap-3">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 shrink-0 rounded-2xl bg-surface-2" />
                )}
                <div className="min-w-0 flex-1">
                  <Link to={`/care/${product.id}`} className="truncate font-medium text-ink">
                    {product.name}
                  </Link>
                  <p className="text-xs text-ink-faint">{product.brand}</p>
                  <p className="mt-1 text-sm font-medium tabular-nums text-ink">
                    {product.price.toLocaleString('ko-KR')}원
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(product.id)}
                  aria-label="관심품목에서 빼기"
                  className="shrink-0 text-ink-faint"
                >
                  <TrashIcon width={18} height={18} />
                </button>
              </Card>
            ))}
          </div>

          <Card className="flex items-center justify-between">
            <span className="text-sm text-ink-soft">총 {items.length}개</span>
            <span className="font-display text-lg font-semibold tabular-nums text-ink">
              {total.toLocaleString('ko-KR')}원
            </span>
          </Card>

          <button
            type="button"
            onClick={handleShareToFriend}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-line bg-surface px-5 text-sm font-semibold text-ink transition-all active:scale-95"
          >
            <ShareIcon width={16} height={16} />
            친구에게 추천하기
          </button>

          <Button className="w-full" onClick={handleCheckout}>
            관심 품목 전체 구매하기
          </Button>
          <p className="text-center text-xs text-ink-faint">
            결제 연동 전이라 지금은 외부 링크/모의 결제로만 동작해요.
          </p>
        </>
      )}
    </div>
  )
}
