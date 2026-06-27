import type { ScreeningRecord } from '../domain/types'

export function toCsvCell(value: unknown): string {
  const str = String(value ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}

const CSV_HEADERS = [
  'id', 'source', 'siteId', 'targetGroup', 'startedAt', 'completedAt',
  'completionState', 'riskLevel', 'riskScore', 'followUpStatus',
  'eyeQuality', 'nailQuality', 'durationSeconds',
]

export function exportToCsv(records: ScreeningRecord[], filename = 'anemia_scan_export.csv'): void {
  const rows: string[][] = [CSV_HEADERS]

  for (const r of records) {
    rows.push([
      r.id,
      'DEMO_SYNTHETIC',
      r.siteId,
      r.targetGroup,
      r.startedAt,
      r.completionState === 'completed' ? r.completedAt : '',
      r.completionState,
      r.completionState === 'completed' ? r.riskLevel : '',
      r.completionState === 'completed' ? String(r.riskScore) : '',
      r.followUpStatus,
      r.imageQuality.eye,
      r.imageQuality.nail,
      r.completionState === 'completed' ? String(r.durationSeconds) : '',
    ].map(toCsvCell))
  }

  const csv = rows.map((r) => r.join(',')).join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
