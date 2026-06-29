import { useState } from 'react'
import type { PixelQualityResult } from '../../lib/imageQuality'

export type ScreeningStep = 'eye' | 'nail' | 'form' | 'result'

export interface FormDraft {
  targetGroup: 'adolescent' | 'pregnant'
  ageYears: number
  symptoms: number        // count 0-4
  ironAdherence: 'none' | 'irregular' | 'high'
  dietRisk: number        // 0-3
  recentBleeding: boolean
  previousAnemia: boolean
  // adolescent
  menstruates: boolean
  heavyMenstrualBleeding: boolean
  // pregnant
  gestationalAgeWeeks: number
  parity: number
}

const DEFAULT_FORM: FormDraft = {
  targetGroup: 'adolescent',
  ageYears: 16,
  symptoms: 0,
  ironAdherence: 'irregular',
  dietRisk: 1,
  recentBleeding: false,
  previousAnemia: false,
  menstruates: true,
  heavyMenstrualBleeding: false,
  gestationalAgeWeeks: 20,
  parity: 0,
}

export interface ScreeningDraft {
  step: ScreeningStep
  eyeQuality: PixelQualityResult | null
  nailQuality: PixelQualityResult | null
  form: FormDraft
  setStep: (s: ScreeningStep) => void
  setEyeQuality: (q: PixelQualityResult) => void
  setNailQuality: (q: PixelQualityResult) => void
  setForm: (patch: Partial<FormDraft>) => void
  reset: () => void
  allModalitiesComplete: boolean
}

export function useScreeningDraft(): ScreeningDraft {
  const [step, setStep] = useState<ScreeningStep>('eye')
  const [eyeQuality, setEyeQuality] = useState<PixelQualityResult | null>(null)
  const [nailQuality, setNailQuality] = useState<PixelQualityResult | null>(null)
  const [form, setFormState] = useState<FormDraft>(DEFAULT_FORM)

  const setForm = (patch: Partial<FormDraft>) =>
    setFormState((prev) => ({ ...prev, ...patch }))

  const reset = () => {
    setStep('eye')
    setEyeQuality(null)
    setNailQuality(null)
    setFormState(DEFAULT_FORM)
  }

  const allModalitiesComplete =
    eyeQuality?.eligible === true && nailQuality?.eligible === true

  return { step, eyeQuality, nailQuality, form, setStep, setEyeQuality, setNailQuality, setForm, reset, allModalitiesComplete }
}
