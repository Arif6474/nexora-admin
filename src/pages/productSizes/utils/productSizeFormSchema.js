import { z } from "zod";

export const productSizeFormSchema = z.object({
    size: z.string().min(1, "Size is required"),
    quantity: z.string().min(1, "Quantity is required"),
});
