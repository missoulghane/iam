import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/test-utils'
import { apiGet, apiPost } from '@/shared/api/api-client'
import { useLogin } from './useLogin'

vi.mock('@/shared/api/api-client', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPatch: vi.fn(),
  apiDelete: vi.fn(),
}))

describe('useLogin', () => {
  beforeEach(() => {
    vi.mocked(apiPost).mockReset()
    vi.mocked(apiGet).mockReset()
  })

  it('logs in, persists the tokens, and fetches the current user', async () => {
    vi.mocked(apiPost).mockResolvedValueOnce({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      tokenType: 'Bearer',
      expiresIn: 900,
    })
    vi.mocked(apiGet).mockResolvedValueOnce({
      id: '1',
      email: 'alex@iam.ma',
      firstName: 'Alex',
      lastName: 'Martin',
      roles: [],
      verified: true,
      enabled: true,
    })

    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate({ email: 'alex@iam.ma', password: 'password123' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(apiPost).toHaveBeenCalledWith('/auth/login', {
      email: 'alex@iam.ma',
      password: 'password123',
    })
    expect(apiGet).toHaveBeenCalledWith('/users/me')
    expect(localStorage.getItem('iam_access_token')).toBe('access-token')
  })

  it('surfaces an error on invalid credentials without storing any token', async () => {
    vi.mocked(apiPost).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 403, data: { message: 'Invalid credentials' } },
    })

    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate({ email: 'alex@iam.ma', password: 'wrong' })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(localStorage.getItem('iam_access_token')).toBeNull()
  })
})
