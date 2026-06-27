import { HelpCircle, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { primaryNavigation } from './navigationItems'

export function IconRail() {
  return (
    <nav className="icon-rail" aria-label="Navigasi utama">
      <div className="icon-rail__mark" aria-label="ANEMIA-SCAN">
        AS
      </div>
      <div className="icon-rail__links">
        {primaryNavigation.map(({ icon: Icon, label, to }) => (
          <NavLink
            aria-label={label}
            className={({ isActive }) =>
              `icon-rail__link${isActive ? ' is-active' : ''}`
            }
            key={label}
            title={label}
            to={to}
          >
            <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
          </NavLink>
        ))}
      </div>
      <div className="icon-rail__utilities">
        <button aria-label="Bantuan" title="Bantuan" type="button">
          <HelpCircle aria-hidden="true" size={19} />
        </button>
        <button aria-label="Pengaturan" title="Pengaturan" type="button">
          <Settings aria-hidden="true" size={19} />
        </button>
      </div>
    </nav>
  )
}
