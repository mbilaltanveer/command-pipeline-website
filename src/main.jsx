import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'
import OnboardingForm from './OnboardingForm.jsx'
import ScreenRecorderPage from './ScreenRecorderPage.jsx'

// A single static page plus a couple of standalone pages — a full router
// would be more machinery than a handful of routes justify.
const path = window.location.pathname.replace(/\/+$/, '')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {path === '/onboarding' ? <OnboardingForm />
      : path === '/products/screen-recorder' ? <ScreenRecorderPage />
      : <App />}
    <Analytics />
  </StrictMode>,
)
