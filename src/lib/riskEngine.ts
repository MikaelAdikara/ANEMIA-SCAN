import type { TargetGroup } from '../domain/types'
import type { PixelQualityResult } from './imageQuality'

export type RiskCategory = 'low' | 'moderate' | 'high'
export type ConfidenceLabel = 'Rendah' | 'Sedang' | 'Tinggi'

export interface RiskEngineInput {
  targetGroup: TargetGroup
  symptoms: number        // 0-4 (count of positive symptoms)
  ironAdherence: 'none' | 'irregular' | 'high'
  dietRisk: number        // 0-3 (animal protein deficit)
  eyeQuality: PixelQualityResult
  nailQuality: PixelQualityResult
  recentBleeding?: boolean
  previousAnemia?: boolean
}

export interface RiskContribution {
  label: string
  percent: number
  color: string
}

export interface RiskEngineResult {
  category: RiskCategory
  confidenceLabel: ConfidenceLabel
  score: number   // 0-1 internal, not exposed as probability
  contributions: RiskContribution[]
  disclaimer: string
}

export function estimatePrototypeRisk(input: RiskEngineInput): RiskEngineResult {
  if (!input.eyeQuality.eligible) throw new Error('IMAGE_QUALITY_INELIGIBLE')
  if (!input.nailQuality.eligible) throw new Error('IMAGE_QUALITY_INELIGIBLE')

  // Symptom component (weight 0.30)
  const symptomScore = input.symptoms / 4

  // Iron adherence component (weight 0.20)
  const ironScore = input.ironAdherence === 'none' ? 1 : input.ironAdherence === 'irregular' ? 0.5 : 0

  // Diet risk component (weight 0.15)
  const dietScore = input.dietRisk / 3

  // Visual signal — bounded demo heuristic from luminance/color (weight 0.25)
  const eyeLumaNorm = 1 - Math.min(1, input.eyeQuality.brightness / 100)
  const nailRedSignal = Math.max(0, 0.5 - input.nailQuality.redRatio)
  const visualScore = (eyeLumaNorm * 0.6 + nailRedSignal * 0.4)

  // Bleeding/history bonus (weight 0.10)
  const historyScore = ((input.recentBleeding ? 0.6 : 0) + (input.previousAnemia ? 0.4 : 0))

  // Quality confidence weight
  const eyeConf = input.eyeQuality.sharpness / 100
  const nailConf = input.nailQuality.sharpness / 100
  const qualityWeight = 0.7 + 0.3 * ((eyeConf + nailConf) / 2)

  const raw =
    symptomScore * 0.30 +
    ironScore * 0.20 +
    dietScore * 0.15 +
    visualScore * 0.25 +
    historyScore * 0.10

  const score = Math.min(1, raw * qualityWeight)

  const category: RiskCategory = score < 0.35 ? 'low' : score < 0.62 ? 'moderate' : 'high'

  const avgConf = (eyeConf + nailConf) / 2
  const confidenceLabel: ConfidenceLabel = avgConf > 0.65 ? 'Tinggi' : avgConf > 0.35 ? 'Sedang' : 'Rendah'

  const contributions: RiskContribution[] = [
    { label: 'Gejala klinis', percent: Math.round(symptomScore * 30), color: '#e05a4e' },
    { label: 'Suplementasi besi', percent: Math.round(ironScore * 20), color: '#d68910' },
    { label: 'Risiko diet', percent: Math.round(dietScore * 15), color: '#d68910' },
    { label: 'Sinyal visual', percent: Math.round(visualScore * 25), color: '#2471a3' },
    { label: 'Riwayat / perdarahan', percent: Math.round(historyScore * 10), color: '#7d3c98' },
  ]

  return {
    category,
    confidenceLabel,
    score,
    contributions,
    disclaimer: 'Estimasi prototipe — bukan diagnosis medis. Konfirmasi dengan pemeriksaan Hb.',
  }
}
