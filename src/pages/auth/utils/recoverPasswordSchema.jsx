import { z } from "zod";

export const recoverPasswordSchema = z
    .object({
        password: z
            .string()
            .min(1, {
                message: 'Please enter your password',
            })
            .min(4, {
                message: 'Password must be at least 4 characters long',
            }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match.",
        path: ['confirmPassword'],
    })