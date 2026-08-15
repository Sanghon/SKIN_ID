import { useEffect, useSyncExternalStore } from 'react'
import { addWishlistApi, fetchWishlist, removeWishlistApi } from './api'

let cached: string[] = []
let loaded = false
let loadPromise: Promise<void> | null = null
const listeners = new Set<() => void>()

function notify() {
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

function ensureLoaded(): void {
  if (loaded || loadPromise) return
  loadPromise = fetchWishlist()
    .then((ids) => {
      cached = ids
      loaded = true
      notify()
    })
    .catch(() => {
      loaded = true
    })
}

/** 관심품목(장바구니) 담긴 제품 id 목록. 여러 화면(케어, 상세, 장바구니 배지)에서 동시에 마운트돼도 실시간으로 동기화된다. */
export function useWishlist() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  useEffect(ensureLoaded, [])

  function add(productId: string) {
    if (cached.includes(productId)) return
    const previous = cached
    cached = [...cached, productId]
    notify()
    addWishlistApi(productId).catch(() => {
      cached = previous
      notify()
    })
  }

  function remove(productId: string) {
    const previous = cached
    cached = cached.filter((id) => id !== productId)
    notify()
    removeWishlistApi(productId).catch(() => {
      cached = previous
      notify()
    })
  }

  function toggle(productId: string) {
    if (cached.includes(productId)) {
      remove(productId)
    } else {
      add(productId)
    }
  }

  function clear() {
    const previous = cached
    cached = []
    notify()
    Promise.all(previous.map((id) => removeWishlistApi(id))).catch(() => {
      cached = previous
      notify()
    })
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
