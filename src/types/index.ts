import { UserSchema } from "../validators/userValidator";
import {
  CreateSongSchema,
  UpdateSongSchema,
} from "../validators/songValidator";
import z from "zod";

export type CreateSongInput = z.infer<typeof CreateSongSchema>;
export type UpdateSongInput = z.infer<typeof UpdateSongSchema>;

export type UserInput = z.infer<typeof UserSchema>;

export type User = {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  album?: string;
  year?: number;
  userId: string;
  createdAt: Date;
};
