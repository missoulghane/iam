import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '@/test/test-utils'
import { apiPost } from '@/shared/api/api-client'
import { RegisterForm } from './RegisterForm'

vi.mock('@/shared/api/api-client', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPatch: vi.fn(),
  apiDelete: vi.fn(),
}))

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.mocked(apiPost).mockReset()
  })

  it('renders all fields', () => {
    renderWithProviders(<RegisterForm />)
    expect(screen.getByLabelText('Prénom')).toBeInTheDocument()
    expect(screen.getByLabelText('Nom')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirmer le mot de passe')).toBeInTheDocument()
  })

  it('validates password length and confirmation match, without calling the API', async () => {
    const user = userEvent.setup()
    renderWithProviders(<RegisterForm />)

    await user.type(screen.getByLabelText('Prénom'), 'Alex')
    await user.type(screen.getByLabelText('Nom'), 'Martin')
    await user.type(screen.getByLabelText('Email'), 'alex@iam.ma')
    await user.type(screen.getByLabelText('Mot de passe'), 'short')
    await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'different')
    await user.click(screen.getByRole('button', { name: 'Créer mon compte' }))

    expect(
      await screen.findByText('Le mot de passe doit contenir au moins 10 caractères'),
    ).toBeInTheDocument()
    expect(await screen.findByText('Les mots de passe ne correspondent pas')).toBeInTheDocument()
    expect(apiPost).not.toHaveBeenCalled()
  })

  it('registers with the confirmPassword field stripped, then shows the confirmation screen', async () => {
    vi.mocked(apiPost).mockResolvedValueOnce(undefined)
    const user = userEvent.setup()
    renderWithProviders(<RegisterForm />)

    await user.type(screen.getByLabelText('Prénom'), 'Alex')
    await user.type(screen.getByLabelText('Nom'), 'Martin')
    await user.type(screen.getByLabelText('Email'), 'alex@iam.ma')
    await user.type(screen.getByLabelText('Mot de passe'), 'ValidPassword123')
    await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'ValidPassword123')
    await user.click(screen.getByRole('button', { name: 'Créer mon compte' }))

    await vi.waitFor(() => {
      expect(apiPost).toHaveBeenCalledWith('/users/register', {
        firstName: 'Alex',
        lastName: 'Martin',
        email: 'alex@iam.ma',
        password: 'ValidPassword123',
      })
    })
    expect(await screen.findByText(/Votre compte a été créé/)).toBeInTheDocument()
  })

  it('displays the API error message when registration fails', async () => {
    vi.mocked(apiPost).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 500, data: { message: 'An unexpected error occurred' } },
    })
    const user = userEvent.setup()
    renderWithProviders(<RegisterForm />)

    await user.type(screen.getByLabelText('Prénom'), 'Alex')
    await user.type(screen.getByLabelText('Nom'), 'Martin')
    await user.type(screen.getByLabelText('Email'), 'alex@iam.ma')
    await user.type(screen.getByLabelText('Mot de passe'), 'ValidPassword123')
    await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'ValidPassword123')
    await user.click(screen.getByRole('button', { name: 'Créer mon compte' }))

    expect(await screen.findByText('An unexpected error occurred')).toBeInTheDocument()
  })
})
