import { z } from 'zod'

export const editUserSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
})

export type EditUserFormValues = z.infer<typeof editUserSchema>
