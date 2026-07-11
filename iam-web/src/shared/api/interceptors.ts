import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '@/shared/constants/env'
import { tokenStorage } from './token-storage'
import { emitSessionExpired } from './auth-events'

// Local, minimal contract for the refresh call — deliberately not imported from
// features/auth/types: shared must never depend on a feature (see ARCHITECTURE.md
// hierarchy: features → shared → external libraries, never the reverse).
interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const REFRESH_TOKEN_PATH = '/auth/refresh-token'

let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken()
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }
  // Plain axios call, not the intercepted `apiClient`: going through the
  // response interceptor here would recurse back into this same handler.
  const { data } = await axios.post<RefreshTokenResponse>(`${API_BASE_URL}${REFRESH_TOKEN_PATH}`, {
    refreshToken,
  })
  tokenStorage.setTokens(data.accessToken, data.refreshToken)
  return data.accessToken
}

export function attachInterceptors(client: AxiosInstance): void {
  client.interceptors.request.use((config) => {
    const accessToken = tokenStorage.getAccessToken()
    if (accessToken) {
      config.headers.set('Authorization', `Bearer ${accessToken}`)
    }
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetriableRequestConfig | undefined
      const isRefreshCall = originalRequest?.url?.includes(REFRESH_TOKEN_PATH)

      if (
        error.response?.status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        isRefreshCall
      ) {
        return Promise.reject(error)
      }

      originalRequest._retry = true

      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null
        })
        const accessToken = await refreshPromise
        originalRequest.headers.set('Authorization', `Bearer ${accessToken}`)
        return client(originalRequest)
      } catch (refreshError) {
        tokenStorage.clear()
        emitSessionExpired()
        return Promise.reject(refreshError)
      }
    },
  )
}
