import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router'
import { ThemeModeProvider } from '@/app/providers/ThemeModeProvider'
import { NotificationProvider } from '@/shared/components/NotificationProvider'
import { AuthProvider } from '@/features/auth'
import { createTestQueryClient } from '@/test/test-utils'
import { apiGet, apiPatch } from '@/shared/api/api-client'
import EditUserPage from './EditUserPage'

vi.mock('@/shared/api/api-client', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPut: vi.fn(),
  apiPatch: vi.fn(),
  apiDelete: vi.fn(),
}))

function renderEditUserPage(id = '1') {
  const client = createTestQueryClient()
  return render(
    <QueryClientProvider client={client}>
      <ThemeModeProvider>
        <NotificationProvider>
          <MemoryRouter initialEntries={[`/admin/users/${id}/edit`]}>
            <AuthProvider>
              <Routes>
                <Route path="/admin/users/:id/edit" element={<EditUserPage />} />
              </Routes>
            </AuthProvider>
          </MemoryRouter>
        </NotificationProvider>
      </ThemeModeProvider>
    </QueryClientProvider>,
  )
}

describe('EditUserPage', () => {
  beforeEach(() => {
    vi.mocked(apiGet).mockReset()
    vi.mocked(apiPatch).mockReset()
  })

  it('pre-fills the form with the user values', async () => {
    vi.mocked(apiGet).mockResolvedValueOnce({
      id: '1',
      email: 'jane.doe@iam.ma',
      firstName: 'Jane',
      lastName: 'Doe',
      roles: ['ROLE_USER'],
      verified: true,
      enabled: true,
    })
    renderEditUserPage()

    expect(await screen.findByLabelText('Prénom')).toHaveValue('Jane')
    expect(screen.getByLabelText('Nom')).toHaveValue('Doe')
  })

  it('updates the user with the entered values', async () => {
    vi.mocked(apiGet).mockResolvedValueOnce({
      id: '1',
      email: 'jane.doe@iam.ma',
      firstName: 'Jane',
      lastName: 'Doe',
      roles: ['ROLE_USER'],
      verified: true,
      enabled: true,
    })
    vi.mocked(apiPatch).mockResolvedValueOnce(undefined)
    const testUser = userEvent.setup()
    renderEditUserPage()

    await screen.findByLabelText('Prénom')
    await testUser.clear(screen.getByLabelText('Prénom'))
    await testUser.type(screen.getByLabelText('Prénom'), 'Janet')
    await testUser.click(screen.getByRole('button', { name: 'Enregistrer' }))

    await waitFor(() => {
      expect(apiPatch).toHaveBeenCalledWith('/users/1/profile', {
        firstName: 'Janet',
        lastName: 'Doe',
      })
    })
  })
})
