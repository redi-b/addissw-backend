import { Request, Response } from "express";
import { z } from "zod";

import { CreateSongSchema, UpdateSongSchema } from "../validators/songValidator";
import * as SongService from "../services/songService";

// Create a new song
export async function createSong(req: Request, res: Response) {
  try {
    const data = CreateSongSchema.parse(req.body);
    const song = await SongService.createSong(data);
    return res.status(201).json(song);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Get paginated songs
export async function getAllSongs(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    if (page < 1 || pageSize < 1)
      return res.status(400).json({ message: "Invalid pagination parameters" });

    const result = await SongService.getSongs(page, pageSize);
    return res.json(result); // returns { songs, total }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Get a single song by ID
export async function getSongById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid song ID" });

    const song = await SongService.getSongById(id);
    if (!song) return res.status(404).json({ message: "Song not found" });

    return res.json(song);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Update a song by ID
export async function updateSong(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid song ID" });

    const data = UpdateSongSchema.parse(req.body);
    const updated = await SongService.updateSong(id, data);
    if (!updated) return res.status(404).json({ message: "Song not found" });

    return res.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Delete a song by ID
export async function deleteSong(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid song ID" });

    const deleted = await SongService.deleteSong(id);
    if (!deleted) return res.status(404).json({ message: "Song not found" });

    return res.json({ message: "Song deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
