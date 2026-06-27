import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from '../App'

describe('AppShell', () => {
  it('renders the primary workspace navigation', () => {
    render(<App />)

    expect(screen.getAllByText('Skrining baru').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Data wilayah').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Kinerja model').length).toBeGreaterThan(0)
  })
})
