import { z } from "zod";

export const productSizeFormSchema = z.object({
    size: z.string().min(1, "Size is required"),
    serial: z.string().optional(),
});
