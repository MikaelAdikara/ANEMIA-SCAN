import { describe, expect, it } from 'vitest'

import { DEMO_DATA_LABEL, DEMO_SCREENINGS } from './demoScreenings'
import { MODEL_EVIDENCE, MODEL_EVIDENCE_CAVEATS } from './modelEvidence'

describe('MODEL_EVIDENCE', () => {
  it('preserves every verified metric exactly', () => {
    expect(MODEL_EVIDENCE.eye.metrics).toEqual({
      rocAuc: 0.9451,
      prAuc: 0.9678,
      sensitivity: 0.875,
      specificity: 0.814,
      brier: 0.094,
    })
    expect(MODEL_EVIDENCE.nail.metrics).toEqual({
      rocAuc: 0.6209,
      prAuc: 0.7392,
      sensitivity: 0.7778,
      specificity: 0.3636,
      brier: 0.241,
    })
    expect(MODEL_EVIDENCE.tabular.metrics).toEqual({
      rocAuc: 0.6685,
      prAuc: 0.1887,
      sensitivity: 0.9037,
      specificity: 0.2195,
      npv: 0.9586,
      ppv: 0.1023,
      brier: 0.0785,
    })
    expect(MODEL_EVIDENCE.fusion.metrics).toEqual({
      rocAuc: 0.8238,
      prAuc: 0.9022,
      sensitivity: 0.9062,
      specificity: 0.4186,
      npv: 0.75,
      ppv: 0.6988,
      brier: 0.2224,
    })
    expect(MODEL_EVIDENCE.external.metrics).toEqual({
      overallAuc: 0.4401,
      indiaAuc: 0.4905,
      italyAuc: 0.2818,
      sensitivity: 1,
      specificity: 0,
    })
  })

  it('preserves component roles, modalities, and validation metadata', () => {
    const metadata = Object.fromEntries(
      Object.entries(MODEL_EVIDENCE).map(([key, evidence]) => [
        key,
        {
          modality: evidence.modality,
          role: evidence.role,
          validation: evidence.validation,
        },
      ]),
    )

    expect(metadata).toEqual({
      eye: {
        modality: 'eye',
        role: 'primary internal visual signal',
        validation: { design: 'internal', dataset: 'CP-AnemiC' },
      },
      nail: {
        modality: 'nail',
        role: 'supporting signal',
        validation: { design: 'grouped-split', dataset: 'Grouped split' },
      },
      tabular: {
        modality: 'tabular',
        role: 'rule-out support',
        validation: { design: 'internal', dataset: 'NHANES' },
      },
      fusion: {
        modality: 'fusion',
        role: 'modular proof of concept with limited gain',
        validation: { design: 'internal', dataset: 'Internal late-fusion evaluation' },
      },
      external: {
        modality: 'external',
        role: 'domain shift warning',
        validation: { design: 'external-stress-test', dataset: 'India and Italy cohorts' },
      },
    })
  })

  it('states the required safety caveats explicitly', () => {
    expect(MODEL_EVIDENCE_CAVEATS).toEqual([
      'Hasil skrining ini bukan diagnosis medis.',
      'Validasi lokal pada populasi Indonesia diperlukan sebelum penggunaan klinis.',
      'Fusion belum terbukti lebih unggul daripada model terbaik secara konsisten.',
    ])
    expect(MODEL_EVIDENCE_CAVEATS.some((caveat) => /bukan diagnosis/i.test(caveat))).toBe(true)
    expect(
      MODEL_EVIDENCE_CAVEATS.some((caveat) => /validasi lokal.*Indonesia/i.test(caveat)),
    ).toBe(true)
  })
})

describe('demo screenings', () => {
  it('uses the stable synthetic-data label', () => {
    expect(DEMO_DATA_LABEL).toBe('Data demo sintetis')
  })

  it('contains exactly 30 deterministic records', () => {
    expect(DEMO_SCREENINGS).toHaveLength(30)
    expect(DEMO_SCREENINGS.map(({ id }) => id)).toEqual(
      Array.from({ length: 30 }, (_, index) => `SCR-${String(index + 1).padStart(4, '0')}`),
    )
    expect(DEMO_SCREENINGS[0]?.startedAt).toBe('2026-06-26T08:05:00+07:00')
    expect(DEMO_SCREENINGS.at(-1)?.startedAt).toBe('2026-06-05T11:40:00+07:00')
  })

  it('allows only the anonymous screening schema and group-specific risk fields', () => {
    const baseRecordKeys = [
      'completionState',
      'followUpStatus',
      'id',
      'imageQuality',
      'riskForm',
      'siteId',
      'startedAt',
      'targetGroup',
    ]
    const completedRecordKeys = [
      ...baseRecordKeys,
      'completedAt',
      'durationSeconds',
      'riskLevel',
      'riskScore',
    ].sort()
    const commonRiskFormKeys = [
      'ageYears',
      'animalProteinServingsPerWeek',
      'ironSupplementUse',
      'previousAnemia',
      'recentBleeding',
      'symptoms',
      'targetGroup',
    ]
    const symptomKeys = ['dizziness', 'fatigue', 'shortnessOfBreath', 'visiblePallor']
    const ids = DEMO_SCREENINGS.map(({ id }) => id)

    expect(new Set(ids).size).toBe(ids.length)
    ids.forEach((id) => expect(id).toMatch(/^SCR-\d{4}$/))

    DEMO_SCREENINGS.forEach((record) => {
      const expectedRecordKeys =
        record.completionState === 'completed' ? completedRecordKeys : baseRecordKeys
      const groupRiskFormKeys =
        record.targetGroup === 'adolescent'
          ? ['heavyMenstrualBleeding', 'menstruates']
          : ['gestationalAgeWeeks', 'muacCategory', 'parity']

      expect(Object.keys(record).sort()).toEqual(expectedRecordKeys)
      expect(Object.keys(record.riskForm).sort()).toEqual(
        [...commonRiskFormKeys, ...groupRiskFormKeys].sort(),
      )
      expect(Object.keys(record.riskForm.symptoms).sort()).toEqual(symptomKeys)
      expect(Object.keys(record.imageQuality).sort()).toEqual(['eye', 'nail'])
      expect(record.riskForm.targetGroup).toBe(record.targetGroup)
    })
  })

  it('omits finalized risk output from incomplete records', () => {
    const incompleteRecords = DEMO_SCREENINGS.filter(
      (record) => record.completionState === 'incomplete',
    )

    expect(incompleteRecords.length).toBeGreaterThan(0)
    incompleteRecords.forEach((record) => {
      expect(record).not.toHaveProperty('completedAt')
      expect(record).not.toHaveProperty('durationSeconds')
      expect(record).not.toHaveProperty('riskScore')
      expect(record).not.toHaveProperty('riskLevel')
    })
  })

  it('requires a finite MUAC category for every pregnant risk form', () => {
    const muacCategories = new Set(
      DEMO_SCREENINGS.filter((record) => record.targetGroup === 'pregnant').map(
        (record) =>
          'muacCategory' in record.riskForm ? record.riskForm.muacCategory : undefined,
      ),
    )

    expect(muacCategories).toEqual(new Set(['below-23.5-cm', 'at-or-above-23.5-cm']))
  })

  it('matches every completed duration to its timestamps', () => {
    const completedRecords = DEMO_SCREENINGS.filter(
      (record) => record.completionState === 'completed',
    )

    completedRecords.forEach((record) => {
      const elapsedSeconds =
        (Date.parse(record.completedAt) - Date.parse(record.startedAt)) / 1_000

      expect(record.durationSeconds, record.id).toBe(elapsedSeconds)
    })
  })

  it('provides plausible variety for charts and history', () => {
    const valuesOf = <Key extends 'targetGroup' | 'completionState' | 'siteId' | 'followUpStatus'>(
      key: Key,
    ) =>
      new Set(DEMO_SCREENINGS.map((record) => record[key]))
    const completedRecords = DEMO_SCREENINGS.filter(
      (record) => record.completionState === 'completed',
    )

    expect(valuesOf('targetGroup')).toEqual(new Set(['adolescent', 'pregnant']))
    expect(new Set(completedRecords.map((record) => record.riskLevel))).toEqual(
      new Set(['low', 'moderate', 'high']),
    )
    expect(valuesOf('completionState')).toEqual(new Set(['completed', 'incomplete']))
    expect(valuesOf('siteId').size).toBeGreaterThanOrEqual(3)
    expect(valuesOf('followUpStatus').size).toBeGreaterThanOrEqual(4)

    DEMO_SCREENINGS.forEach((record) => {
      expect(Date.parse(record.startedAt)).not.toBeNaN()
      expect(record.startedAt >= '2026-06-01T00:00:00+07:00').toBe(true)
      expect(record.startedAt <= '2026-06-27T23:59:59+07:00').toBe(true)
      expect(record.riskForm.targetGroup).toBe(record.targetGroup)

      if (record.completionState === 'completed') {
        expect(record.durationSeconds).toBeGreaterThanOrEqual(90)
        expect(record.durationSeconds).toBeLessThanOrEqual(900)
        expect(record.riskScore).toBeGreaterThanOrEqual(0)
        expect(record.riskScore).toBeLessThanOrEqual(1)
      }
    })
  })
})
