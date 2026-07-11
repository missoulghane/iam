import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/test-utils'
import { apiGet } from '@/shared/api/api-client'
import type { UserResponse } from '@/shared/types/user'
import { useProfile } from './useProfile'

vi.mock('@/shared/api/api-client', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPatch: vi.fn(),
  apiDelete: vi.fn(),
}))

describe('useProfile', () => {
  beforeEach(() => {
    vi.mocked(apiGet).mockReset()
  })

  it('fetches the current user profile', async () => {
    const user: UserResponse = {
      id: '1',
      email: 'alex@iam.ma',
      firstName: 'Alex',
      lastName: 'Martin',
      roles: [],
      verified: true,
      enabled: true,
    }
    vi.mocked(apiGet).mockResolvedValueOnce(user)

    const { result } = renderHook(() => useProfile(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(user)
    expect(apiGet).toHaveBeenCalledWith('/users/me')
  })

  it('exposes an error state when the fetch fails', async () => {
    vi.mocked(apiGet).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 401,
        data: { message: 'Authentication is required to access this resource' },
      },
    })

    const { result } = renderHook(() => useProfile(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
