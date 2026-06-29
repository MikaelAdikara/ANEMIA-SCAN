import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { AppShell } from './AppShell'

describe('AppShell', () => {
  it('shows the primary screening and monitoring navigation', () => {
    render(
      <MemoryRouter>
        <AppShell />
      </MemoryRouter>,
    )

    expect(screen.getByText('Lewati ke konten utama')).toBeTruthy()
    expect(screen.getAllByRole('link', { name: /skrining baru/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /data wilayah/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /kinerja model/i }).length).toBeGreaterThan(0)
  })
})
