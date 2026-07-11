import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/test-utils'
import { apiGet } from '@/shared/api/api-client'
import type { PageResponse } from '@/shared/types/page'
import type { UserResponse } from '@/shared/types/user'
import { useUsersList } from './useUsersList'

vi.mock('@/shared/api/api-client', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPatch: vi.fn(),
  apiDelete: vi.fn(),
}))

describe('useUsersList', () => {
  beforeEach(() => {
    vi.mocked(apiGet).mockReset()
  })

  it('fetches a page of users with the given pagination and filters', async () => {
    const page: PageResponse<UserResponse> = {
      content: [],
      pageNumber: 0,
      pageSize: 20,
      totalElements: 0,
      totalPages: 0,
    }
    vi.mocked(apiGet).mockResolvedValueOnce(page)

    const { result } = renderHook(
      () => useUsersList(0, 20, { search: 'alex', role: 'ROLE_ADMIN' }),
      {
        wrapper: createWrapper(),
      },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(page)
    expect(apiGet).toHaveBeenCalledWith('/users', {
      params: { page: 0, size: 20, search: 'alex', role: 'ROLE_ADMIN' },
    })
  })

  it('exposes an error state when the fetch fails', async () => {
    vi.mocked(apiGet).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 403, data: { message: 'Access is denied' } },
    })

    const { result } = renderHook(() => useUsersList(0, 20, {}), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
