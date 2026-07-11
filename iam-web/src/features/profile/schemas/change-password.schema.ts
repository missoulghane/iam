import { z } from 'zod'

// `confirmNewPassword` is a client-only field, stripped before the API call.
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "L'ancien mot de passe est requis"),
    newPassword: z.string().min(10, 'Le mot de passe doit contenir au moins 10 caractères'),
    confirmNewPassword: z.string().min(1, 'La confirmation est requise'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmNewPassword'],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
