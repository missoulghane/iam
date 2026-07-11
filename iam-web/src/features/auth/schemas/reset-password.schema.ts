import { z } from 'zod'

// `token` is not part of the form: it comes from the URL query string and is
// combined with the form values at submit time (see ResetPasswordForm).
export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(10, 'Le mot de passe doit contenir au moins 10 caractères'),
    confirmPassword: z.string().min(1, 'La confirmation est requise'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
