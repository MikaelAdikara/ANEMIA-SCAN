import type { FormDraft } from './useScreeningDraft'

interface Props {
  form: FormDraft
  onChange: (patch: Partial<FormDraft>) => void
}

const SYMPTOMS: { id: number; label: string }[] = [
  { id: 0, label: 'Mudah lelah' },
  { id: 1, label: 'Pusing / kepala ringan' },
  { id: 2, label: 'Sesak napas' },
  { id: 3, label: 'Wajah atau telapak tangan pucat' },
]

export function RiskForm({ form, onChange }: Props) {
  return (
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
          max={55}
          value={form.ageYears || ''}
          placeholder="Masukkan usia…"
          onChange={(e) => onChange({ ageYears: +e.target.value })}
        />
      </div>

      {/* Symptoms */}
      <div className="form-group">
        <label className="form-label">Gejala yang dialami</label>
        <div className="stack-sm">
          {SYMPTOMS.map(({ id, label }) => {
            const checked = id < form.symptoms
            return (
              <label
                key={id}
                className={`check-item${checked ? ' is-checked' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) =>
                    onChange({
                      symptoms: e.target.checked
                        ? Math.min(4, id + 1)
                        : Math.max(0, id),
                    })
                  }
                />
                {label}
              </label>
            )
          })}
        </div>
      </div>

      {/* Iron adherence */}
      <div className="form-group">
        <label className="form-label">Suplementasi tablet tambah darah (TTD)</label>
        <select
          className="form-select"
          value={form.ironAdherence}
          onChange={(e) =>
            onChange({ ironAdherence: e.target.value as FormDraft['ironAdherence'] })
          }
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
          <option value={0}>≥ 4 porsi (baik)</option>
          <option value={1}>2–3 porsi</option>
          <option value={2}>1 porsi</option>
          <option value={3}>Jarang / tidak pernah</option>
        </select>
      </div>

      {/* Medical history */}
      <div className="form-group">
        <label className="form-label">Riwayat kesehatan</label>
        <div className="stack-sm">
          <label className={`check-item${form.recentBleeding ? ' is-checked' : ''}`}>
            <input
              type="checkbox"
              checked={form.recentBleeding}
              onChange={(e) => onChange({ recentBleeding: e.target.checked })}
            />
            Perdarahan baru-baru ini
          </label>
          <label className={`check-item${form.previousAnemia ? ' is-checked' : ''}`}>
            <input
              type="checkbox"
              checked={form.previousAnemia}
              onChange={(e) => onChange({ previousAnemia: e.target.checked })}
            />
            Riwayat anemia sebelumnya
          </label>
        </div>
      </div>

      {/* Pregnant-specific */}
      {form.targetGroup === 'pregnant' && (
        <>
          <div className="form-group">
            <label className="form-label">Usia kehamilan (minggu)</label>
            <input
              type="number"
              className="form-input"
              min={4}
              max={42}
              value={form.gestationalAgeWeeks || ''}
              placeholder="Minggu ke-…"
              onChange={(e) => onChange({ gestationalAgeWeeks: +e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Paritas (jumlah kelahiran sebelumnya)</label>
            <input
              type="number"
              className="form-input"
              min={0}
              max={12}
              value={form.parity ?? ''}
              placeholder="0"
              onChange={(e) => onChange({ parity: +e.target.value })}
            />
          </div>
        </>
      )}

      {/* Adolescent-specific */}
      {form.targetGroup === 'adolescent' && (
        <div className="form-group">
          <label className="form-label">Status menstruasi</label>
          <div className="stack-sm">
            <label className={`check-item${form.menstruates ? ' is-checked' : ''}`}>
              <input
                type="checkbox"
                checked={form.menstruates}
                onChange={(e) => onChange({ menstruates: e.target.checked })}
              />
              Sudah menstruasi
            </label>
            {form.menstruates && (
              <label className={`check-item${form.heavyMenstrualBleeding ? ' is-checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={form.heavyMenstrualBleeding}
                  onChange={(e) =>
                    onChange({ heavyMenstrualBleeding: e.target.checked })
                  }
                />
                Menstruasi berat / berlangsung lama
              </label>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
