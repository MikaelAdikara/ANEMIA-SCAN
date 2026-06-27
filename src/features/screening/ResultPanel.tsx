import { AlertTriangle, CheckCircle, TrendingUp, RefreshCw, Save } from 'lucide-react'
import type { RiskEngineResult } from '../../lib/riskEngine'
import type { FormDraft } from './useScreeningDraft'
import { screeningStore } from '../../lib/storage'
import type { ScreeningRecord } from '../../domain/types'

interface Props {
  result: RiskEngineResult
  form: FormDraft
  onReset: () => void
}

const RISK_LABELS = { low: 'Risiko Rendah', moderate: 'Risiko Sedang', high: 'Risiko Tinggi' }
const RISK_COLORS = { low: 'var(--color-risk-low)', moderate: 'var(--color-risk-moderate)', high: 'var(--color-risk-high)' }
const RISK_BG = { low: 'var(--color-risk-low-bg)', moderate: 'var(--color-risk-moderate-bg)', high: 'var(--color-risk-high-bg)' }

const NEXT_ACTIONS = {
  low: 'Lanjutkan edukasi gizi dan suplementasi rutin. Ulangi skrining dalam 3 bulan.',
  moderate: 'Disarankan pemeriksaan darah Hb di puskesmas dalam 2 minggu.',
  high: 'Segera rujuk ke fasilitas kesehatan untuk pemeriksaan Hb dan tata laksana.',
}

function saveRecord(result: RiskEngineResult, form: FormDraft) {
  const now = new Date().toISOString() as any
  const id = `SCR-${Date.now().toString(36).toUpperCase()}` as any
  const record: ScreeningRecord = {
    id,
    siteId: 'SITE-LOCAL',
    startedAt: now,
    completedAt: now,
    targetGroup: form.targetGroup,
    completionState: 'completed',
    durationSeconds: 0,
    riskScore: result.score,
    riskLevel: result.category,
    followUpStatus: result.category === 'high' ? 'recommended' : 'not-required',
    imageQuality: { eye: 'good', nail: 'good' },
    riskForm: form.targetGroup === 'adolescent'
      ? {
          targetGroup: 'adolescent',
          ageYears: form.ageYears,
          symptoms: { fatigue: form.symptoms > 0, dizziness: form.symptoms > 1, shortnessOfBreath: form.symptoms > 2, visiblePallor: form.symptoms > 3 },
          animalProteinServingsPerWeek: 4 - form.dietRisk,
          ironSupplementUse: form.ironAdherence === 'none' ? 'none' : form.ironAdherence === 'irregular' ? 'irregular' : 'regular',
          recentBleeding: form.recentBleeding,
          previousAnemia: form.previousAnemia,
          menstruates: form.menstruates,
          heavyMenstrualBleeding: form.heavyMenstrualBleeding,
        }
      : {
          targetGroup: 'pregnant',
          ageYears: form.ageYears,
          symptoms: { fatigue: form.symptoms > 0, dizziness: form.symptoms > 1, shortnessOfBreath: form.symptoms > 2, visiblePallor: form.symptoms > 3 },
          animalProteinServingsPerWeek: 4 - form.dietRisk,
          ironSupplementUse: form.ironAdherence === 'none' ? 'none' : form.ironAdherence === 'irregular' ? 'irregular' : 'regular',
          recentBleeding: form.recentBleeding,
          previousAnemia: form.previousAnemia,
          gestationalAgeWeeks: form.gestationalAgeWeeks,
          parity: form.parity,
          muacCategory: 'at-or-above-23.5-cm',
        },
  } as any
  screeningStore.add(record)
  return record.id
}

export function ResultPanel({ result, form, onReset }: Props) {
  const color = RISK_COLORS[result.category]
  const bg = RISK_BG[result.category]
  const Icon = result.category === 'low' ? CheckCircle : result.category === 'moderate' ? TrendingUp : AlertTriangle

  const handleSave = () => {
    saveRecord(result, form)
    alert('Hasil disimpan ke riwayat lokal.')
  }

  return (
    <div className="stack">
      {/* Risk category card */}
      <div className="card" style={{ borderLeft: `4px solid ${color}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <Icon size={28} color={color} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color }}>{RISK_LABELS[result.category]}</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Kepercayaan: {result.confidenceLabel}</div>
          </div>
          <span className="badge" style={{ marginLeft: 'auto', background: bg, color }}>{result.category.toUpperCase()}</span>
        </div>

        <div className="alert alert-warning" style={{ marginBottom: 'var(--space-4)' }}>
          <AlertTriangle size={15} />
          <span>{result.disclaimer}</span>
        </div>

        <div>
          <div className="label">Tindakan selanjutnya</div>
          <p style={{ fontSize: 14, color: 'var(--color-text)' }}>{NEXT_ACTIONS[result.category]}</p>
        </div>
      </div>

      {/* Contribution breakdown */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Kontribusi Faktor Risiko</h3>
          <span className="badge badge-info">Prototipe</span>
        </div>
        <div className="stack" style={{ gap: 'var(--space-3)' }}>
          {result.contributions.map((c) => (
            <div key={c.label}>
              <div className="row" style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{c.label}</span>
                <span style={{ marginLeft: 'auto', fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 600, color: c.color }}>{c.percent}%</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${c.percent}%`, background: c.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={15} /> Simpan ke riwayat
        </button>
        <button className="btn btn-ghost" onClick={onReset}>
          <RefreshCw size={15} /> Skrining baru
        </button>
      </div>
    </div>
  )
}
