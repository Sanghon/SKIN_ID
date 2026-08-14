import { Link } from 'react-router-dom'
import { useWishlist } from '../lib/wishlist'
import { CartIcon } from './icons'

/** 앱 프레임(max-w-md) 우측 상단에 항상 고정되는 장바구니 배지. 스크롤과 무관하게 항상 보인다. */
export function CartBadge() {
  const { count } = useWishlist()
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="flex w-full max-w-md justify-end">
        <Link
          to="/cart"
          aria-label="장바구니"
          className="pointer-events-auto relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-elevated"
        >
          <CartIcon width={19} height={19} />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-pop-coral px-1 text-[10px] font-semibold text-white">
              {count}
            </span>
          )}
        </Link>
      </div>
    </div>
  )
}
