import { useState } from 'react'
import { Eye, Hand, ClipboardList, BarChart2 } from 'lucide-react'
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
    <div>
      <div className="page-header">
        <h1 className="page-title">Skrining Anemia</h1>
        <p className="page-subtitle">Lengkapi tiga modalitas untuk mendapatkan estimasi risiko</p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--color-border)', marginBottom: 'var(--space-5)', gap: 0, overflowX: 'auto' }}>
        {TABS.map(({ id, label, icon: Icon }) => {
          const done = id === 'eye' ? eyeDone : id === 'nail' ? nailDone : id === 'form' ? formDone : !!result
          const isActive = activeTab === id
          const disabled = id === 'result' && !result
          return (
            <button
              key={id}
              onClick={() => !disabled && setActiveTab(id)}
              disabled={disabled}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px',
                background: 'transparent', border: 'none', borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                marginBottom: -2, cursor: disabled ? 'not-allowed' : 'pointer',
                color: isActive ? 'var(--color-primary)' : done ? 'var(--color-success)' : 'var(--color-text-muted)',
                fontWeight: isActive ? 600 : 400, fontSize: 14, whiteSpace: 'nowrap',
              }}
            >
              <Icon size={16} />
              {label}
              {done && id !== 'result' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }} />}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'eye' && (
        <div className="stack">
          <CameraCapture
            label="Foto Konjungtiva Mata"
            onCapture={(q) => { draft.setEyeQuality(q); if (q.eligible) setActiveTab('nail') }}
            captured={eyeDone}
          />
          {eyeDone && (
            <button className="btn btn-primary" onClick={() => setActiveTab('nail')}>Lanjut ke Foto Kuku →</button>
          )}
        </div>
      )}

      {activeTab === 'nail' && (
        <div className="stack">
          <CameraCapture
            label="Foto Kuku Jari"
            onCapture={(q) => { draft.setNailQuality(q); if (q.eligible) setActiveTab('form') }}
            captured={nailDone}
          />
          {nailDone && (
            <button className="btn btn-primary" onClick={() => setActiveTab('form')}>Lanjut ke Formulir →</button>
          )}
        </div>
      )}

      {activeTab === 'form' && (
        <div className="stack">
          <RiskForm form={draft.form} onChange={draft.setForm} />

          {!canGenerate && (
            <div className="alert alert-info">
              Lengkapi tiga modalitas (foto mata, foto kuku, dan formulir) untuk menghasilkan estimasi.
            </div>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          <button
            className="btn btn-action btn-lg"
            onClick={generateResult}
            disabled={!canGenerate}
          >
            <BarChart2 size={18} /> Hasilkan estimasi
          </button>
        </div>
      )}

      {activeTab === 'result' && result && (
        <ResultPanel result={result} form={draft.form} onReset={reset} />
      )}
    </div>
  )
}
