import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '@/test/test-utils'
import { apiPatch } from '@/shared/api/api-client'
import { ChangePasswordForm } from './ChangePasswordForm'

vi.mock('@/shared/api/api-client', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPatch: vi.fn(),
  apiDelete: vi.fn(),
}))

describe('ChangePasswordForm', () => {
  beforeEach(() => {
    vi.mocked(apiPatch).mockReset()
  })

  it('validates the new password length and confirmation match, without calling the API', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ChangePasswordForm />)

    await user.type(screen.getByLabelText('Mot de passe actuel'), 'OldPassword123')
    await user.type(screen.getByLabelText('Nouveau mot de passe'), 'short')
    await user.type(screen.getByLabelText('Confirmer le nouveau mot de passe'), 'different')
    await user.click(screen.getByRole('button', { name: 'Modifier le mot de passe' }))

    expect(
      await screen.findByText('Le mot de passe doit contenir au moins 10 caractères'),
    ).toBeInTheDocument()
    expect(await screen.findByText('Les mots de passe ne correspondent pas')).toBeInTheDocument()
    expect(apiPatch).not.toHaveBeenCalled()
  })

  it('submits the current and new password, then resets the form on success', async () => {
    vi.mocked(apiPatch).mockResolvedValueOnce(undefined)
    const user = userEvent.setup()
    renderWithProviders(<ChangePasswordForm />)

    await user.type(screen.getByLabelText('Mot de passe actuel'), 'OldPassword123')
    await user.type(screen.getByLabelText('Nouveau mot de passe'), 'NewValidPassword123')
    await user.type(
      screen.getByLabelText('Confirmer le nouveau mot de passe'),
      'NewValidPassword123',
    )
    await user.click(screen.getByRole('button', { name: 'Modifier le mot de passe' }))

    await vi.waitFor(() => {
      expect(apiPatch).toHaveBeenCalledWith('/users/me/password', {
        currentPassword: 'OldPassword123',
        newPassword: 'NewValidPassword123',
      })
    })
    expect(await screen.findByText('Mot de passe modifié avec succès.')).toBeInTheDocument()
    expect(screen.getByLabelText('Mot de passe actuel')).toHaveValue('')
  })

  it('displays the API error message when the current password is wrong', async () => {
    vi.mocked(apiPatch).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 400, data: { message: 'Mot de passe actuel incorrect' } },
    })
    const user = userEvent.setup()
    renderWithProviders(<ChangePasswordForm />)

    await user.type(screen.getByLabelText('Mot de passe actuel'), 'WrongPassword123')
    await user.type(screen.getByLabelText('Nouveau mot de passe'), 'NewValidPassword123')
    await user.type(
      screen.getByLabelText('Confirmer le nouveau mot de passe'),
      'NewValidPassword123',
    )
    await user.click(screen.getByRole('button', { name: 'Modifier le mot de passe' }))

    expect(await screen.findByText('Mot de passe actuel incorrect')).toBeInTheDocument()
  })
})
