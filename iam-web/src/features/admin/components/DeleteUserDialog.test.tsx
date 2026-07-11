import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '@/test/test-utils'
import { apiDelete } from '@/shared/api/api-client'
import type { UserResponse } from '@/shared/types/user'
import { DeleteUserDialog } from './DeleteUserDialog'

vi.mock('@/shared/api/api-client', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPatch: vi.fn(),
  apiDelete: vi.fn(),
}))

const user: UserResponse = {
  id: '1',
  email: 'jane.doe@iam.ma',
  firstName: 'Jane',
  lastName: 'Doe',
  roles: ['ROLE_USER'],
  verified: true,
  enabled: true,
}

describe('DeleteUserDialog', () => {
  beforeEach(() => {
    vi.mocked(apiDelete).mockReset()
  })

  it('does not call the API when cancelled', async () => {
    const onClose = vi.fn()
    const testUser = userEvent.setup()
    renderWithProviders(<DeleteUserDialog open user={user} onClose={onClose} />)

    await testUser.click(screen.getByText('Annuler'))

    expect(apiDelete).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('deletes the user and notifies onDeleted when confirmed', async () => {
    vi.mocked(apiDelete).mockResolvedValueOnce(undefined)
    const onClose = vi.fn()
    const onDeleted = vi.fn()
    const testUser = userEvent.setup()
    renderWithProviders(
      <DeleteUserDialog open user={user} onClose={onClose} onDeleted={onDeleted} />,
    )

    await testUser.click(screen.getByText('Supprimer'))

    await vi.waitFor(() => expect(apiDelete).toHaveBeenCalledWith('/users/1'))
    await vi.waitFor(() => expect(onDeleted).toHaveBeenCalledTimes(1))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
