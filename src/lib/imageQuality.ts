export interface PixelQualityResult {
  eligible: boolean
  brightness: number   // 0-100
  contrast: number     // 0-100
  sharpness: number    // 0-100
  framing: number      // 0-100 (coverage proxy)
  redRatio: number     // 0-1
  feedback: string[]
}

export function analyzePixels(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
): PixelQualityResult {
  const n = width * height
  if (n === 0) return { eligible: false, brightness: 0, contrast: 0, sharpness: 0, framing: 0, redRatio: 0, feedback: ['Gambar kosong'] }

  let sumL = 0, sumR = 0
  const lumas: number[] = []

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2]
    const luma = 0.299 * r + 0.587 * g + 0.114 * b
    lumas.push(luma)
    sumL += luma
    sumR += r
  }

  const meanL = sumL / n
  const meanR = sumR / n

  let variance = 0
  for (const l of lumas) variance += (l - meanL) ** 2
  const stdL = Math.sqrt(variance / n)

  // sharpness: mean absolute difference between adjacent pixel lumas
  let sharpSum = 0, sharpCount = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width - 1; x++) {
      const idx = (y * width + x) * 4
      const idx2 = idx + 4
      const l1 = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2]
      const l2 = 0.299 * pixels[idx2] + 0.587 * pixels[idx2 + 1] + 0.114 * pixels[idx2 + 2]
      sharpSum += Math.abs(l1 - l2)
      sharpCount++
    }
  }
  const sharpMean = sharpCount > 0 ? sharpSum / sharpCount : 0

  const brightness = Math.min(100, Math.round((meanL / 255) * 100))
  const contrast = Math.min(100, Math.round((stdL / 128) * 100))
  const sharpness = Math.min(100, Math.round((sharpMean / 30) * 100))
  const redRatio = meanL > 0 ? Math.min(1, meanR / (meanL + 1)) : 0
  const framing = brightness > 5 ? Math.min(100, Math.round(brightness * 1.1)) : 0

  const feedback: string[] = []
  if (brightness < 30) feedback.push('Gambar terlalu gelap, cari cahaya yang lebih terang')
  if (brightness > 90) feedback.push('Gambar terlalu terang, hindari cahaya langsung')
  if (contrast < 20) feedback.push('Kontras rendah, pastikan objek tampak jelas')
  if (sharpness < 20) feedback.push('Gambar buram, pegang kamera dengan stabil')

  const eligible = brightness >= 20 && brightness <= 92 && sharpness >= 15 && contrast >= 15

  return { eligible, brightness, contrast, sharpness, framing, redRatio, feedback }
}
