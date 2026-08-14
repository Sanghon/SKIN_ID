import { useSyncExternalStore } from 'react'

let message: string | null = null
let hideTimer: ReturnType<typeof setTimeout> | undefined
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

/** 어디서든 호출 가능한 전역 토스트 트리거. 2초 뒤 자동으로 사라진다. */
export function showToast(text: string) {
  message = text
  emit()
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    message = null
    emit()
  }, 2000)
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return message
}

function getServerSnapshot() {
  return null
}

export function useToastMessage() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
