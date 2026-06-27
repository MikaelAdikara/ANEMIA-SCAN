import { Bell, CircleHelp, Search } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

import { ContextSidebar } from '../components/navigation/ContextSidebar'
import { IconRail } from '../components/navigation/IconRail'
import { MobileNav } from '../components/navigation/MobileNav'

export function AppShell() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Lewati ke konten utama
      </a>
      <div className="app-shell">
        <header className="topbar">
          <NavLink className="topbar__brand" to="/screening">
            ANEMIA<span>SCAN</span>
          </NavLink>
          <button
            aria-label="Buka pencarian"
            className="command-bar"
            title="Buka pencarian"
            type="button"
          >
            <Search aria-hidden="true" size={16} />
            <span>Cari skrining, ID peserta, atau lokasi</span>
            <kbd>Ctrl K</kbd>
          </button>
          <div className="topbar__utilities">
            <button aria-label="Pusat bantuan" title="Pusat bantuan" type="button">
              <CircleHelp aria-hidden="true" size={18} />
            </button>
            <button aria-label="Notifikasi" title="Notifikasi" type="button">
              <Bell aria-hidden="true" size={18} />
            </button>
            <button
              aria-label="Buka menu akun"
              className="topbar__avatar"
              title="Akun Maya Rahma"
              type="button"
            >
              MR
            </button>
          </div>
        </header>

        <IconRail />
        <ContextSidebar />

        <section className="workspace" aria-label="Area kerja">
          <header className="workspace__header">
            <nav className="workspace-tabs" aria-label="Tampilan ruang kerja">
              <NavLink to="/screening">Pemeriksaan</NavLink>
              <NavLink to="/dashboard">Operasional</NavLink>
              <NavLink to="/evidence">Bukti model</NavLink>
            </nav>
            <div className="workspace__status">
              <span>
                <i aria-hidden="true" /> Sistem siap
              </span>
              <button type="button">Simpan draf</button>
            </div>
          </header>
          <main className="workspace__main" id="main-content" tabIndex={-1}>
            <Outlet />
          </main>
        </section>

        <MobileNav />
      </div>
    </>
  )
}
