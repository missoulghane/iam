import { describe, expect, it } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import type { UserResponse } from '@/shared/types/user'
import { ProfileInfoCard } from './ProfileInfoCard'

const user: UserResponse = {
  id: '1',
  email: 'alex.martin@iam.ma',
  firstName: 'Alex',
  lastName: 'Martin',
  roles: ['ROLE_USER'],
  verified: true,
  enabled: true,
}

describe('ProfileInfoCard', () => {
  it('displays the user identity, email, and roles', () => {
    renderWithProviders(<ProfileInfoCard user={user} />)

    expect(screen.getByText('Alex Martin')).toBeInTheDocument()
    expect(screen.getByText('alex.martin@iam.ma')).toBeInTheDocument()
    expect(screen.getByText('ROLE_USER')).toBeInTheDocument()
  })

  it('shows a verified badge when the account is verified', () => {
    renderWithProviders(<ProfileInfoCard user={user} />)
    expect(screen.getByText('Compte vérifié')).toBeInTheDocument()
  })

  it('shows an unverified badge when the account is not verified', () => {
    renderWithProviders(<ProfileInfoCard user={{ ...user, verified: false }} />)
    expect(screen.getByText('Compte non vérifié')).toBeInTheDocument()
  })
})
