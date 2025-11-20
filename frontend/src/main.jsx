import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { FileProvider } from './context/FileContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <FileProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </FileProvider>
    </AuthProvider>
  </StrictMode>,
)
