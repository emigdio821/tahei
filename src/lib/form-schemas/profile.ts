import { z } from 'zod'

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .max(100, 'New password must be less than 100 characters'),
    newPasswordConfirmation: z
      .string()
      .min(8, 'Please confirm your new password')
      .max(100, 'New password confirmation must be less than 100 characters'),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.newPasswordConfirmation) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['newPasswordConfirmation'],
      })
    }
  })

export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>
