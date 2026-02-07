import { z } from "zod";

export const signUpFormSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Please enter your name" }),
    email: z
      .string()
      .min(1, { message: "Please enter your email" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(1, {
        message: "Please enter your password",
      })
      .min(4, {
        message: "Password must be at least 4 characters long",
      }),
    confirmPassword: z.string(),
    phone: z
      .string()
      .min(1, { message: "Please enter your phone number" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });
