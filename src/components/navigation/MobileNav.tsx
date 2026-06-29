import { NavLink } from 'react-router-dom'

import { primaryNavigation } from './navigationItems'

export function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Navigasi seluler">
      {primaryNavigation.map(({ icon: Icon, label, to }) => (
        <NavLink
          className={({ isActive }) =>
            `mobile-nav__link${isActive ? ' is-active' : ''}`
          }
          key={label}
          to={to}
        >
          <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
