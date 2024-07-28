import * as z from "zod"; // Importing the Zod library for schema validation

// Define a schema for login form validation
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"), // Username must be a non-empty string
  password: z.string().min(1, "Password is required"), // Password must be a non-empty string
});

// Infer the TypeScript type from the login schema
export type LoginFormData = z.infer<typeof loginSchema>;

// Define a schema for signup form validation
export const signupSchema = z
  .object({
    username: z.string().min(2, "Username must be at least 2 characters long"), // Username must be at least 2 characters long
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters long"), // First name must be at least 2 characters long
    lastName: z.string().min(2, "Last name must be at least 2 characters long"), // Last name must be at least 2 characters long
    email: z.string().email("Invalid email address"), // Email must be a valid email address
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long") // Password must be at least 8 characters long
      .max(50, "Password must be less than 50 characters"), // Password must be less than 50 characters
    confirmPassword: z.string().min(1, "Please confirm your password"), // Confirm password must be a non-empty string
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match", // Error message if passwords do not match
    path: ["confirmPassword"], // Path to the field that will show the error
  });

// Infer the TypeScript type from the signup schema
export type SignUpFormData = z.infer<typeof signupSchema>;
