import { z } from "zod";

// Register Validation
export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3)
      .max(16)
      .regex(/^[a-zA-Z0-9]*$/, {
        message: "Username must contain only letters and numbers",
      }),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Login Validation
export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
