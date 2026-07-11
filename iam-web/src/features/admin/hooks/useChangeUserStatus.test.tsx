import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/test-utils'
import { apiPatch } from '@/shared/api/api-client'
import type { UserResponse } from '@/shared/types/user'
import { useChangeUserStatus } from './useChangeUserStatus'

vi.mock('@/shared/api/api-client', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPatch: vi.fn(),
  apiDelete: vi.fn(),
}))

describe('useChangeUserStatus', () => {
  beforeEach(() => {
    vi.mocked(apiPatch).mockReset()
  })

  it('calls the change-status endpoint with the given user id and enabled flag', async () => {
    const updatedUser: UserResponse = {
      id: '1',
      email: 'user@iam.ma',
      firstName: 'Jane',
      lastName: 'Doe',
      roles: ['ROLE_USER'],
      verified: true,
      enabled: false,
    }
    vi.mocked(apiPatch).mockResolvedValueOnce(updatedUser)
    const { result } = renderHook(() => useChangeUserStatus(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate({ id: '1', enabled: false })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(apiPatch).toHaveBeenCalledWith('/users/1/status', { enabled: false })
  })
})
