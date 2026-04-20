import '@/index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import ScrollToTop from '@/app/providers/ScrollToTop'
import { LocaleProvider } from '@/shared/lib/LocaleProvider'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LocaleProvider>
        <ScrollToTop />
        <App />
      </LocaleProvider>
    </BrowserRouter>
  </StrictMode>
)
