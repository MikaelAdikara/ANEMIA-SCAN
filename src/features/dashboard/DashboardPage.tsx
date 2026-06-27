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

// ── Component ───────────────────────────────────────────────────────────────

export function DashboardPage() {
  return (
    <div className="stack">
      {/* Page header */}
      <div className="page-header">
        <div className="row" style={{ alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <h1 className="page-title">Dashboard Pemantauan</h1>
          <DemoDataBadge />
        </div>
        <p className="page-subtitle">
          Ringkasan hasil skrining anemia — data sintetis untuk demonstrasi
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid-4">
        <div className="card">
          <div className="card-header">
            <Activity size={16} style={{ color: '#2563eb' }} />
            <span className="card-title">Total Skrining</span>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 700, margin: '8px 0 2px' }}>{TOTAL}</p>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>8 minggu terakhir</p>
        </div>

        <div className="card">
          <div className="card-header">
            <AlertTriangle size={16} style={{ color: '#c0392b' }} />
            <span className="card-title">Risiko Tinggi</span>
          </div>
          <p
            style={{ fontSize: '2rem', fontWeight: 700, color: '#c0392b', margin: '8px 0 2px' }}
          >
            {HIGH_RISK}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
            {((HIGH_RISK / TOTAL) * 100).toFixed(1)}% dari total
          </p>
        </div>

        <div className="card">
          <div className="card-header">
            <CheckCircle size={16} style={{ color: '#1e8449' }} />
            <span className="card-title">Tingkat Penyelesaian</span>
          </div>
          <p
            style={{ fontSize: '2rem', fontWeight: 700, color: '#1e8449', margin: '8px 0 2px' }}
          >
            {COMPLETION_RATE}%
          </p>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>skrining selesai penuh</p>
        </div>

        <div className="card">
          <div className="card-header">
            <Clock size={16} style={{ color: '#d68910' }} />
            <span className="card-title">Rujukan Tertunda</span>
          </div>
          <p
            style={{ fontSize: '2rem', fontWeight: 700, color: '#d68910', margin: '8px 0 2px' }}
          >
            {REFERRALS_PENDING}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
            belum ditindaklanjuti
          </p>
        </div>
      </div>

      {/* Line chart — weekly screening volume */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Volume Skrining Mingguan</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={WEEKLY_VOLUME} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
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

      <div className="grid-2">
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
              <Tooltip formatter={(value) => [`${Number(value)} skrining`, 'Jumlah']} />
              <Legend />
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
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="kelompok" tick={{ fontSize: 13 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`${Number(value)} skrining`, 'Jumlah']} />
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
