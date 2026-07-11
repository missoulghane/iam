import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.string().min(1, "L'email est requis").email('Format email invalide'),
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>
