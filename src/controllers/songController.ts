import { Response } from "express";
import { z } from "zod";

import {
  CreateSongSchema,
  UpdateSongSchema,
} from "../validators/songValidator";
import * as SongService from "../services/songService";
import { Prisma } from "@prisma/client";
import { AuthRequest } from "../middlewares/auth";

// Create a new song
export async function createSong(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const data = CreateSongSchema.parse(req.body);
    const song = await SongService.createSong({ ...data, userId: req.user.id });
    return res.status(201).json(song);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.message });
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(409).json({
          message: "A song with this title and artist already exists.",
        });
      }
    }
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Get paginated songs
export async function getAllSongs(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 5;

    if (page < 1 || pageSize < 1)
      return res.status(400).json({ message: "Invalid pagination parameters" });

    const result = await SongService.getSongs(req.user.id, page, pageSize);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Get a single song by ID
export async function getSongById(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "Invalid song ID" });

    const song = await SongService.getSongById(id);
    if (!song) return res.status(404).json({ message: "Song not found" });
    if (song.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.json(song);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Update a song by ID
export async function updateSong(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "Invalid song ID" });

    const song = await SongService.getSongById(id);
    if (!song) return res.status(404).json({ message: "Song not found" });

    if (song.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const data = UpdateSongSchema.parse(req.body);
    const updated = await SongService.updateSong(id, data);
    if (!updated) return res.status(500).json({ message: "Error updating song" });

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
export async function deleteSong(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "Invalid song ID" });

    const song = await SongService.getSongById(id);
    if (!song) return res.status(404).json({ message: "Song not found" });

    if (song.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const deleted = await SongService.deleteSong(id);
    if (!deleted) return res.status(500).json({ message: "Error deleting song" });

    return res.json({ message: "Song deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function seedSongsIfEmpty(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  try {
    const seededCount = await SongService.seedSongsIfEmpty(req.user.id);
    if (seededCount === 0) {
      return res
        .status(400)
        .json({ message: "Songs already exist. Skipping seeding." });
    }
    return res.json({ message: `Seeded ${seededCount} songs successfully.` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to seed songs." });
  }
}
