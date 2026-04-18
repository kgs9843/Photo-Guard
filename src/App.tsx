import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import RouteFallback from '@/shared/ui/RouteFallback'

const AppShell = lazy(() => import('@/app/layout/AppShell'))
const Clean = lazy(() => import('@/pages/clean'))
const Cleaning = lazy(() => import('@/pages/cleaning'))
const Dashboard = lazy(() => import('@/pages/dashboard'))
const History = lazy(() => import('@/pages/history'))
const HistoryDetail = lazy(() => import('@/pages/history/ui/HistoryDetailPage'))
const OpenSourceLicenses = lazy(() => import('@/pages/licenses'))
const PrivacyPolicy = lazy(() => import('@/pages/privacy'))
const Settings = lazy(() => import('@/pages/settings'))

const App = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/clean" element={<Clean />} />
        <Route path="/cleaning" element={<Cleaning />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/licenses" element={<OpenSourceLicenses />} />
        <Route path="/" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="history/:recordId" element={<HistoryDetail />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
