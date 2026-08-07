import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import OnboardingForm from './OnboardingForm.jsx'

// Single static page plus the onboarding form — a full router would be
// more machinery than two routes justify.
const path = window.location.pathname.replace(/\/+$/, '')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {path === '/onboarding' ? <OnboardingForm /> : <App />}
  </StrictMode>,
)
