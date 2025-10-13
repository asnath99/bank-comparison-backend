import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { useAuthStore } from './stores/authStore';

// --- DEV ONLY: Auto-login for faster development ---
if (import.meta.env.DEV && import.meta.env.VITE_DEV_AUTO_LOGIN_AS_ADMIN === 'true') {
  useAuthStore.getState().setToken('dev-fake-token');
  console.log('DEV: Auto-logged in as admin.');
}
// -----------------------------------------------------

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
