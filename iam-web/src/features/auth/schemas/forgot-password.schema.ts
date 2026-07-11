import { z } from 'zod'

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "L'email est requis").email('Format email invalide'),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
