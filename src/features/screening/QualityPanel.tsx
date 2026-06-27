import type { PixelQualityResult } from '../../lib/imageQuality'

interface Props { quality: PixelQualityResult }

const METRICS: { key: keyof PixelQualityResult; label: string; isPercent?: boolean }[] = [
  { key: 'brightness', label: 'Kecerahan', isPercent: true },
  { key: 'contrast', label: 'Kontras', isPercent: true },
  { key: 'sharpness', label: 'Ketajaman', isPercent: true },
]

function MetricBar({ value, label }: { value: number; label: string }) {
  const pct = Math.round(value)
  const color = pct >= 60 ? 'var(--color-success)' : pct >= 30 ? 'var(--color-warning)' : 'var(--color-danger)'
  return (
    <div>
      <div className="row" style={{ marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{label}</span>
        <span style={{ marginLeft: 'auto', fontSize: 12, fontFamily: 'var(--font-mono)', color }}>{pct}</span>
      </div>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export function QualityPanel({ quality }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
      <div className="label" style={{ marginBottom: 0 }}>Kualitas Gambar</div>
      {METRICS.map(({ key, label }) => (
        <MetricBar key={key} value={quality[key] as number} label={label} />
      ))}
    </div>
  )
}
