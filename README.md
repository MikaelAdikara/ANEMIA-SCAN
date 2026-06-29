# ANEMIA-SCAN Dashboard

Prototype alat bantu skrining risiko anemia berbasis foto kuku dan mata untuk kader posyandu dan bidan. Dibangun untuk keperluan riset kompetisi SATRIA DATA 2026.

> **Peringatan:** Ini adalah prototipe riset. Hasil estimasi **bukan diagnosis medis** dan tidak menggantikan pemeriksaan laboratorium (kadar Hb) oleh tenaga kesehatan.

---

## Fitur Utama

| Fitur | Deskripsi |
|---|---|
| **Skrining** | Tangkap foto mata/kuku via kamera atau unggah gambar. Analisis kualitas piksel otomatis, estimasi risiko dengan penjelasan kontribusi tiap faktor. |
| **Dashboard** | Ringkasan data wilayah: total skrining, distribusi risiko, tren mingguan, dan kelompok sasaran (remaja / ibu hamil). |
| **Kinerja Model** | Metrik AUC, sensitivitas, spesifisitas, dan NPV dari hasil riset. Mencakup stress-test eksternal (India & Italia). |
| **Riwayat** | Tabel rekam skrining dengan filter, pencarian, dan ekspor CSV. Status tindak lanjut dapat diperbarui. |

---

## Tech Stack

- **React 19 + TypeScript** — SPA tanpa backend
- **Vite 8** — build tool & dev server
- **React Router DOM v7** — client-side routing
- **Recharts** — visualisasi data (LineChart, PieChart, BarChart)
- **Lucide React** — ikon
- **CSS Custom Properties** — design system (Manrope + IBM Plex Mono)
- **localStorage** — penyimpanan rekam skrining (tanpa server, tanpa upload data)

---

## Mulai Pengembangan Lokal

### Prasyarat

- [Node.js 20+](https://nodejs.org/) dan [pnpm](https://pnpm.io/installation)
- Browser modern (Chrome 90+ / Firefox 90+ / Safari 15+)
- HTTPS atau `localhost` — dibutuhkan untuk akses kamera

### Instalasi

```bash
git clone https://github.com/MikaelAdikara/ANEMIA-SCAN.git
cd ANEMIA-SCAN
pnpm install
```

### Jalankan Dev Server

```bash
pnpm dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser.

### Build Produksi

```bash
pnpm build        # compile + bundle ke dist/
pnpm preview      # preview build lokal di port 4173
```

### Tes

```bash
pnpm test         # unit test (Vitest)
pnpm test:e2e     # e2e test (Playwright, butuh dev server aktif atau jalankan otomatis)
```

---

## Deploy ke Vercel

### Dari GitHub (Recommended)

1. Push repo ke [GitHub](https://github.com/MikaelAdikara/ANEMIA-SCAN)
2. Masuk ke [vercel.com](https://vercel.com) → **Add New Project**
3. Import repo `MikaelAdikara/ANEMIA-SCAN`
4. Framework: **Other** (jangan pilih Vite — config sudah ada di `vercel.json`)
5. Klik **Deploy** — selesai

`vercel.json` sudah dikonfigurasi dengan:
- Build command: `pnpm build`
- Output directory: `dist`
- SPA rewrites (semua path → `index.html`)
- Immutable cache untuk static asset
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)

### Catatan Kamera di Vercel

Fitur kamera (`getUserMedia`) hanya bekerja di:
- `http://localhost` (dev)
- Domain dengan **HTTPS** (Vercel otomatis menyediakan ini via `*.vercel.app`)

---

## Struktur Proyek

```
src/
├── app/             # AppShell, router, shell tests
├── components/
│   ├── data/        # DemoDataBadge
│   └── navigation/  # IconRail, ContextSidebar, MobileNav
├── data/            # demoScreenings.ts, modelEvidence.ts
├── domain/          # types.ts (ScreeningRecord, RiskLevel, dll)
├── features/
│   ├── screening/   # CameraCapture, RiskForm, ResultPanel, ScreeningPage
│   ├── dashboard/   # DashboardPage + Recharts
│   ├── evidence/    # EvidencePage + model cards
│   └── history/     # HistoryPage + CSV export
├── lib/             # imageQuality, riskEngine, storage, exportCsv
└── styles/          # tokens.css, global.css, utilities.css
e2e/                 # Playwright tests
```

---

## Cara Penggunaan (Alur Skrining)

1. **Buka halaman Skrining** — ikon aktivitas di rail kiri (desktop) atau tab bawah (mobile)
2. **Tab Mata** — klik "Buka Kamera" atau "Upload" foto konjungtiva. Analisis kualitas otomatis:
   - Kecerahan, kontras, ketajaman harus memenuhi ambang batas
   - Jika belum memenuhi syarat, ulangi dengan pencahayaan lebih baik
3. **Tab Kuku** — sama seperti tab mata, untuk foto kuku jari
4. **Tab Formulir** — isi data klinis:
   - Gejala (pucat, lelah, sesak napas, pusing)
   - Kepatuhan konsumsi suplemen zat besi
   - Pola makan (sayur berdaun hijau, daging merah, teh/kopi bersamaan makan)
   - Riwayat anemia atau transfusi sebelumnya
5. **Hasilkan Estimasi** — klik tombol di panel kanan (aktif setelah kedua foto eligible)
6. **Tab Hasil** — lihat kategori risiko, kontribusi tiap faktor, dan rekomendasi tindak lanjut

> Rekam hasil disimpan otomatis ke `localStorage` browser. Tidak ada data yang dikirim ke server.

---

## Penjelasan Model Risiko

Estimasi dihitung secara **deterministik** (bukan ML inference langsung) menggunakan rumus berbobot:

| Faktor | Bobot |
|---|---|
| Gejala klinis | 30% |
| Kepatuhan suplemen zat besi | 20% |
| Risiko pola makan | 15% |
| Sinyal visual (foto mata + kuku) | 25% |
| Riwayat anemia | 10% |

Metrik model dari riset:

| Model | AUC | Catatan |
|---|---|---|
| Mata (konjungtiva) | 0.945 | Validasi lokal Indonesia |
| Kuku (paronychial) | 0.621 | Variabilitas antar-pengamat tinggi |
| Tabular (klinis) | NPV 0.959 | Spesifisitas 0.941 |
| Fusion | 0.824 | Gabungan visual + klinis |
| Stress-test eksternal | 0.440 | India + Italia (domain shift signifikan) |

---

## Privasi & Data

- Semua data skrining tersimpan **hanya di browser lokal** (`localStorage`)
- Foto diproses di browser (Canvas API) dan **tidak pernah diunggah ke server**
- Tidak ada telemetri, tidak ada database eksternal
- Data hilang jika cache browser dibersihkan — ekspor CSV sebelum membersihkan cache

---

## Batasan Prototipe

1. Model visual adalah **simulasi deterministik**, bukan inference model ML yang sesungguhnya
2. Ambang batas kualitas foto dioptimalkan untuk kondisi lab, bukan kondisi lapangan
3. Data dashboard menggunakan **data sintetis** — bukan data wilayah nyata
4. Stress-test eksternal menunjukkan **domain shift** signifikan (AUC 0.44 di luar Indonesia)
5. Belum divalidasi secara klinis untuk lingkungan puskesmas / posyandu

---

## Kontributor

Dikembangkan dalam konteks kompetisi SATRIA DATA 2026.

Untuk pertanyaan teknis, buka [issue di GitHub](https://github.com/MikaelAdikara/ANEMIA-SCAN/issues).
