import { z } from "zod";

export const productColorFormSchema = z.object({
    color: z.string().min(1, "Color is required"),
    serial: z.string().optional(),
});
