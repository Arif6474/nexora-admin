import { z } from "zod";

export const subcategoryFormSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Please enter the subcategory name' }),

    description: z
        .string()
        .optional(),

    image: z
        .string()
        .optional(),

    isFeatured: z
        .boolean()
        .optional(),

    isActive: z
        .boolean()
        .optional(),
});
