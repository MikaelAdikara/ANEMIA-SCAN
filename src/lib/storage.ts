import type { ScreeningRecord } from '../domain/types'

const STORAGE_KEY = 'anemia_scan_records'

function parseRecords(raw: string | null): ScreeningRecord[] {
  if (!raw) return []
  try { return JSON.parse(raw) as ScreeningRecord[] } catch { return [] }
}

export interface ScreeningStore {
  list(): ScreeningRecord[]
  add(record: ScreeningRecord): void
  update(id: string, patch: Partial<ScreeningRecord>): void
  remove(id: string): void
  clear(): void
}

export function createScreeningStore(storage: Storage = localStorage): ScreeningStore {
  let memoryFallback: ScreeningRecord[] = []
  let useMemory = false

  function safeGet(): ScreeningRecord[] {
    if (useMemory) return memoryFallback
    try {
      return parseRecords(storage.getItem(STORAGE_KEY))
    } catch {
      useMemory = true
      return memoryFallback
    }
  }

  function safeSet(records: ScreeningRecord[]): void {
    if (useMemory) { memoryFallback = records; return }
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(records))
    } catch {
      useMemory = true
      memoryFallback = records
    }
  }

  return {
    list: () => safeGet(),
    add: (record) => safeSet([record, ...safeGet()]),
    update: (id, patch) =>
      safeSet(
        safeGet().map((r) =>
          r.id === id ? ({ ...r, ...patch } as ScreeningRecord) : r,
        ),
      ),
    remove: (id) => safeSet(safeGet().filter((r) => r.id !== id)),
    clear: () => safeSet([]),
  }
}

export const screeningStore = createScreeningStore()
