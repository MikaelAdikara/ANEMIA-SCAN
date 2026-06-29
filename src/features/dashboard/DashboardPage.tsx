import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from 'recharts'
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { DemoDataBadge } from '../../components/data/DemoDataBadge'

// ── Synthetic data ──────────────────────────────────────────────────────────

const WEEKLY_VOLUME = [
  { week: 'Mg-1', total: 12, high: 3, moderate: 5, low: 4 },
  { week: 'Mg-2', total: 18, high: 5, moderate: 6, low: 7 },
  { week: 'Mg-3', total: 14, high: 2, moderate: 6, low: 6 },
  { week: 'Mg-4', total: 22, high: 6, moderate: 8, low: 8 },
  { week: 'Mg-5', total: 19, high: 4, moderate: 7, low: 8 },
  { week: 'Mg-6', total: 26, high: 7, moderate: 9, low: 10 },
  { week: 'Mg-7', total: 21, high: 5, moderate: 8, low: 8 },
  { week: 'Mg-8', total: 30, high: 8, moderate: 11, low: 11 },
]

const RISK_DISTRIBUTION = [
  { name: 'Rendah', value: 54 },
  { name: 'Sedang', value: 60 },
  { name: 'Tinggi', value: 40 },
]

const RISK_COLORS: Record<string, string> = {
  Rendah: '#1e8449',
  Sedang: '#d68910',
  Tinggi: '#c0392b',
}

const TARGET_GROUP_DATA = [
  { kelompok: 'Remaja', jumlah: 82 },
  { kelompok: 'Hamil', jumlah: 72 },
]

const GROUP_COLORS = ['#2563eb', '#7c3aed']

// ── KPI constants ───────────────────────────────────────────────────────────

const TOTAL = 154
const HIGH_RISK = 40
const COMPLETION_RATE = 87
const REFERRALS_PENDING = 23

// ── Tooltip style ───────────────────────────────────────────────────────────

const TOOLTIP_STYLE = {
  background: '#1a1a2e',
  border: 'none',
  borderRadius: 8,
  color: '#fff',
  fontSize: 12,
  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
}

// ── Component ───────────────────────────────────────────────────────────────

export function DashboardPage() {
  return (
    <div className="page page-in">
      {/* Page heading */}
      <header className="page-heading">
        <div>
          <p className="eyebrow">Insight / Wilayah</p>
          <h1>Ringkasan Wilayah</h1>
          <p>Ringkasan hasil skrining anemia — data sintetis untuk demonstrasi</p>
        </div>
        <DemoDataBadge />
      </header>

      {/* KPI cards */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
        {/* Total Skrining */}
        <div className="kpi-card kpi-card--blue">
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-3)',
            }}
          >
            <Activity size={16} style={{ color: '#fff' }} />
          </div>
          <div className="kpi-label">Total Skrining</div>
          <div className="kpi-value">{TOTAL}</div>
          <div className="kpi-sub">8 minggu terakhir</div>
        </div>

        {/* Risiko Tinggi */}
        <div className="kpi-card kpi-card--red">
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-3)',
            }}
          >
            <AlertTriangle size={16} style={{ color: '#fff' }} />
          </div>
          <div className="kpi-label">Risiko Tinggi</div>
          <div className="kpi-value">{HIGH_RISK}</div>
          <div className="kpi-sub">{((HIGH_RISK / TOTAL) * 100).toFixed(1)}% dari total</div>
        </div>

        {/* Tingkat Penyelesaian */}
        <div className="kpi-card kpi-card--green">
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-3)',
            }}
          >
            <CheckCircle size={16} style={{ color: '#fff' }} />
          </div>
          <div className="kpi-label">Tingkat Penyelesaian</div>
          <div className="kpi-value">{COMPLETION_RATE}%</div>
          <div className="kpi-sub">skrining selesai penuh</div>
        </div>

        {/* Rujukan Tertunda */}
        <div className="kpi-card kpi-card--amber">
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-3)',
            }}
          >
            <Clock size={16} style={{ color: '#fff' }} />
          </div>
          <div className="kpi-label">Rujukan Tertunda</div>
          <div className="kpi-value">{REFERRALS_PENDING}</div>
          <div className="kpi-sub">belum ditindaklanjuti</div>
        </div>
      </div>

      {/* Line chart — weekly screening volume */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <span className="card-title">Volume Skrining Mingguan</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={WEEKLY_VOLUME} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="total"
              name="Total"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="high"
              name="Risiko Tinggi"
              stroke="#c0392b"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="moderate"
              name="Risiko Sedang"
              stroke="#d68910"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="low"
              name="Risiko Rendah"
              stroke="#1e8449"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom charts — 2-column grid */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
        {/* Pie chart — risk distribution */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Distribusi Risiko</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={RISK_DISTRIBUTION}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name ?? ''} ${(Number(percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {RISK_DISTRIBUTION.map((entry) => (
                  <Cell key={entry.name} fill={RISK_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${Number(value)} skrining`, 'Jumlah']}
                contentStyle={TOOLTIP_STYLE}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart — distribution by target group */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Distribusi Kelompok Sasaran</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={TARGET_GROUP_DATA}
              margin={{ top: 8, right: 24, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
              <XAxis
                dataKey="kelompok"
                tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }}
              />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }} />
              <Tooltip
                formatter={(value) => [`${Number(value)} skrining`, 'Jumlah']}
                contentStyle={TOOLTIP_STYLE}
              />
              <Bar dataKey="jumlah" name="Jumlah Skrining" radius={[4, 4, 0, 0]}>
                {TARGET_GROUP_DATA.map((_, i) => (
                  <Cell key={i} fill={GROUP_COLORS[i % GROUP_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
