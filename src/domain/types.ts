export type TargetGroup = 'adolescent' | 'pregnant'

export type RiskLevel = 'low' | 'moderate' | 'high'

export type FollowUpStatus =
  | 'not-required'
  | 'recommended'
  | 'scheduled'
  | 'completed'
  | 'lost-to-follow-up'

export type ImageModality = 'eye' | 'nail'

export type ImageQuality = 'good' | 'acceptable' | 'poor' | 'unusable'

export type ScreeningCompletionState = 'completed' | 'incomplete'

export type IronSupplementUse = 'none' | 'irregular' | 'regular'

export type MuacCategory = 'below-23.5-cm' | 'at-or-above-23.5-cm'

export type AnonymousScreeningId = `SCR-${string}`

export type IsoTimestamp = `${number}-${number}-${number}T${number}:${number}:${number}${string}`

export interface ScreeningSymptoms {
  fatigue: boolean
  dizziness: boolean
  shortnessOfBreath: boolean
  visiblePallor: boolean
}

interface CommonRiskForm {
  ageYears: number
  symptoms: ScreeningSymptoms
  animalProteinServingsPerWeek: number
  ironSupplementUse: IronSupplementUse
  recentBleeding: boolean
  previousAnemia: boolean
}

export interface AdolescentRiskForm extends CommonRiskForm {
  targetGroup: 'adolescent'
  menstruates: boolean
  heavyMenstrualBleeding: boolean | null
}

export interface PregnantRiskForm extends CommonRiskForm {
  targetGroup: 'pregnant'
  gestationalAgeWeeks: number
  parity: number
  muacCategory: MuacCategory
}

export type RiskForm = AdolescentRiskForm | PregnantRiskForm

interface ScreeningRecordBase {
  id: AnonymousScreeningId
  siteId: string
  startedAt: IsoTimestamp
  targetGroup: TargetGroup
  riskForm: RiskForm
  imageQuality: Record<ImageModality, ImageQuality>
  followUpStatus: FollowUpStatus
}

export interface CompletedScreeningRecord extends ScreeningRecordBase {
  completionState: 'completed'
  completedAt: IsoTimestamp
  durationSeconds: number
  riskScore: number
  riskLevel: RiskLevel
}

export interface IncompleteScreeningRecord extends ScreeningRecordBase {
  completionState: 'incomplete'
  completedAt?: never
  durationSeconds?: never
  riskScore?: never
  riskLevel?: never
}

export type ScreeningRecord = CompletedScreeningRecord | IncompleteScreeningRecord

export interface ModelMetrics {
  rocAuc?: number
  prAuc?: number
  sensitivity: number
  specificity: number
  npv?: number
  ppv?: number
  brier?: number
  overallAuc?: number
  indiaAuc?: number
  italyAuc?: number
}

export type EvidenceRole =
  | 'primary internal visual signal'
  | 'supporting signal'
  | 'rule-out support'
  | 'modular proof of concept with limited gain'
  | 'domain shift warning'

export type ValidationDesign = 'internal' | 'grouped-split' | 'external-stress-test'

export interface ModelEvidence {
  name: string
  modality: ImageModality | 'tabular' | 'fusion' | 'external'
  role: EvidenceRole
  validation: {
    design: ValidationDesign
    dataset: string
  }
  metrics: ModelMetrics
}

export type ModelEvidenceKey = 'eye' | 'nail' | 'tabular' | 'fusion' | 'external'

export type ModelEvidenceRegistry = Record<ModelEvidenceKey, ModelEvidence>
