import { z } from "zod";

export const colorFormSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Please enter the color name' }),

    hexCode: z
        .string()
        .min(4, { message: 'Please enter a valid hex code' })
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { message: 'Invalid hex code format' }),

    isActive: z
        .boolean()
        .optional(),
});
