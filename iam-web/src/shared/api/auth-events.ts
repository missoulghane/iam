// Decouples shared/api from features/auth: the interceptor detects an
// unrecoverable session (refresh failed) and emits here; features/auth's
// AuthProvider subscribes to react to it (clear state, redirect to /login).
type Listener = () => void

const listeners = new Set<Listener>()

export function onSessionExpired(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function emitSessionExpired(): void {
  listeners.forEach((listener) => listener())
}
