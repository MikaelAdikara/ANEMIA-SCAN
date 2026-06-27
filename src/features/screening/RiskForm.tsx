import type { FormDraft } from './useScreeningDraft'

interface Props {
  form: FormDraft
  onChange: (patch: Partial<FormDraft>) => void
}

const SYMPTOM_LABELS = ['Mudah lelah', 'Pusing/kepala ringan', 'Sesak napas', 'Pucat terlihat']

export function RiskForm({ form, onChange }: Props) {
  const symptomCount = form.symptoms

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Formulir Risiko</h3>
      </div>
      <div className="stack">
        {/* Target group */}
        <div className="form-group">
          <label className="form-label">Kelompok sasaran</label>
          <select
            className="form-select"
            value={form.targetGroup}
            onChange={(e) => onChange({ targetGroup: e.target.value as 'adolescent' | 'pregnant' })}
          >
            <option value="adolescent">Remaja putri</option>
            <option value="pregnant">Ibu hamil</option>
          </select>
        </div>

        {/* Age */}
        <div className="form-group">
          <label className="form-label">Usia (tahun)</label>
          <input
            type="number"
            className="form-input"
            min={10}
            max={50}
            value={form.ageYears}
            onChange={(e) => onChange({ ageYears: +e.target.value })}
          />
        </div>

        {/* Symptoms */}
        <div className="form-group">
          <label className="form-label">Gejala yang dialami ({symptomCount} dari 4)</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {SYMPTOM_LABELS.map((s, i) => (
              <label key={i} style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', cursor: 'pointer', fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={i < symptomCount}
                  onChange={(e) => onChange({ symptoms: e.target.checked ? Math.min(4, i + 1) : Math.max(0, i) })}
                />
                {s}
              </label>
            ))}
          </div>
        </div>

        {/* Iron adherence */}
        <div className="form-group">
          <label className="form-label">Suplementasi zat besi</label>
          <select
            className="form-select"
            value={form.ironAdherence}
            onChange={(e) => onChange({ ironAdherence: e.target.value as FormDraft['ironAdherence'] })}
          >
            <option value="none">Tidak pernah</option>
            <option value="irregular">Kadang-kadang</option>
            <option value="high">Rutin sesuai anjuran</option>
          </select>
        </div>

        {/* Diet risk */}
        <div className="form-group">
          <label className="form-label">Konsumsi protein hewani per minggu</label>
          <select
            className="form-select"
            value={form.dietRisk}
            onChange={(e) => onChange({ dietRisk: +e.target.value })}
          >
            <option value={0}>≥4 porsi (baik)</option>
            <option value={1}>2–3 porsi</option>
            <option value={2}>1 porsi</option>
            <option value={3}>Jarang/tidak pernah</option>
          </select>
        </div>

        {/* History */}
        <div className="form-group">
          <label style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', cursor: 'pointer', fontSize: 13 }}>
            <input type="checkbox" checked={form.recentBleeding} onChange={(e) => onChange({ recentBleeding: e.target.checked })} />
            Perdarahan baru-baru ini
          </label>
          <label style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', cursor: 'pointer', fontSize: 13 }}>
            <input type="checkbox" checked={form.previousAnemia} onChange={(e) => onChange({ previousAnemia: e.target.checked })} />
            Riwayat anemia sebelumnya
          </label>
        </div>

        {/* Pregnant-specific */}
        {form.targetGroup === 'pregnant' && (
          <>
            <div className="form-group">
              <label className="form-label">Usia kehamilan (minggu)</label>
              <input type="number" className="form-input" min={4} max={42} value={form.gestationalAgeWeeks} onChange={(e) => onChange({ gestationalAgeWeeks: +e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Paritas (jumlah kelahiran sebelumnya)</label>
              <input type="number" className="form-input" min={0} max={10} value={form.parity} onChange={(e) => onChange({ parity: +e.target.value })} />
            </div>
          </>
        )}

        {/* Adolescent-specific */}
        {form.targetGroup === 'adolescent' && (
          <div className="form-group">
            <label style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', cursor: 'pointer', fontSize: 13 }}>
              <input type="checkbox" checked={form.menstruates} onChange={(e) => onChange({ menstruates: e.target.checked })} />
              Sudah menstruasi
            </label>
            {form.menstruates && (
              <label style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', cursor: 'pointer', fontSize: 13 }}>
                <input type="checkbox" checked={form.heavyMenstrualBleeding} onChange={(e) => onChange({ heavyMenstrualBleeding: e.target.checked })} />
                Menstruasi berat/lama
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
