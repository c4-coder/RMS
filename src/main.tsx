import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './global.css'
import './Workspace.css'
import './Features.css'
import AppRouter from './app/AppRouter'
import { DemoDataProvider } from './features/demo/DemoDataContext'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <DemoDataProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </DemoDataProvider>
    </QueryClientProvider>
  </StrictMode>,
)
