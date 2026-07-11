import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '@/test/test-utils'
import { apiGet, apiPatch } from '@/shared/api/api-client'
import type { UserResponse } from '@/shared/types/user'
import { ProfileEditForm } from './ProfileEditForm'

vi.mock('@/shared/api/api-client', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPatch: vi.fn(),
  apiDelete: vi.fn(),
}))

const user: UserResponse = {
  id: '1',
  email: 'alex.martin@iam.ma',
  firstName: 'Alex',
  lastName: 'Martin',
  roles: [],
  verified: true,
  enabled: true,
}

describe('ProfileEditForm', () => {
  beforeEach(() => {
    vi.mocked(apiPatch).mockReset()
    vi.mocked(apiGet).mockReset()
    // useUpdateProfile calls refreshUser() (GET /users/me) after a successful save.
    vi.mocked(apiGet).mockResolvedValue(user)
  })

  it('pre-fills the form with the current first and last name', () => {
    renderWithProviders(<ProfileEditForm user={user} />)
    expect(screen.getByLabelText('Prénom')).toHaveValue('Alex')
    expect(screen.getByLabelText('Nom')).toHaveValue('Martin')
  })

  it('requires non-empty first and last name', async () => {
    const testUser = userEvent.setup()
    renderWithProviders(<ProfileEditForm user={user} />)

    await testUser.clear(screen.getByLabelText('Prénom'))
    await testUser.click(screen.getByRole('button', { name: 'Enregistrer' }))

    expect(await screen.findByText('Le prénom est requis')).toBeInTheDocument()
    expect(apiPatch).not.toHaveBeenCalled()
  })

  it('saves the updated first and last name', async () => {
    vi.mocked(apiPatch).mockResolvedValueOnce({ ...user, firstName: 'Alexandre' })
    const testUser = userEvent.setup()
    renderWithProviders(<ProfileEditForm user={user} />)

    await testUser.clear(screen.getByLabelText('Prénom'))
    await testUser.type(screen.getByLabelText('Prénom'), 'Alexandre')
    await testUser.click(screen.getByRole('button', { name: 'Enregistrer' }))

    await vi.waitFor(() => {
      expect(apiPatch).toHaveBeenCalledWith('/users/me/profile', {
        firstName: 'Alexandre',
        lastName: 'Martin',
      })
    })
    expect(await screen.findByText('Profil mis à jour avec succès.')).toBeInTheDocument()
  })
})
