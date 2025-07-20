import { z } from "zod";

// Schema for creating a song
export const CreateSongSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Artist is required"),
  album: z.string().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
});

// Schema for updating a song
export const UpdateSongSchema = z.object({
  title: z.string().min(1).optional(),
  artist: z.string().min(1).optional(),
  album: z.string().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
});
