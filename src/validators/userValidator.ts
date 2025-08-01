import { z } from "zod";

// Schema for creating a user
export const UserSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters long")
    .max(20, "Username must be at most 20 characters long"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(50, "Password must be at most 50 characters long"),
});
