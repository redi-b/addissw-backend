import { Router } from "express";
import {
  createSong,
  getAllSongs,
  getSongById,
  updateSong,
  deleteSong,
} from "../controllers/songController";

const router = Router();

// Create a new song
router.post("/", createSong);

// Get all songs with pagination
router.get("/", getAllSongs);

// Get a single song by ID
router.get("/:id", getSongById);

// Update a song by ID
router.put("/:id", updateSong);

// Delete a song by ID
router.delete("/:id", deleteSong);

export default router;
