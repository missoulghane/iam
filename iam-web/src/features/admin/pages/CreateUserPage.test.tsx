import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '@/test/test-utils'
import { apiPost } from '@/shared/api/api-client'
import CreateUserPage from './CreateUserPage'

vi.mock('@/shared/api/api-client', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPut: vi.fn(),
  apiPatch: vi.fn(),
  apiDelete: vi.fn(),
}))

describe('CreateUserPage', () => {
  beforeEach(() => {
    vi.mocked(apiPost).mockReset()
  })

  it('requires all fields to be filled', async () => {
    const testUser = userEvent.setup()
    renderWithProviders(<CreateUserPage />)

    await testUser.click(screen.getByRole('button', { name: 'Créer' }))

    expect(await screen.findByText("L'email est requis")).toBeInTheDocument()
    expect(apiPost).not.toHaveBeenCalled()
  })

  it('creates the user with the entered values', async () => {
    vi.mocked(apiPost).mockResolvedValueOnce(undefined)
    const testUser = userEvent.setup()
    renderWithProviders(<CreateUserPage />)

    await testUser.type(screen.getByLabelText('Email'), 'new-user@iam.ma')
    await testUser.type(screen.getByLabelText('Prénom'), 'Jane')
    await testUser.type(screen.getByLabelText('Nom'), 'Doe')
    await testUser.click(screen.getByRole('button', { name: 'Créer' }))

    await vi.waitFor(() => {
      expect(apiPost).toHaveBeenCalledWith('/users', {
        email: 'new-user@iam.ma',
        firstName: 'Jane',
        lastName: 'Doe',
      })
    })
  })
})
