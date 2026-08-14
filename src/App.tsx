import { Navigate, Route, Routes } from 'react-router-dom'
import { FlowLayout, MainLayout } from './components'
import {
  AdminCarePage,
  AdminGuidePage,
  AdminThemePage,
  AnalyzingPage,
  BadgesPage,
  CapturePage,
  CarePage,
  CartPage,
  ComparePage,
  GuidePage,
  HistoryPage,
  HomePage,
  OnboardingPage,
  ProductDetailPage,
  ProfilePage,
  ResultPage,
  ResultSharePage,
  ResultZonesPage,
} from './pages'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/care" element={<CarePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/capture" element={<CapturePage />} />
        <Route path="/analyzing" element={<AnalyzingPage />} />
        <Route path="/result/:id" element={<ResultPage />} />
        <Route path="/result/:id/zones" element={<ResultZonesPage />} />
        <Route path="/result/:id/share" element={<ResultSharePage />} />
        <Route path="/care/:productId" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/profile/badges" element={<BadgesPage />} />
        <Route path="/admin/theme" element={<AdminThemePage />} />
        <Route path="/admin/care" element={<AdminCarePage />} />
        <Route path="/admin/guide" element={<AdminGuidePage />} />
      </Route>

      <Route element={<FlowLayout />}>
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
