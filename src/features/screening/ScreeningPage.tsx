import { useState } from 'react'
import { Eye, Hand, ClipboardList, BarChart2, CheckCircle } from 'lucide-react'
import { CameraCapture } from './CameraCapture'
import { RiskForm } from './RiskForm'
import { ResultPanel } from './ResultPanel'
import { useScreeningDraft } from './useScreeningDraft'
import { estimatePrototypeRisk, type RiskEngineResult } from '../../lib/riskEngine'

type Tab = 'eye' | 'nail' | 'form' | 'result'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'eye', label: 'Foto Mata', icon: Eye },
  { id: 'nail', label: 'Foto Kuku', icon: Hand },
  { id: 'form', label: 'Formulir', icon: ClipboardList },
  { id: 'result', label: 'Hasil', icon: BarChart2 },
]

export function ScreeningPage() {
  const draft = useScreeningDraft()
  const [activeTab, setActiveTab] = useState<Tab>('eye')
  const [result, setResult] = useState<RiskEngineResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateResult = () => {
    if (!draft.eyeQuality || !draft.nailQuality) return
    try {
      const r = estimatePrototypeRisk({
        targetGroup: draft.form.targetGroup,
        symptoms: draft.form.symptoms,
        ironAdherence: draft.form.ironAdherence,
        dietRisk: draft.form.dietRisk,
        eyeQuality: draft.eyeQuality,
        nailQuality: draft.nailQuality,
        recentBleeding: draft.form.recentBleeding,
        previousAnemia: draft.form.previousAnemia,
      })
      setResult(r)
      setActiveTab('result')
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan')
    }
  }

  const reset = () => {
    draft.reset()
    setResult(null)
    setError(null)
    setActiveTab('eye')
  }

  const eyeDone = draft.eyeQuality?.eligible === true
  const nailDone = draft.nailQuality?.eligible === true
  const formDone = draft.form.ageYears > 0
  const canGenerate = eyeDone && nailDone && formDone

  return (
    <div className="page page-in">
      {/* Page heading */}
      <header className="page-heading">
        <div>
          <p className="eyebrow">Skrining / Modalitas</p>
          <h1>Skrining Anemia</h1>
          <p>Lengkapi tiga modalitas untuk mendapatkan estimasi risiko</p>
        </div>
      </header>

      {/* Two-column screening layout */}
      <div className="screening-layout">
        {/* Left column: tab navigator + content */}
        <div className="stack">
          {/* Tab bar */}
          <div className="tab-bar">
            {TABS.map(({ id, label, icon: Icon }) => {
              const done =
                id === 'eye'
                  ? eyeDone
                  : id === 'nail'
                  ? nailDone
                  : id === 'form'
                  ? formDone
                  : !!result
              const disabled = id === 'result' && !result

              return (
                <button
                  key={id}
                  type="button"
                  className={`tab-btn${activeTab === id ? ' is-active' : ''}`}
                  onClick={() => !disabled && setActiveTab(id)}
                  disabled={disabled}
                >
                  <Icon size={15} />
                  {label}
                  {done && id !== 'result' && <span className="tab-done" />}
                </button>
              )
            })}
          </div>

          {/* Tab content — Eye */}
          {activeTab === 'eye' && (
            <div className="setup-panel">
              <div className="panel-heading">
                <span className="panel-heading__icon">
                  <Eye size={16} />
                </span>
                <strong>Foto Konjungtiva Mata</strong>
              </div>
              <div style={{ padding: 'var(--space-4)' }}>
                <CameraCapture
                  label="Foto Konjungtiva Mata"
                  onCapture={(q) => {
                    draft.setEyeQuality(q)
                    if (q.eligible) setActiveTab('nail')
                  }}
                  captured={eyeDone}
                />
                {eyeDone && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: 'var(--space-3)' }}
                    onClick={() => setActiveTab('nail')}
                  >
                    Lanjut ke Foto Kuku →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Tab content — Nail */}
          {activeTab === 'nail' && (
            <div className="setup-panel">
              <div className="panel-heading">
                <span className="panel-heading__icon">
                  <Hand size={16} />
                </span>
                <strong>Foto Kuku Jari</strong>
              </div>
              <div style={{ padding: 'var(--space-4)' }}>
                <CameraCapture
                  label="Foto Kuku Jari"
                  onCapture={(q) => {
                    draft.setNailQuality(q)
                    if (q.eligible) setActiveTab('form')
                  }}
                  captured={nailDone}
                />
                {nailDone && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: 'var(--space-3)' }}
                    onClick={() => setActiveTab('form')}
                  >
                    Lanjut ke Formulir →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Tab content — Form */}
          {activeTab === 'form' && (
            <div className="setup-panel">
              <div className="panel-heading">
                <span className="panel-heading__icon">
                  <ClipboardList size={16} />
                </span>
                <strong>Formulir Klinis</strong>
              </div>
              <div style={{ padding: 'var(--space-4)' }}>
                <RiskForm form={draft.form} onChange={draft.setForm} />

                {!canGenerate && (
                  <div className="alert alert-info" style={{ marginTop: 'var(--space-3)' }}>
                    Lengkapi tiga modalitas (foto mata, foto kuku, dan formulir) untuk menghasilkan
                    estimasi.
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger" style={{ marginTop: 'var(--space-3)' }}>
                    {error}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab content — Result */}
          {activeTab === 'result' && result && (
            <ResultPanel result={result} form={draft.form} onReset={reset} />
          )}
        </div>

        {/* Right column: readiness panel */}
        <aside className="readiness-panel" style={{ position: 'sticky', top: 'var(--space-4)' }}>
          <div className="panel-heading">
            <span className="panel-heading__icon panel-heading__icon--green">
              <CheckCircle size={15} />
            </span>
            <strong>Kesiapan Skrining</strong>
          </div>

          {/* Checklist */}
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 var(--space-5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            <li>
              <ReadinessItem
                label="Foto Konjungtiva Mata"
                done={eyeDone}
                onClick={() => setActiveTab('eye')}
              />
            </li>
            <li>
              <ReadinessItem
                label="Foto Kuku Jari"
                done={nailDone}
                onClick={() => setActiveTab('nail')}
              />
            </li>
            <li>
              <ReadinessItem
                label="Formulir Klinis"
                done={formDone}
                onClick={() => setActiveTab('form')}
              />
            </li>
          </ul>

          {/* Progress bar */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: 'var(--color-ink-secondary)',
                marginBottom: 'var(--space-2)',
              }}
            >
              <span>Kelengkapan</span>
              <span>{[eyeDone, nailDone, formDone].filter(Boolean).length} / 3</span>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${([eyeDone, nailDone, formDone].filter(Boolean).length / 3) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Generate button */}
          <button
            type="button"
            className="btn btn-action btn-lg btn-full"
            onClick={generateResult}
            disabled={!canGenerate}
          >
            <BarChart2 size={16} />
            Hasilkan Estimasi
          </button>

          {/* Hint text when ready */}
          {canGenerate && (
            <p
              style={{
                fontSize: '0.72rem',
                color: 'var(--color-ink-muted)',
                textAlign: 'center',
                marginTop: 'var(--space-3)',
                lineHeight: 1.5,
              }}
            >
              Semua modalitas siap. Tekan tombol di atas untuk melihat hasil.
            </p>
          )}
        </aside>
      </div>

      {/* Clinical disclaimer */}
      <div className="clinical-note" style={{ marginTop: 'var(--space-6)' }}>
        <strong>Catatan Klinis:</strong> Estimasi ini bukan pengganti pemeriksaan Hb laboratorium.
        Hasil hanya digunakan sebagai panduan triase awal oleh tenaga kesehatan terlatih.
      </div>
    </div>
  )
}

// ── Internal sub-component ───────────────────────────────────────────────────

function ReadinessItem({
  label,
  done,
  onClick,
}: {
  label: string
  done: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        width: '100%',
        background: 'transparent',
        border: 'none',
        padding: 'var(--space-2) 0',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      {done ? (
        <CheckCircle size={18} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
      ) : (
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            border: '2px solid var(--color-border-strong)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--color-ink-faint)',
              display: 'block',
            }}
          />
        </span>
      )}
      <span
        style={{
          fontSize: '0.85rem',
          color: done ? 'var(--color-ink)' : 'var(--color-ink-muted)',
          fontWeight: done ? 500 : 400,
        }}
      >
        {label}
      </span>
    </button>
  )
}
