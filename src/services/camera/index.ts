import { MockCameraProvider } from './MockCameraProvider'
import type { CameraProvider } from './camera.types'

// Single swap point: replace with a Capacitor Camera-backed provider for the Android build.
export const cameraProvider: CameraProvider = new MockCameraProvider()

export type { CameraProvider, CaptureResult } from './camera.types'
