import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'oilog-wishlist'

function readStored(): string[] {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as string[]) : []
  } catch {
    return []
  }
}

let cached: string[] = readStored()
const listeners = new Set<() => void>()

function persist(next: string[]) {
  cached = next
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return cached
}

function getServerSnapshot() {
  return []
}

/** 관심품목(장바구니) 담긴 제품 id 목록. 여러 화면(케어, 상세, 장바구니 배지)에서 동시에 마운트돼도 실시간으로 동기화된다. */
export function useWishlist() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  function add(productId: string) {
    if (cached.includes(productId)) return
    persist([...cached, productId])
  }

  function remove(productId: string) {
    persist(cached.filter((id) => id !== productId))
  }

  function toggle(productId: string) {
    if (cached.includes(productId)) {
      remove(productId)
    } else {
      add(productId)
    }
  }

  function clear() {
    persist([])
  }

  return {
    ids,
    count: ids.length,
    isWishlisted: (productId: string) => ids.includes(productId),
    add,
    remove,
    toggle,
    clear,
  } as const
}
