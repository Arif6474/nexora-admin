import { z } from "zod";

export const testimonialFormSchema = z.object({
    author: z
        .string()
        .min(1, { message: 'Please enter author name' }),

    role: z
        .string()
        .optional(),

    content: z
        .string()
        .min(1, { message: 'Please enter testimonial content' }),

    rating: z.coerce
        .number()
        .min(1, { message: 'Rating must be at least 1' })
        .max(5, { message: 'Rating cannot exceed 5' })
        .default(5),

    size: z
        .enum(['small', 'medium', 'large'])
        .default('medium'),

    serial: z.coerce
        .number()
        .min(1, { message: 'Serial must be at least 1' })
        .default(1),

    image: z
        .string()
        .optional(),

    isActive: z
        .boolean()
        .optional(),
});
