import type { PropsWithChildren, ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import { ThemeModeProvider } from '@/app/providers/ThemeModeProvider'
import { NotificationProvider } from '@/shared/components/NotificationProvider'
import { AuthProvider } from '@/features/auth'

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

interface ProvidersOptions {
  initialEntries?: string[]
  queryClient?: QueryClient
}

// Every provider a component/hook might reach for in tests: query cache,
// theme, notifications, routing, and the auth session — mirrors the real
// composition in App.tsx so components behave the same as in the app.
export function createWrapper({ initialEntries = ['/'], queryClient }: ProvidersOptions = {}) {
  const client = queryClient ?? createTestQueryClient()

  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={client}>
        <ThemeModeProvider>
          <NotificationProvider>
            <MemoryRouter initialEntries={initialEntries}>
              <AuthProvider>{children}</AuthProvider>
            </MemoryRouter>
          </NotificationProvider>
        </ThemeModeProvider>
      </QueryClientProvider>
    )
  }
}

export function renderWithProviders(
  ui: ReactElement,
  options: ProvidersOptions & Omit<RenderOptions, 'wrapper'> = {},
) {
  const { initialEntries, queryClient, ...renderOptions } = options
  return render(ui, {
    wrapper: createWrapper({ initialEntries, queryClient }),
    ...renderOptions,
  })
}

export * from '@testing-library/react'
