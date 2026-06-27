import type { ModelEvidenceRegistry } from '../domain/types'

export const MODEL_EVIDENCE = {
  eye: {
    name: 'Eye CNN',
    modality: 'eye',
    role: 'primary internal visual signal',
    validation: {
      design: 'internal',
      dataset: 'CP-AnemiC',
    },
    metrics: {
      rocAuc: 0.9451,
      prAuc: 0.9678,
      sensitivity: 0.875,
      specificity: 0.814,
      brier: 0.094,
    },
  },
  nail: {
    name: 'Nail CNN grouped',
    modality: 'nail',
    role: 'supporting signal',
    validation: {
      design: 'grouped-split',
      dataset: 'Grouped split',
    },
    metrics: {
      rocAuc: 0.6209,
      prAuc: 0.7392,
      sensitivity: 0.7778,
      specificity: 0.3636,
      brier: 0.241,
    },
  },
  tabular: {
    name: 'NHANES LightGBM',
    modality: 'tabular',
    role: 'rule-out support',
    validation: {
      design: 'internal',
      dataset: 'NHANES',
    },
    metrics: {
      rocAuc: 0.6685,
      prAuc: 0.1887,
      sensitivity: 0.9037,
      specificity: 0.2195,
      npv: 0.9586,
      ppv: 0.1023,
      brier: 0.0785,
    },
  },
  fusion: {
    name: 'Classical late fusion',
    modality: 'fusion',
    role: 'modular proof of concept with limited gain',
    validation: {
      design: 'internal',
      dataset: 'Internal late-fusion evaluation',
    },
    metrics: {
      rocAuc: 0.8238,
      prAuc: 0.9022,
      sensitivity: 0.9062,
      specificity: 0.4186,
      npv: 0.75,
      ppv: 0.6988,
      brier: 0.2224,
    },
  },
  external: {
    name: 'External stress test',
    modality: 'external',
    role: 'domain shift warning',
    validation: {
      design: 'external-stress-test',
      dataset: 'India and Italy cohorts',
    },
    metrics: {
      overallAuc: 0.4401,
      indiaAuc: 0.4905,
      italyAuc: 0.2818,
      sensitivity: 1,
      specificity: 0,
    },
  },
} as const satisfies ModelEvidenceRegistry

export const MODEL_EVIDENCE_CAVEATS = [
  'Hasil skrining ini bukan diagnosis medis.',
  'Validasi lokal pada populasi Indonesia diperlukan sebelum penggunaan klinis.',
  'Fusion belum terbukti lebih unggul daripada model terbaik secara konsisten.',
] as const
