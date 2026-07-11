import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/test-utils'
import { apiPost } from '@/shared/api/api-client'
import { useCreateUser } from './useCreateUser'

vi.mock('@/shared/api/api-client', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPatch: vi.fn(),
  apiDelete: vi.fn(),
}))

describe('useCreateUser', () => {
  beforeEach(() => {
    vi.mocked(apiPost).mockReset()
  })

  it('calls the create-user endpoint with the given payload', async () => {
    vi.mocked(apiPost).mockResolvedValueOnce(undefined)
    const { result } = renderHook(() => useCreateUser(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate({
        email: 'new-user@iam.ma',
        firstName: 'Jane',
        lastName: 'Doe',
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(apiPost).toHaveBeenCalledWith('/users', {
      email: 'new-user@iam.ma',
      firstName: 'Jane',
      lastName: 'Doe',
    })
  })

  it('surfaces the API error when creation fails', async () => {
    vi.mocked(apiPost).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 400,
        data: { message: 'An account already exists with email: new-user@iam.ma' },
      },
    })
    const { result } = renderHook(() => useCreateUser(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate({
        email: 'new-user@iam.ma',
        firstName: 'Jane',
        lastName: 'Doe',
      })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
