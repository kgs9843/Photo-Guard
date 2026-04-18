import '@/index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import OnlineBoundary from '@/app/providers/OnlineBoundary'
import ScrollToTop from '@/app/providers/ScrollToTop'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <OnlineBoundary>
        <App />
      </OnlineBoundary>
    </BrowserRouter>
  </StrictMode>
)
