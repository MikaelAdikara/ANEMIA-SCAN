import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
  })

  it('redirects the root route to the screening workspace', async () => {
    render(<App />)

    await waitFor(() => {
      expect(window.location.pathname).toBe('/screening')
    })
    expect(
      screen.getByRole('heading', { name: 'Skrining baru' }),
    ).toBeInTheDocument()
  })

  it('redirects an unknown route safely to the screening workspace', async () => {
    window.history.replaceState({}, '', '/tidak-ada')

    render(<App />)

    await waitFor(() => {
      expect(window.location.pathname).toBe('/screening')
    })
  })

  it('marks the current navigation destination as active', () => {
    window.history.replaceState({}, '', '/history')

    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Riwayat skrining' }),
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole('link', { name: 'Riwayat' }).every(
        (link) => link.getAttribute('aria-current') === 'page',
      ),
    ).toBe(true)
  })

  it.each([
    ['/screening', 'Skrining baru'],
    ['/dashboard', 'Ringkasan wilayah'],
    ['/history', 'Riwayat skrining'],
    ['/evidence', 'Kinerja model'],
  ])('renders the supported %s route', (path, heading) => {
    window.history.replaceState({}, '', path)

    render(<App />)

    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
  })
})
