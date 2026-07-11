import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '@/test/test-utils'
import { apiGet, apiPost } from '@/shared/api/api-client'
import { LoginForm } from './LoginForm'

vi.mock('@/shared/api/api-client', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPatch: vi.fn(),
  apiDelete: vi.fn(),
}))

describe('LoginForm', () => {
  beforeEach(() => {
    vi.mocked(apiGet).mockReset()
    vi.mocked(apiPost).mockReset()
  })

  it('renders the email and password fields', () => {
    renderWithProviders(<LoginForm />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Se connecter' })).toBeInTheDocument()
  })

  it('shows validation errors when submitted empty and does not call the API', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    await user.click(screen.getByRole('button', { name: 'Se connecter' }))

    expect(await screen.findByText("L'email est requis")).toBeInTheDocument()
    expect(await screen.findByText('Le mot de passe est requis')).toBeInTheDocument()
    expect(apiPost).not.toHaveBeenCalled()
  })

  it('logs in and fetches the current user on valid credentials', async () => {
    vi.mocked(apiPost).mockResolvedValueOnce({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      tokenType: 'Bearer',
      expiresIn: 900,
    })
    vi.mocked(apiGet).mockResolvedValueOnce({
      id: '1',
      email: 'alex@iam.ma',
      firstName: 'Alex',
      lastName: 'Martin',
      roles: [],
      verified: true,
      enabled: true,
    })

    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    await user.type(screen.getByLabelText('Email'), 'alex@iam.ma')
    await user.type(screen.getByLabelText('Mot de passe'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Se connecter' }))

    await vi.waitFor(() => {
      expect(apiPost).toHaveBeenCalledWith('/auth/login', {
        email: 'alex@iam.ma',
        password: 'password123',
      })
    })
    await vi.waitFor(() => expect(apiGet).toHaveBeenCalledWith('/users/me'))
  })

  it('displays the API error message on invalid credentials', async () => {
    vi.mocked(apiPost).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 403,
        data: {
          status: 403,
          error: 'Forbidden',
          message: 'Invalid credentials',
          path: '/api/v1/auth/login',
          timestamp: new Date().toISOString(),
        },
      },
    })

    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    await user.type(screen.getByLabelText('Email'), 'alex@iam.ma')
    await user.type(screen.getByLabelText('Mot de passe'), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: 'Se connecter' }))

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
  })
})
