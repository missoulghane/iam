import { BrowserRouter } from 'react-router'
import { ThemeModeProvider } from '@/app/providers/ThemeModeProvider'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { AppRouter } from '@/app/router/AppRouter'
import { NotificationProvider } from '@/shared/components/NotificationProvider'
import { AuthProvider } from '@/features/auth'

function App() {
  return (
    <ThemeModeProvider>
      <NotificationProvider>
        <QueryProvider>
          <BrowserRouter>
            <AuthProvider>
              <AppRouter />
            </AuthProvider>
          </BrowserRouter>
        </QueryProvider>
      </NotificationProvider>
    </ThemeModeProvider>
  )
}

export default App
