import { Navigate, Route, Routes } from 'react-router-dom'

import { DashboardPlaceholderPage } from '../features/dashboard/DashboardPlaceholderPage'
import { EvidencePlaceholderPage } from '../features/evidence/EvidencePlaceholderPage'
import { HistoryPlaceholderPage } from '../features/history/HistoryPlaceholderPage'
import { ScreeningPlaceholderPage } from '../features/screening/ScreeningPlaceholderPage'
import { AppShell } from './AppShell'

export function ShellRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate replace to="/screening" />} />
        <Route path="/screening" element={<ScreeningPlaceholderPage />} />
        <Route path="/dashboard" element={<DashboardPlaceholderPage />} />
        <Route path="/history" element={<HistoryPlaceholderPage />} />
        <Route path="/evidence" element={<EvidencePlaceholderPage />} />
        <Route path="*" element={<Navigate replace to="/screening" />} />
      </Route>
    </Routes>
  )
}
