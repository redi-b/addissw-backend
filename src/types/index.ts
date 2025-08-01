import { UserSchema } from "../validators/userValidator";
import { CreateSongSchema, UpdateSongSchema } from "../validators/songValidator";
import z from "zod";

export type CreateSongInput = z.infer<typeof CreateSongSchema>;
export type UpdateSongInput = z.infer<typeof UpdateSongSchema>;

export type UserInput = z.infer<typeof UserSchema>;
