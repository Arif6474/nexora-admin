import { z } from "zod";

export const productFormSchema = z.object({

    title: z
        .string()
        .min(1, { message: 'Please enter the product title' }),

    description: z
        .string()
        .min(1, { message: 'Please provide a description for the product' }),

    price: z
        .string()
        .min(0, { message: 'Please provide a valid price' }),

    quantity: z
        .string()
        .min(0, { message: 'Quantity cannot be negative' }),

    gender: z
        .enum(['Men', 'Women', 'Unisex', 'Kids'], {
            errorMap: () => ({ message: "Please select a valid gender category" }),
        })
        .default('Unisex'),

    discount: z
        .string()
        .optional()
        .default('0'),

    subCategory: z
        .string()
        .optional(),

    sku: z
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
