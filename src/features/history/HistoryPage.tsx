import React, { useState, useMemo } from 'react'
import { Download, FlaskConical, Search } from 'lucide-react'
import { screeningStore } from '../../lib/storage'
import { exportToCsv } from '../../lib/exportCsv'
import { DEMO_DATA_LABEL, DEMO_SCREENINGS } from '../../data/demoScreenings'
import type { FollowUpStatus, RiskLevel, ScreeningRecord } from '../../domain/types'

// ── Constants ────────────────────────────────────────────────────────────────

const RISK_LEVEL_LABEL: Record<RiskLevel, string> = {
  low: 'Rendah',
  moderate: 'Sedang',
  high: 'Tinggi',
}

const FOLLOW_UP_LABEL: Record<FollowUpStatus, string> = {
  'not-required': 'Tidak perlu',
  recommended: 'Direkomendasikan',
  scheduled: 'Terjadwal',
  completed: 'Selesai',
  'lost-to-follow-up': 'Tidak terpantau',
}

const TARGET_GROUP_LABEL: Record<string, string> = {
  adolescent: 'Remaja',
  pregnant: 'Hamil',
}

const ALL_FOLLOW_UP_STATUSES: FollowUpStatus[] = [
  'not-required',
  'recommended',
  'scheduled',
  'completed',
  'lost-to-follow-up',
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// ── Row component ────────────────────────────────────────────────────────────

interface HistoryRowProps {
  record: ScreeningRecord
  isDemo: boolean
  rowStyle?: React.CSSProperties
  onFollowUpChange?: (id: string, status: FollowUpStatus) => void
}

function HistoryRow({ record, isDemo, rowStyle, onFollowUpChange }: HistoryRowProps) {
  const riskLevel =
    record.completionState === 'completed' ? record.riskLevel : undefined

  const riskBadgeClass =
    riskLevel === 'high'
      ? 'badge badge-high'
      : riskLevel === 'moderate'
      ? 'badge badge-moderate'
      : riskLevel === 'low'
      ? 'badge badge-low'
      : 'badge'

  return (
    <tr style={rowStyle}>
      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{record.id}</td>
      <td>{formatDate(record.startedAt)}</td>
      <td>{TARGET_GROUP_LABEL[record.targetGroup] ?? record.targetGroup}</td>
      <td>
        {riskLevel ? (
          <span className={riskBadgeClass}>{RISK_LEVEL_LABEL[riskLevel]}</span>
        ) : (
          <span className="badge" style={{ color: '#6b7280' }}>Tidak lengkap</span>
        )}
      </td>
      <td>
        <span
          className="badge"
          style={{
            background:
              record.completionState === 'completed' ? '#d1fae5' : '#fef3c7',
            color:
              record.completionState === 'completed' ? '#065f46' : '#92400e',
          }}
        >
          {record.completionState === 'completed' ? 'Selesai' : 'Tidak Lengkap'}
        </span>
      </td>
      <td>
        {isDemo ? (
          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
            {FOLLOW_UP_LABEL[record.followUpStatus]}
          </span>
        ) : (
          <select
            className="form-select"
            value={record.followUpStatus}
            onChange={(e) =>
              onFollowUpChange?.(record.id, e.target.value as FollowUpStatus)
            }
            style={{ fontSize: '0.8rem', padding: '2px 4px' }}
          >
            {ALL_FOLLOW_UP_STATUSES.map((s) => (
              <option key={s} value={s}>
                {FOLLOW_UP_LABEL[s]}
              </option>
            ))}
          </select>
        )}
      </td>
    </tr>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

export function HistoryPage() {
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState<'all' | RiskLevel>('all')
  const [showDemo, setShowDemo] = useState(false)
  const [realRecords, setRealRecords] = useState<ScreeningRecord[]>(() =>
    screeningStore.list(),
  )

  function handleFollowUpChange(id: string, status: FollowUpStatus) {
    screeningStore.update(id, { followUpStatus: status })
    setRealRecords(screeningStore.list())
  }

  function handleExport() {
    const records = showDemo
      ? [...realRecords, ...(DEMO_SCREENINGS as ScreeningRecord[])]
      : realRecords
    exportToCsv(records, 'anemia_scan_riwayat.csv')
  }

  const demoRecords = DEMO_SCREENINGS as ScreeningRecord[]

  const displayedRecords = useMemo(() => {
    const base = showDemo ? [...realRecords, ...demoRecords] : realRecords
    return base.filter((r) => {
      const matchesSite =
        search.trim() === '' ||
        r.siteId.toLowerCase().includes(search.toLowerCase())
      const matchesRisk =
        riskFilter === 'all' ||
        (r.completionState === 'completed' && r.riskLevel === riskFilter)
      return matchesSite && matchesRisk
    })
  }, [realRecords, showDemo, search, riskFilter, demoRecords])

  return (
    <div className="stack">
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">Riwayat Skrining</h1>
        <p className="page-subtitle">
          Daftar sesi skrining yang tersimpan. Gunakan filter untuk mempersempit
          hasil pencarian.
        </p>
      </div>

      {/* Toolbar */}
      <div className="card">
        <div
          className="row"
          style={{ gap: 10, flexWrap: 'wrap', alignItems: 'center' }}
        >
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 180px', minWidth: 160 }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
              }}
            />
            <input
              className="form-input"
              type="text"
              placeholder="Cari Site ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 30 }}
            />
          </div>

          {/* Risk filter */}
          <select
            className="form-select"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as 'all' | RiskLevel)}
            style={{ flex: '0 0 auto' }}
          >
            <option value="all">Semua Risiko</option>
            <option value="low">Rendah</option>
            <option value="moderate">Sedang</option>
            <option value="high">Tinggi</option>
          </select>

          {/* Demo toggle */}
          <button
            className={showDemo ? 'btn btn-primary' : 'btn btn-ghost'}
            onClick={() => setShowDemo((v) => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <FlaskConical size={14} />
            {showDemo ? 'Sembunyikan demo' : 'Tampilkan data demo'}
          </button>

          {/* Export */}
          <button
            className="btn btn-ghost"
            onClick={handleExport}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>

        {/* Demo label */}
        {showDemo && (
          <p style={{ margin: '8px 0 0', fontSize: '0.78rem', color: '#6b7280' }}>
            <FlaskConical size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} />
            {DEMO_DATA_LABEL} — {demoRecords.length} catatan demo disertakan
          </p>
        )}
      </div>

      {/* Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        {displayedRecords.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 16px',
              color: '#6b7280',
            }}
          >
            <p style={{ margin: 0, fontWeight: 500 }}>Tidak ada data skrining</p>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>
              {realRecords.length === 0
                ? 'Belum ada sesi skrining tersimpan. Klik "Tampilkan data demo" untuk melihat contoh data.'
                : 'Tidak ada catatan yang cocok dengan filter yang dipilih.'}
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  textAlign: 'left',
                  color: '#6b7280',
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                <th style={{ padding: '8px 10px' }}>ID</th>
                <th style={{ padding: '8px 10px' }}>Tanggal</th>
                <th style={{ padding: '8px 10px' }}>Kelompok</th>
                <th style={{ padding: '8px 10px' }}>Risiko</th>
                <th style={{ padding: '8px 10px' }}>Status</th>
                <th style={{ padding: '8px 10px' }}>Tindak Lanjut</th>
              </tr>
            </thead>
            <tbody>
              {displayedRecords.map((r, i) => {
                const isDemo = !realRecords.some((rr) => rr.id === r.id)
                return (
                  <HistoryRow
                    key={r.id + String(i)}
                    record={r}
                    isDemo={isDemo}
                    rowStyle={{
                      borderBottom: '1px solid #f3f4f6',
                      background: isDemo ? '#fafaf5' : undefined,
                    }}
                    onFollowUpChange={handleFollowUpChange}
                  />
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: 0 }}>
        Menampilkan {displayedRecords.length} catatan
        {showDemo ? ` (termasuk ${demoRecords.length} data demo)` : ''}
      </p>
    </div>
  )
}
