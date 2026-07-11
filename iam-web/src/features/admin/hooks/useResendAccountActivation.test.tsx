import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/test-utils'
import { apiPost } from '@/shared/api/api-client'
import { useResendAccountActivation } from './useResendAccountActivation'

vi.mock('@/shared/api/api-client', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPatch: vi.fn(),
  apiDelete: vi.fn(),
}))

describe('useResendAccountActivation', () => {
  beforeEach(() => {
    vi.mocked(apiPost).mockReset()
  })

  it('calls the resend-activation endpoint with the given user id', async () => {
    vi.mocked(apiPost).mockResolvedValueOnce(undefined)
    const { result } = renderHook(() => useResendAccountActivation(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate('1')
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(apiPost).toHaveBeenCalledWith('/users/1/resend-activation')
  })

  it('surfaces the API error when the account is already activated', async () => {
    vi.mocked(apiPost).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 400, data: { message: 'Account is already activated' } },
    })
    const { result } = renderHook(() => useResendAccountActivation(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate('1')
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
