import { z } from "zod";

export const sizeFormSchema = z.object({
    itemType: z.enum(['Clothing', 'Shoes'], {
        required_error: "Please select an item type",
    }),
    gender: z.enum(['Male', 'Female'], {
        required_error: "Please select a gender",
    }),
    size: z.string().min(1, { message: 'Please enter the size' }),
    serial: z.string().optional(),
    // sizeChart and measurements will be handled as objects in the form
    sizeChart: z.record(z.string()).optional(),
    measurements: z.record(z.string()).optional(),
    isActive: z.boolean().optional(),
});
