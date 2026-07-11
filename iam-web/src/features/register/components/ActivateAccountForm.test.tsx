import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '@/test/test-utils'
import { apiPost } from '@/shared/api/api-client'
import { ActivateAccountForm } from './ActivateAccountForm'

vi.mock('@/shared/api/api-client', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPatch: vi.fn(),
  apiDelete: vi.fn(),
}))

describe('ActivateAccountForm', () => {
  beforeEach(() => {
    vi.mocked(apiPost).mockReset()
  })

  it('shows an error when the token is missing from the URL', () => {
    renderWithProviders(<ActivateAccountForm />, { initialEntries: ['/activate-account'] })

    expect(screen.getByText("Ce lien d'activation est invalide ou incomplet.")).toBeInTheDocument()
  })

  it('requires a password of at least 10 characters', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ActivateAccountForm />, {
      initialEntries: ['/activate-account?token=abc123'],
    })

    await user.type(screen.getByLabelText('Mot de passe'), 'short')
    await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'short')
    await user.click(screen.getByRole('button', { name: 'Activer mon compte' }))

    expect(
      await screen.findByText('Le mot de passe doit contenir au moins 10 caractères'),
    ).toBeInTheDocument()
    expect(apiPost).not.toHaveBeenCalled()
  })

  it('requires the password confirmation to match', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ActivateAccountForm />, {
      initialEntries: ['/activate-account?token=abc123'],
    })

    await user.type(screen.getByLabelText('Mot de passe'), 'newpassword123')
    await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'different123')
    await user.click(screen.getByRole('button', { name: 'Activer mon compte' }))

    expect(await screen.findByText('Les mots de passe ne correspondent pas')).toBeInTheDocument()
    expect(apiPost).not.toHaveBeenCalled()
  })

  it('activates the account with the token and chosen password', async () => {
    vi.mocked(apiPost).mockResolvedValueOnce(undefined)
    const user = userEvent.setup()
    renderWithProviders(<ActivateAccountForm />, {
      initialEntries: ['/activate-account?token=abc123'],
    })

    await user.type(screen.getByLabelText('Mot de passe'), 'newpassword123')
    await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'newpassword123')
    await user.click(screen.getByRole('button', { name: 'Activer mon compte' }))

    await vi.waitFor(() => {
      expect(apiPost).toHaveBeenCalledWith('/users/activate-account', {
        token: 'abc123',
        newPassword: 'newpassword123',
      })
    })
  })
})
