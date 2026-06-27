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
    <div className="stack">
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">Bukti Penelitian Model</h1>
        <p className="page-subtitle">
          Ringkasan kinerja dan validasi model skrining anemia — bukan diagnosis medis.
          Diperlukan validasi lokal Indonesia sebelum penggunaan klinis.
        </p>
      </div>

      {/* Domain-shift warning banner */}
      <div className="alert alert-warning" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
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

      {/* Model metric cards */}
      <div className="grid-2">
        {MODEL_KEYS.map((key) => {
          const m = MODEL_EVIDENCE[key]
          const auc =
            'overallAuc' in m.metrics && m.metrics.overallAuc != null
              ? m.metrics.overallAuc
              : 'rocAuc' in m.metrics
              ? m.metrics.rocAuc
              : undefined

          return (
            <div className="card" key={key}>
              <div className="card-header" style={{ flexWrap: 'wrap', gap: 6 }}>
                <span className="card-title">{m.name}</span>
                <span className="badge badge-info">{ROLE_LABEL[m.role] ?? m.role}</span>
              </div>

              {/* AUC prominent display */}
              {auc != null && (
                <div style={{ margin: '8px 0' }}>
                  <span className="label">ROC-AUC</span>
                  <p
                    style={{
                      fontSize: '1.75rem',
                      fontWeight: 700,
                      margin: '2px 0 0',
                      color: auc >= 0.8 ? '#1e8449' : auc >= 0.6 ? '#d68910' : '#c0392b',
                    }}
                  >
                    {aucDisplay(auc)}
                  </p>
                </div>
              )}

              {/* Sensitivity / Specificity */}
              <div className="row" style={{ gap: 20, flexWrap: 'wrap', marginTop: 4 }}>
                <div>
                  <span className="label">Sensitivitas</span>
                  <p style={{ margin: '2px 0 0', fontWeight: 600 }}>
                    {pct(m.metrics.sensitivity)}
                  </p>
                </div>
                <div>
                  <span className="label">Spesifisitas</span>
                  <p style={{ margin: '2px 0 0', fontWeight: 600 }}>
                    {pct(m.metrics.specificity)}
                  </p>
                </div>
                {'npv' in m.metrics && m.metrics.npv != null && (
                  <div>
                    <span className="label">NPV</span>
                    <p style={{ margin: '2px 0 0', fontWeight: 600 }}>
                      {pct(m.metrics.npv)}
                    </p>
                  </div>
                )}
              </div>

              {/* External AUC breakdown (only for external key) */}
              {key === 'external' && (
                <div className="row" style={{ gap: 20, flexWrap: 'wrap', marginTop: 8 }}>
                  <div>
                    <span className="label">AUC India</span>
                    <p style={{ margin: '2px 0 0', fontWeight: 600 }}>
                      {aucDisplay(external.metrics.indiaAuc ?? 0)}
                    </p>
                  </div>
                  <div>
                    <span className="label">AUC Italia</span>
                    <p style={{ margin: '2px 0 0', fontWeight: 600 }}>
                      {aucDisplay(external.metrics.italyAuc ?? 0)}
                    </p>
                  </div>
                </div>
              )}

              {/* Validation design */}
              <div style={{ marginTop: 10 }}>
                <span className="label">Desain Validasi</span>
                <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
                  {DESIGN_LABEL[m.validation.design] ?? m.validation.design} —{' '}
                  {m.validation.dataset}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Caveats */}
      <div className="card">
        <div className="card-header">
          <AlertTriangle size={16} style={{ color: '#d68910' }} />
          <span className="card-title">Catatan Penting</span>
        </div>
        <div className="stack" style={{ gap: 8 }}>
          {MODEL_EVIDENCE_CAVEATS.map((caveat, i) => (
            <div className="alert alert-warning" key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ margin: 0 }}>{caveat}</p>
            </div>
          ))}
        </div>
        <p
          style={{
            marginTop: 12,
            fontSize: '0.8rem',
            color: '#6b7280',
            fontStyle: 'italic',
          }}
        >
          Hasil skrining ini <strong>bukan diagnosis</strong> medis. Validasi lokal Indonesia
          wajib dilakukan sebelum penggunaan klinis apa pun.
        </p>
      </div>
    </div>
  )
}
