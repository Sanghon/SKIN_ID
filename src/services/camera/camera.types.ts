export interface CaptureResult {
  imageUrl: string
  capturedAt: string
}

/** Common contract for capturing a blotting-paper photo, mock or native. */
export interface CameraProvider {
  capture(): Promise<CaptureResult>
}
