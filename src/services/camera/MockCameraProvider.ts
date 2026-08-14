import type { CameraProvider, CaptureResult } from './camera.types'

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function pickFile(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment'
    input.onchange = () => resolve(input.files?.[0] ?? null)
    input.click()
  })
}

/** MVP camera: opens the native file/camera picker and reads the chosen photo. */
export class MockCameraProvider implements CameraProvider {
  async capture(): Promise<CaptureResult> {
    const file = await pickFile()
    if (!file) throw new Error('CAMERA_CANCELLED')
    const imageUrl = await fileToDataUrl(file)
    return { imageUrl, capturedAt: new Date().toISOString() }
  }
}
