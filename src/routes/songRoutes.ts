import { Router } from "express";
import {
  createSong,
  getAllSongs,
  getSongById,
  updateSong,
  deleteSong,
  seedSongsIfEmpty,
} from "../controllers/songController";
import { authenticate } from "../middlewares/auth";

const router = Router();

// Create a new song
router.post("/", authenticate, createSong);

// Get all songs with pagination
router.get("/", authenticate, getAllSongs);

// Get a single song by ID
router.get("/:id", authenticate, getSongById);

// Update a song by ID
router.put("/:id", authenticate, updateSong);

// Delete a song by ID
router.delete("/:id", authenticate, deleteSong);

// Seed songs if the database is empty
router.post("/seed", authenticate, seedSongsIfEmpty)

export default router;
