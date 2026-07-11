import { z } from 'zod'

// `confirmPassword` is a client-only field, stripped before the API call.
export const registerSchema = z
  .object({
    firstName: z.string().min(1, 'Le prénom est requis'),
    lastName: z.string().min(1, 'Le nom est requis'),
    email: z.string().min(1, "L'email est requis").email('Format email invalide'),
    password: z.string().min(10, 'Le mot de passe doit contenir au moins 10 caractères'),
    confirmPassword: z.string().min(1, 'La confirmation est requise'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
