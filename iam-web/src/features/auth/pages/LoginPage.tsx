import { CenteredCardLayout } from '@/shared/components/CenteredCardLayout'
import { LoginForm } from '../components/LoginForm'

export default function LoginPage() {
  return (
    <CenteredCardLayout title="Connexion" subtitle="Accédez à votre espace IAM">
      <LoginForm />
    </CenteredCardLayout>
  )
}
