import { AlertTriangle, CheckCircle, TrendingUp, RefreshCw, Save, ArrowRight } from 'lucide-react'
import type { RiskEngineResult } from '../../lib/riskEngine'
import type { FormDraft } from './useScreeningDraft'
import { screeningStore } from '../../lib/storage'
import type { ScreeningRecord } from '../../domain/types'

interface Props {
  result: RiskEngineResult
  form: FormDraft
  onReset: () => void
}

const RISK_CONFIG = {
  low: {
    label: 'Risiko Rendah',
    icon: CheckCircle,
    color: 'var(--color-success)',
    bg: 'var(--color-success-soft)',
    border: '#a8dfbf',
    gradient: 'linear-gradient(145deg, #134d34 0%, #177a52 60%, #22c55e 100%)',
    shadow: '0 4px 20px -2px rgb(23 122 82 / 40%)',
    badgeClass: 'badge badge-low',
  },
  moderate: {
    label: 'Risiko Sedang',
    icon: TrendingUp,
    color: '#b45309',
    bg: '#fff7ed',
    border: '#f0c878',
    gradient: 'linear-gradient(145deg, #92400e 0%, #b45309 60%, #d97706 100%)',
    shadow: '0 4px 20px -2px rgb(180 83 9 / 40%)',
    badgeClass: 'badge badge-moderate',
  },
  high: {
    label: 'Risiko Tinggi',
    icon: AlertTriangle,
    color: 'var(--color-error)',
    bg: 'var(--color-error-soft)',
    border: '#f5aca6',
    gradient: 'linear-gradient(145deg, #991b1b 0%, #dc2626 60%, #ef4444 100%)',
    shadow: '0 4px 20px -2px rgb(220 38 38 / 40%)',
    badgeClass: 'badge badge-high',
  },
}

const NEXT_ACTIONS = {
  low: 'Lanjutkan edukasi gizi dan suplementasi rutin. Ulangi skrining dalam 3 bulan.',
  moderate: 'Disarankan pemeriksaan darah Hb di puskesmas dalam 2 minggu terdekat.',
  high: 'Segera rujuk ke fasilitas kesehatan untuk pemeriksaan Hb dan tata laksana anemia.',
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
    riskForm:
      form.targetGroup === 'adolescent'
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
  const cfg = RISK_CONFIG[result.category]
  const Icon = cfg.icon

  const handleSave = () => {
    saveRecord(result, form)
    alert('Hasil disimpan ke riwayat lokal.')
  }

  return (
    <div className="stack">

      {/* ── Risk category hero card ─────────────────────────────────────── */}
      <div
        style={{
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)',
          background: cfg.gradient,
          boxShadow: cfg.shadow + ', inset 0 1px 0 rgb(255 255 255 / 15%)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          isolation: 'isolate',
        }}
      >
        {/* Decorative top-right circle */}
        <div style={{
          position: 'absolute', top: -28, right: -28,
          width: 100, height: 100, borderRadius: '50%',
          background: 'rgb(255 255 255 / 10%)', pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', position: 'relative' }}>
          <div style={{
            display: 'grid', placeItems: 'center',
            width: 48, height: 48, borderRadius: 'var(--radius-lg)',
            background: 'rgb(255 255 255 / 18%)', flexShrink: 0,
            backdropFilter: 'blur(4px)',
          }}>
            <Icon size={24} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {cfg.label}
            </div>
            <div style={{ fontSize: 12, opacity: 0.78, marginTop: 2 }}>
              Skor: {result.score.toFixed(1)} · {result.confidenceLabel}
            </div>
          </div>
          <span
            className={cfg.badgeClass}
            style={{ marginLeft: 'auto', background: 'rgb(255 255 255 / 18%)', color: '#fff', border: '1px solid rgb(255 255 255 / 30%)', flexShrink: 0 }}
          >
            {result.category.toUpperCase()}
          </span>
        </div>

        {/* Next action */}
        <div style={{
          background: 'rgb(255 255 255 / 12%)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-3) var(--space-4)',
          backdropFilter: 'blur(4px)',
          position: 'relative',
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 4, fontFamily: 'var(--font-mono)' }}>
            Tindakan selanjutnya
          </div>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, fontWeight: 500 }}>
            {NEXT_ACTIONS[result.category]}
          </p>
        </div>
      </div>

      {/* ── Disclaimer ─────────────────────────────────────────────────── */}
      <div className="alert alert-warning">
        <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 12 }}>{result.disclaimer}</span>
      </div>

      {/* ── Risk factor breakdown ───────────────────────────────────────── */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Kontribusi Faktor Risiko</h3>
          <span className="badge badge-info">Prototipe</span>
        </div>
        <div className="stack" style={{ gap: 'var(--space-3)' }}>
          {result.contributions.map((c) => (
            <div key={c.label}>
              <div className="row" style={{ marginBottom: 5, gap: 'var(--space-2)' }}>
                <span style={{ fontSize: 12.5, color: 'var(--color-ink-secondary)', flex: 1, minWidth: 0 }}>{c.label}</span>
                <span style={{ fontSize: 11.5, fontFamily: 'var(--font-mono)', fontWeight: 700, color: c.color, flexShrink: 0 }}>
                  {c.percent}%
                </span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${c.percent}%`, background: c.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Actions ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <button type="button" className="btn btn-primary" onClick={handleSave}>
          <Save size={15} /> Simpan ke riwayat
        </button>
        <button type="button" className="btn btn-ghost" onClick={onReset}>
          <RefreshCw size={15} /> Skrining baru
        </button>
        {result.category !== 'low' && (
          <button type="button" className="btn btn-action" style={{ marginLeft: 'auto' }}>
            <ArrowRight size={15} /> Buat rujukan
          </button>
        )}
      </div>
    </div>
  )
}
