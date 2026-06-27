import {
  insightNavigation,
  workspaceNavigation,
} from './navigationItems'
import { NavLink } from 'react-router-dom'

function NavigationGroup({
  label,
  items,
}: {
  label: string
  items: typeof workspaceNavigation
}) {
  return (
    <div className="context-nav__group">
      <p className="context-nav__label">{label}</p>
      <div className="context-nav__items">
        {items.map(({ icon: Icon, label: itemLabel, to, end }) => (
          <NavLink
            className={({ isActive }) =>
              `context-nav__link${isActive ? ' is-active' : ''}`
            }
            end={end}
            key={itemLabel}
            to={to}
          >
            <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
            <span>{itemLabel}</span>
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export function ContextSidebar() {
  return (
    <nav className="context-nav" aria-label="Navigasi ruang kerja">
      <div className="context-nav__site">
        <span className="context-nav__site-mark" aria-hidden="true">
          PM
        </span>
        <span>
          <strong>Posyandu Melati</strong>
          <small>Wilayah Puskesmas</small>
        </span>
      </div>

      <NavigationGroup label="Workspace" items={workspaceNavigation} />
      <NavigationGroup label="Insight" items={insightNavigation} />

      <div className="context-nav__location">
        <span>Lokasi aktif</span>
        <strong>Kelurahan Sukamaju</strong>
        <small>Mode demonstrasi lokal</small>
      </div>
    </nav>
  )
}
