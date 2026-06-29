import { AlertTriangle, ShieldAlert } from 'lucide-react'
import { MODEL_EVIDENCE, MODEL_EVIDENCE_CAVEATS } from '../../data/modelEvidence'
import type { ModelEvidenceKey } from '../../domain/types'

// ── Helpers ──────────────────────────────────────────────────────────────────

function pct(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

function aucDisplay(value: number) {
  return value.toFixed(4)
}

function aucColor(auc: number): string {
  if (auc >= 0.8) return 'var(--color-clinical-700, #1e8449)'
  if (auc >= 0.6) return '#d68910'
  return '#c0392b'
}

const ROLE_LABEL: Record<string, string> = {
  'primary internal visual signal': 'Sinyal Visual Utama',
  'supporting signal': 'Sinyal Pendukung',
  'rule-out support': 'Pendukung Rule-out',
  'modular proof of concept with limited gain': 'Proof of Concept',
  'domain shift warning': 'Peringatan Domain Shift',
}

const DESIGN_LABEL: Record<string, string> = {
  internal: 'Validasi Internal',
  'grouped-split': 'Grouped Split',
  'external-stress-test': 'Stress Test Eksternal',
}

const MODEL_KEYS: ModelEvidenceKey[] = ['eye', 'nail', 'tabular', 'fusion', 'external']

// ── Component ────────────────────────────────────────────────────────────────

export function EvidencePage() {
  const external = MODEL_EVIDENCE.external

  return (
    <div className="page page-in">
      {/* Page heading */}
      <header className="page-heading">
        <div>
          <span className="eyebrow">Insight / Bukti Model</span>
          <h1>Kinerja Model</h1>
          <p style={{ margin: 0, color: 'var(--color-ink-secondary)', fontSize: '0.9rem' }}>
            Ringkasan kinerja dan validasi model skrining anemia berbasis gambar dan data klinis.
          </p>
        </div>
        <span className="page-heading__status">Prototipe Riset</span>
      </header>

      {/* External stress test danger banner */}
      <div
        className="alert alert-danger"
        style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 'var(--space-5)' }}
      >
        <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <strong>Peringatan Domain Shift Eksternal</strong>
          <p style={{ margin: '4px 0 0' }}>
            Uji stres pada kohort India dan Italia menghasilkan AUC keseluruhan{' '}
            <strong>{aucDisplay(external.metrics.overallAuc ?? 0)}</strong> (India:{' '}
            {aucDisplay(external.metrics.indiaAuc ?? 0)}, Italia:{' '}
            {aucDisplay(external.metrics.italyAuc ?? 0)}). Model belum siap untuk populasi
            di luar domain pelatihan tanpa <strong>validasi lokal Indonesia</strong>.
          </p>
        </div>
      </div>

      {/* Model metric cards — auto-fill grid handles 5 cards gracefully */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
        }}
      >
        {MODEL_KEYS.map((key) => {
          const m = MODEL_EVIDENCE[key]
          const auc =
            'overallAuc' in m.metrics && m.metrics.overallAuc != null
              ? m.metrics.overallAuc
              : 'rocAuc' in m.metrics
              ? m.metrics.rocAuc
              : undefined

          const npv = 'npv' in m.metrics && m.metrics.npv != null ? m.metrics.npv : undefined

          return (
            <div className="card" key={key}>
              {/* Card header: name + role badge */}
              <div className="card-header" style={{ flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                <span className="card-title">{m.name}</span>
                <span className="badge badge-info">{ROLE_LABEL[m.role] ?? m.role}</span>
              </div>

              {/* Validation design badge */}
              <div style={{ marginBottom: 10 }}>
                <span
                  className="badge"
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-ink-secondary)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.02em',
                  }}
                >
                  {DESIGN_LABEL[m.validation.design] ?? m.validation.design}
                  {' — '}
                  {m.validation.dataset}
                </span>
              </div>

              {/* ROC-AUC prominent display */}
              {auc != null && (
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-ink-muted)', fontWeight: 600 }}>
                    ROC-AUC
                  </span>
                  <p
                    style={{
                      fontSize: '2.2rem',
                      fontWeight: 800,
                      margin: '2px 0 0',
                      lineHeight: 1,
                      color: aucColor(auc),
                    }}
                  >
                    {aucDisplay(auc)}
                  </p>

                  {/* AUC progress bar */}
                  <div className="progress-bar-track" style={{ marginTop: 8 }}>
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.min(auc * 100, 100)}%`,
                        background: aucColor(auc),
                      }}
                    />
                  </div>
                </div>
              )}

              {/* External AUC breakdown (only for external key) */}
              {key === 'external' && (
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 10 }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-ink-muted)', fontWeight: 600 }}>
                      AUC India
                    </span>
                    <p style={{ margin: '2px 0 0', fontWeight: 600 }}>
                      {aucDisplay(external.metrics.indiaAuc ?? 0)}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-ink-muted)', fontWeight: 600 }}>
                      AUC Italia
                    </span>
                    <p style={{ margin: '2px 0 0', fontWeight: 600 }}>
                      {aucDisplay(external.metrics.italyAuc ?? 0)}
                    </p>
                  </div>
                </div>
              )}

              {/* Stat rows */}
              <div className="stack-sm">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>Sensitivitas</span>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{pct(m.metrics.sensitivity)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>Spesifisitas</span>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{pct(m.metrics.specificity)}</span>
                </div>
                {npv != null && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>NPV</span>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{pct(npv)}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Caveats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-5)' }}>
        {MODEL_EVIDENCE_CAVEATS.slice(0, 3).map((caveat, i) => (
          <div
            className="alert alert-warning"
            key={i}
            style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}
          >
            <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 2, color: '#d68910' }} />
            <p style={{ margin: 0 }}>{caveat}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p
        style={{
          fontSize: '0.78rem',
          color: 'var(--color-ink-muted)',
          fontStyle: 'italic',
          margin: 'var(--space-4) 0 0',
          paddingTop: 4,
        }}
      >
        Diperlukan <strong>validasi lokal Indonesia</strong> sebelum penggunaan klinis apa pun.
        Hasil skrining ini <strong>bukan diagnosis medis</strong>.
      </p>
    </div>
  )
}
