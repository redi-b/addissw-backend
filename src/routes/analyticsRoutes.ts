import { Router } from "express";
import {
  getSongsPerArtist,
  getSongsPerYear,
  getMonthlySongCreation,
  getTopAlbums,
} from "../controllers/songController";
import { authenticate } from "../middlewares/auth";

const router = Router();

// Get number of songs per artist
router.get("/per-artist", authenticate, getSongsPerArtist);

// Get number of songs per year
router.get("/per-year", authenticate, getSongsPerYear);

// Get monthly song creation stats
router.get("/monthly", authenticate, getMonthlySongCreation);

// Get top albums
router.get("/top-albums", authenticate, getTopAlbums);

export default router;
