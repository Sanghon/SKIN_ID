import { calcOilScore, classifySkinType, resolveSkinCharacter } from '../../lib/oilIndex'
import { FACE_ZONES } from '../../types/measurement'
import type { OilAnalysisInput, OilAnalysisResult } from '../../types/measurement'
import type { ZoneScore } from '../../types/skin'
import type { OilAnalysisEngine } from './analysis.types'

const SIZE = 256

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

function percentile(values: number[], ratio: number): number {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * ratio))] ?? 0
}

function countSpots(mask: Uint8Array, width: number, height: number): number {
  const visited = new Uint8Array(mask.length)
  const stack: number[] = []
  let components = 0
  for (let i = 0; i < mask.length; i += 1) {
    if (!mask[i] || visited[i]) continue
    let area = 0
    visited[i] = 1
    stack.push(i)
    while (stack.length) {
      const p = stack.pop()!
      area += 1
      const x = p % width
      const y = Math.floor(p / width)
      const neighbors = [x > 0 ? p - 1 : -1, x + 1 < width ? p + 1 : -1, y > 0 ? p - width : -1, y + 1 < height ? p + width : -1]
      for (const next of neighbors) {
        if (next >= 0 && mask[next] && !visited[next]) {
          visited[next] = 1
          stack.push(next)
        }
      }
    }
    if (area >= 8 && area <= width * height * 0.08) components += 1
  }
  return components
}

export const opticalEngine: OilAnalysisEngine = {
  async analyzeOilPaper(input: OilAnalysisInput): Promise<OilAnalysisResult> {
    const image = await loadImage(input.imageUrl)
    const roi = input.roi ?? { x: 0.15, y: 0.15, width: 0.7, height: 0.7 }
    const canvas = document.createElement('canvas')
    canvas.width = SIZE
    canvas.height = SIZE
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) throw new Error('CANVAS_UNAVAILABLE')
    context.drawImage(
      image,
      roi.x * image.naturalWidth,
      roi.y * image.naturalHeight,
      roi.width * image.naturalWidth,
      roi.height * image.naturalHeight,
      0,
      0,
      SIZE,
      SIZE,
    )

    const pixels = context.getImageData(0, 0, SIZE, SIZE).data
    const lightness: number[] = []
    const chroma: number[] = []
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i]
      const g = pixels[i + 1]
      const b = pixels[i + 2]
      lightness.push(0.2126 * r + 0.7152 * g + 0.0722 * b)
      chroma.push(Math.max(r, g, b) - Math.min(r, g, b))
    }

    const midLight = percentile(lightness, 0.55)
    const midChroma = percentile(chroma, 0.65)
    const mask = new Uint8Array(lightness.length)
    let oilPixels = 0
    let contrastSum = 0
    for (let i = 0; i < lightness.length; i += 1) {
      const contrast = Math.max(0, midLight - lightness[i])
      const isOil = contrast > 10 || (chroma[i] > Math.max(14, midChroma + 6) && lightness[i] < midLight + 15)
      if (isOil) {
        mask[i] = 1
        oilPixels += 1
        contrastSum += contrast
      }
    }

    const oilCoverage = Math.round((oilPixels / mask.length) * 100)
    const oilIntensity = Math.round(Math.min(100, oilPixels ? (contrastSum / oilPixels) * 2.2 : 0))
    const spots = countSpots(mask, SIZE, SIZE)
    const spotDensity = Math.round((spots / (roi.width * roi.height * 100)) * 10) / 10
    const oilScore = calcOilScore(oilCoverage, oilIntensity)
    const skinType = classifySkinType(oilScore)
    const zoneScores: ZoneScore[] = FACE_ZONES.map((zone) => ({
      zone,
      oilCoverage,
      oilIntensity,
      score: oilScore,
    }))

    return {
      oilCoverage,
      oilIntensity,
      spotDensity,
      tZoneScore: oilScore,
      uZoneScore: oilScore,
      oilScore,
      confidence: 0.78,
      skinType,
      skinCharacter: resolveSkinCharacter(skinType, oilScore, oilScore),
      zoneScores,
    }
  },
}
