import { z } from "zod";

// Schema for creating a user
export const UserSchema = z.object({
  username: z.string().min(4).max(20),
  password: z.string().min(6).max(50),
});