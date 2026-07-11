import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router'
import { render, screen } from '@/test/test-utils'
import { AdminRoute } from './AdminRoute'
import { useAuth } from '../hooks/useAuth'

vi.mock('../hooks/useAuth', async () => {
  const actual = await vi.importActual<typeof import('../hooks/useAuth')>('../hooks/useAuth')
  return { ...actual, useAuth: vi.fn() }
})

function renderAdminRoute(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/login" element={<div>Login page</div>} />
        <Route path="/" element={<div>Home page</div>} />
        <Route element={<AdminRoute />}>
          <Route path="/admin/users" element={<div>Admin users page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('AdminRoute', () => {
  it('redirects to /login when unauthenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      status: 'unauthenticated',
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    })

    renderAdminRoute('/admin/users')

    expect(screen.getByText('Login page')).toBeInTheDocument()
  })

  it('redirects to / when authenticated but not an admin', () => {
    vi.mocked(useAuth).mockReturnValue({
      status: 'authenticated',
      user: {
        id: '1',
        email: 'user@iam.ma',
        firstName: 'Jane',
        lastName: 'Doe',
        roles: ['ROLE_USER'],
        verified: true,
        enabled: true,
      },
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    })

    renderAdminRoute('/admin/users')

    expect(screen.getByText('Home page')).toBeInTheDocument()
  })

  it('renders the nested route when authenticated as an admin', () => {
    vi.mocked(useAuth).mockReturnValue({
      status: 'authenticated',
      user: {
        id: '1',
        email: 'admin@iam.ma',
        firstName: 'Admin',
        lastName: 'IAM',
        roles: ['ROLE_ADMIN'],
        verified: true,
        enabled: true,
      },
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    })

    renderAdminRoute('/admin/users')

    expect(screen.getByText('Admin users page')).toBeInTheDocument()
  })
})
