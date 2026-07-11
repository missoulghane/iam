import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '@/test/test-utils'
import { apiPost } from '@/shared/api/api-client'
import { ForgotPasswordForm } from './ForgotPasswordForm'

vi.mock('@/shared/api/api-client', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPatch: vi.fn(),
  apiDelete: vi.fn(),
}))

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    vi.mocked(apiPost).mockReset()
  })

  it('requires a non-empty email and does not call the API', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ForgotPasswordForm />)

    await user.click(screen.getByRole('button', { name: 'Envoyer le lien' }))

    expect(await screen.findByText("L'email est requis")).toBeInTheDocument()
    expect(apiPost).not.toHaveBeenCalled()
  })

  it('shows a generic success message after submitting', async () => {
    vi.mocked(apiPost).mockResolvedValueOnce(undefined)
    const user = userEvent.setup()
    renderWithProviders(<ForgotPasswordForm />)

    await user.type(screen.getByLabelText('Email'), 'anyone@iam.ma')
    await user.click(screen.getByRole('button', { name: 'Envoyer le lien' }))

    expect(await screen.findByText(/vient d'être envoyé/)).toBeInTheDocument()
    expect(apiPost).toHaveBeenCalledWith('/auth/forgot-password', { email: 'anyone@iam.ma' })
  })
})
