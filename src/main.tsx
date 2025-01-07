import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  QueryClientProvider,
} from '@tanstack/react-query'
import { ThemeProvider } from './context/theme-context'
import './index.css'
import App from './App'
// Generated Routes



// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
      <StrictMode>
          <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <App></App>
          </ThemeProvider>
      </StrictMode>
  )
}
