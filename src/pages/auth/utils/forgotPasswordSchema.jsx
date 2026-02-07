import { z } from "zod";

export const forgotPasswordSchema = z.object({
    email: z
      .string()
      .min(1, { message: 'Please enter your email' })
      .email({ message: 'Invalid email address' }),
  })
  