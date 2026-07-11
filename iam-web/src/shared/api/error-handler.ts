import { isAxiosError } from 'axios'

// Shape observed empirically on the running API (not documented in the OpenAPI
// schema, which only lists success responses) — standard Spring Boot error body.
// `message` is a single string; for bean-validation failures it concatenates all
// field errors (e.g. "password: ne doit pas être vide, email: ne doit pas être
// vide"), so it is displayed as-is rather than mapped to individual form fields.
export interface ApiErrorBody {
  status: number
  error: string
  message: string
  path: string
  timestamp: string
}

const FALLBACK_MESSAGE = 'Une erreur inattendue est survenue. Veuillez réessayer.'
const NETWORK_ERROR_MESSAGE = 'Impossible de contacter le serveur. Vérifiez votre connexion.'

export function getErrorMessage(error: unknown): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message
    }
    if (!error.response) {
      return NETWORK_ERROR_MESSAGE
    }
  }
  if (error instanceof Error && error.message) {
    return error.message
  }
  return FALLBACK_MESSAGE
}

export function getErrorStatus(error: unknown): number | undefined {
  return isAxiosError<ApiErrorBody>(error) ? error.response?.status : undefined
}
