import React, { useState, useMemo } from 'react'
import { Download, FlaskConical, Inbox, Search } from 'lucide-react'
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

// ── Table styles (inline, consistent) ────────────────────────────────────────

const thStyle: React.CSSProperties = {
  padding: '10px 14px',
  textAlign: 'left',
  fontSize: '10px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  color: 'var(--color-ink-muted)',
  borderBottom: '1px solid var(--color-border)',
  whiteSpace: 'nowrap',
}

const tdStyle: React.CSSProperties = {
  padding: '10px 14px',
  fontSize: '13px',
  verticalAlign: 'middle',
}

// ── Row component ────────────────────────────────────────────────────────────

interface HistoryRowProps {
  record: ScreeningRecord
  isDemo: boolean
  zebra: boolean
  onFollowUpChange?: (id: string, status: FollowUpStatus) => void
}

function HistoryRow({ record, isDemo, zebra, onFollowUpChange }: HistoryRowProps) {
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

  const rowBg = zebra
    ? 'var(--color-surface-subtle)'
    : 'var(--color-surface)'

  return (
    <tr style={{ borderBottom: '1px solid var(--color-border)', background: rowBg }}>
      {/* ID */}
      <td
        style={{
          ...tdStyle,
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--color-ink-secondary)',
        }}
      >
        {record.id}
        {isDemo && (
          <span
            className="badge badge-demo"
            style={{ marginLeft: 6, fontSize: '0.65rem', verticalAlign: 'middle' }}
          >
            DEMO
          </span>
        )}
      </td>

      {/* Date */}
      <td style={tdStyle}>{formatDate(record.startedAt)}</td>

      {/* Kelompok */}
      <td style={tdStyle}>{TARGET_GROUP_LABEL[record.targetGroup] ?? record.targetGroup}</td>

      {/* Risk badge */}
      <td style={tdStyle}>
        {riskLevel ? (
          <span className={riskBadgeClass}>{RISK_LEVEL_LABEL[riskLevel]}</span>
        ) : (
          <span className="badge" style={{ color: 'var(--color-ink-muted)' }}>—</span>
        )}
      </td>

      {/* Completion status */}
      <td style={tdStyle}>
        <span
          className="badge"
          style={{
            background: record.completionState === 'completed' ? '#d1fae5' : '#fef3c7',
            color: record.completionState === 'completed' ? '#065f46' : '#92400e',
          }}
        >
          {record.completionState === 'completed' ? 'Selesai' : 'Tidak Lengkap'}
        </span>
      </td>

      {/* Follow-up */}
      <td style={tdStyle}>
        {isDemo ? (
          <span style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>
            {FOLLOW_UP_LABEL[record.followUpStatus]}
          </span>
        ) : (
          <select
            className="form-select"
            value={record.followUpStatus}
            onChange={(e) => onFollowUpChange?.(record.id, e.target.value as FollowUpStatus)}
            style={{ fontSize: '0.8rem', padding: '2px 6px' }}
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
    exportToCsv(displayedRecords, 'anemia_scan_riwayat.csv')
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

  const hasNoRealRecords = realRecords.length === 0

  return (
    <div className="page page-in">
      {/* Page heading */}
      <header className="page-heading">
        <div>
          <span className="eyebrow">Workspace / Riwayat</span>
          <h1>Riwayat Skrining</h1>
        </div>
        <span className="page-heading__status">
          {displayedRecords.length} catatan
        </span>
      </header>

      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-2)',
          alignItems: 'center',
          marginBottom: 'var(--space-4)',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 160 }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-ink-muted)',
              pointerEvents: 'none',
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
          style={{ flex: '0 0 auto', minWidth: 140 }}
        >
          <option value="all">Semua Risiko</option>
          <option value="low">Rendah</option>
          <option value="moderate">Sedang</option>
          <option value="high">Tinggi</option>
        </select>

        {/* Demo toggle */}
        <button
          type="button"
          className={showDemo ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
          onClick={() => setShowDemo((v) => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <FlaskConical size={13} />
          {showDemo ? 'Sembunyikan demo' : 'Tampilkan data demo'}
        </button>

        {/* Export CSV */}
        <button
          type="button"
          className="btn btn-sm btn-ghost"
          onClick={handleExport}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Download size={13} />
          Export CSV
        </button>
      </div>

      {/* Demo notice */}
      {showDemo && (
        <div className="alert alert-info" style={{ fontSize: '0.82rem', marginBottom: 'var(--space-3)' }}>
          <FlaskConical size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          {DEMO_DATA_LABEL} — {demoRecords.length} catatan demo disertakan
        </div>
      )}

      {/* Empty workspace (no real records, demo off) */}
      {!showDemo && hasNoRealRecords ? (
        <div className="empty-workspace" style={{ textAlign: 'center', padding: 'var(--space-10) var(--space-4)' }}>
          <Inbox
            size={40}
            strokeWidth={1.2}
            style={{ marginBottom: 12, color: 'var(--color-ink-muted)' }}
          />
          <h2 style={{ margin: '0 0 8px', fontSize: '1.1rem', color: 'var(--color-ink-secondary)' }}>
            Belum ada data skrining
          </h2>
          <p style={{ margin: '0 0 16px', fontSize: '0.875rem', maxWidth: 340, marginInline: 'auto' }}>
            Sesi skrining yang diselesaikan akan muncul di sini. Tampilkan data demo untuk melihat
            contoh tampilan riwayat.
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setShowDemo(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <FlaskConical size={13} />
            Tampilkan data demo
          </button>
        </div>
      ) : (
        <>
          {/* Records table */}
          <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
            {displayedRecords.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--color-ink-muted)' }}>
                <p style={{ margin: 0, fontWeight: 500 }}>
                  Tidak ada catatan yang cocok dengan filter.
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>
                  Coba ubah kata kunci pencarian atau filter risiko.
                </p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'var(--color-surface-subtle)' }}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Tanggal</th>
                    <th style={thStyle}>Kelompok</th>
                    <th style={thStyle}>Risiko</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Tindak Lanjut</th>
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
                        zebra={i % 2 === 1}
                        onFollowUpChange={handleFollowUpChange}
                      />
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer count */}
          <p style={{ fontSize: '12px', color: 'var(--color-ink-muted)', margin: 0 }}>
            Menampilkan {displayedRecords.length} catatan
            {showDemo ? ` (termasuk ${demoRecords.length} data demo)` : ''}
          </p>
        </>
      )}
    </div>
  )
}
