import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/test-utils'
import { apiDelete } from '@/shared/api/api-client'
import { useDeleteUser } from './useDeleteUser'

vi.mock('@/shared/api/api-client', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPatch: vi.fn(),
  apiDelete: vi.fn(),
}))

describe('useDeleteUser', () => {
  beforeEach(() => {
    vi.mocked(apiDelete).mockReset()
  })

  it('calls the delete endpoint with the given user id', async () => {
    vi.mocked(apiDelete).mockResolvedValueOnce(undefined)
    const { result } = renderHook(() => useDeleteUser(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate('1')
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(apiDelete).toHaveBeenCalledWith('/users/1')
  })
})
