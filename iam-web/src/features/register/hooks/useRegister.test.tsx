import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/test-utils'
import { apiPost } from '@/shared/api/api-client'
import { useRegister } from './useRegister'

vi.mock('@/shared/api/api-client', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPatch: vi.fn(),
  apiDelete: vi.fn(),
}))

describe('useRegister', () => {
  beforeEach(() => {
    vi.mocked(apiPost).mockReset()
  })

  it('calls the register endpoint with the given payload', async () => {
    vi.mocked(apiPost).mockResolvedValueOnce(undefined)
    const { result } = renderHook(() => useRegister(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate({
        firstName: 'Alex',
        lastName: 'Martin',
        email: 'alex@iam.ma',
        password: 'ValidPassword123',
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(apiPost).toHaveBeenCalledWith('/users/register', {
      firstName: 'Alex',
      lastName: 'Martin',
      email: 'alex@iam.ma',
      password: 'ValidPassword123',
    })
  })

  it('surfaces the API error when registration fails', async () => {
    vi.mocked(apiPost).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 500, data: { message: 'An unexpected error occurred' } },
    })
    const { result } = renderHook(() => useRegister(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate({
        firstName: 'Alex',
        lastName: 'Martin',
        email: 'alex@iam.ma',
        password: 'ValidPassword123',
      })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
