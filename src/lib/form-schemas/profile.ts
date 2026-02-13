import { z } from 'zod'
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../constants'

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, `New password must be at least ${PASSWORD_MIN_LENGTH} characters`)
      .max(PASSWORD_MAX_LENGTH, `New password must be less than ${PASSWORD_MAX_LENGTH} characters`),
    newPasswordConfirmation: z
      .string()
      .min(PASSWORD_MIN_LENGTH, `Please confirm your new password`)
      .max(
        PASSWORD_MAX_LENGTH,
        `New password confirmation must be less than ${PASSWORD_MAX_LENGTH} characters`,
      ),
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
