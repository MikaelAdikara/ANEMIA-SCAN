import { describe, expect, it } from 'vitest'

import { MODEL_EVIDENCE } from './modelEvidence'

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
})

describe('demo screenings', () => {
  it('uses the stable synthetic-data label', async () => {
    const { DEMO_DATA_LABEL } = await import('./demoScreenings')

    expect(DEMO_DATA_LABEL).toBe('Data demo sintetis')
  })

  it('contains exactly 30 deterministic records', async () => {
    const { DEMO_SCREENINGS } = await import('./demoScreenings')

    expect(DEMO_SCREENINGS).toHaveLength(30)
    expect(DEMO_SCREENINGS.map(({ id }) => id)).toEqual(
      Array.from({ length: 30 }, (_, index) => `SCR-${String(index + 1).padStart(4, '0')}`),
    )
    expect(DEMO_SCREENINGS[0]?.startedAt).toBe('2026-06-26T08:05:00+07:00')
    expect(DEMO_SCREENINGS.at(-1)?.startedAt).toBe('2026-06-05T11:40:00+07:00')
  })

  it('keeps records anonymous and excludes image payloads', async () => {
    const { DEMO_SCREENINGS } = await import('./demoScreenings')
    const forbiddenKeys = new Set([
      'name',
      'fullName',
      'phone',
      'phoneNumber',
      'address',
      'nik',
      'image',
      'imageBlob',
      'imageData',
    ])

    const collectKeys = (value: unknown): string[] => {
      if (Array.isArray(value)) return value.flatMap(collectKeys)
      if (value === null || typeof value !== 'object') return []

      return Object.entries(value).flatMap(([key, nestedValue]) => [key, ...collectKeys(nestedValue)])
    }

    const ids = DEMO_SCREENINGS.map(({ id }) => id)
    expect(new Set(ids).size).toBe(ids.length)
    ids.forEach((id) => expect(id).toMatch(/^SCR-\d{4}$/))
    collectKeys(DEMO_SCREENINGS).forEach((key) => expect(forbiddenKeys.has(key)).toBe(false))
  })

  it('provides plausible variety for charts and history', async () => {
    const { DEMO_SCREENINGS } = await import('./demoScreenings')
    const valuesOf = <Key extends keyof (typeof DEMO_SCREENINGS)[number]>(key: Key) =>
      new Set(DEMO_SCREENINGS.map((record) => record[key]))

    expect(valuesOf('targetGroup')).toEqual(new Set(['adolescent', 'pregnant']))
    expect(valuesOf('riskLevel')).toEqual(new Set(['low', 'moderate', 'high']))
    expect(valuesOf('completionState')).toEqual(new Set(['completed', 'incomplete']))
    expect(valuesOf('siteId').size).toBeGreaterThanOrEqual(3)
    expect(valuesOf('followUpStatus').size).toBeGreaterThanOrEqual(4)

    DEMO_SCREENINGS.forEach((record) => {
      expect(Date.parse(record.startedAt)).not.toBeNaN()
      expect(record.startedAt >= '2026-06-01T00:00:00+07:00').toBe(true)
      expect(record.startedAt <= '2026-06-27T23:59:59+07:00').toBe(true)
      expect(record.durationSeconds).toBeGreaterThanOrEqual(90)
      expect(record.durationSeconds).toBeLessThanOrEqual(900)
      expect(record.riskScore).toBeGreaterThanOrEqual(0)
      expect(record.riskScore).toBeLessThanOrEqual(1)
      expect(record.riskForm.targetGroup).toBe(record.targetGroup)
      expect(record.completedAt === null).toBe(record.completionState === 'incomplete')
    })
  })
})
