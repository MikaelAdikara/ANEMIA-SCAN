import { expect, test } from '@playwright/test'

test.describe('ANEMIA-SCAN', () => {
  test('desktop: no horizontal overflow on screening page', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/screening')
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )
    expect(overflow).toBe(false)
  })

  test('mobile: bottom nav reaches dashboard', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/screening')
    await page.getByRole('link', { name: /data wilayah/i }).click()
    await expect(page).toHaveURL(/dashboard/)
  })

  test('mobile: bottom nav reaches evidence', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/screening')
    await page.getByRole('link', { name: /kinerja model/i }).click()
    await expect(page).toHaveURL(/evidence/)
  })

  test('screening: generate button is disabled before all modalities complete', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/screening')
    // Navigate to form tab
    const formTab = page.getByRole('button', { name: /formulir/i })
    if (await formTab.isVisible()) {
      await formTab.click()
    }
    const generateBtn = page.getByRole('button', { name: /hasilkan estimasi/i })
    await expect(generateBtn).toBeDisabled()
  })

  test('dashboard: shows KPI cards', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/dashboard')
    await expect(page.getByText('Total Skrining')).toBeVisible()
    await expect(page.getByText('154')).toBeVisible()
  })

  test('evidence: shows verified AUC metrics', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/evidence')
    await expect(page.getByText(/0\.945/)).toBeVisible()
    await expect(page.getByText(/validasi lokal/i)).toBeVisible()
  })

  test('history: export CSV button is present', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/history')
    await expect(page.getByRole('button', { name: /export csv/i })).toBeVisible()
  })
})
