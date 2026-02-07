import { z } from "zod";

export const productImageFormSchema = z.object({
    image: z.string().optional(),
    serial: z.string().optional(),
});
