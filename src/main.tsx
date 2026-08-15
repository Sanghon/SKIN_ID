import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { applyBrandTheme, getStoredBrandTheme } from './lib/theme'
import { initData } from './services/data/store'

applyBrandTheme(getStoredBrandTheme())

const root = createRoot(document.getElementById('root')!)

// HistoryPage computes chart/calendar data at module top level from the live-binding
// data store, so App must not be imported until that store is populated.
initData()
  .catch((err) => {
    console.error('Failed to load initial data', err)
  })
  .finally(async () => {
    const { default: App } = await import('./App.tsx')
    root.render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>,
    )
  })
