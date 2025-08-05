import { Song as SongModel } from "../models/song";
import { CreateSongInput, Song } from "../types";
import { seedData } from "../seed/songs";

import { Types } from "mongoose";

// Create a new song
export const createSong = async (
  data: CreateSongInput & { userId: string }
): Promise<Song> => {
  try {
    const song = await SongModel.create({
      title: data.title,
      artist: data.artist,
      album: data.album,
      year: data.year,
      userId: data.userId,
    });

    return {
      id: song._id.toHexString(),
      title: song.title,
      artist: song.artist,
      album: song.album || undefined,
      year: song.year || undefined,
      userId: song.userId.toString(),
      createdAt: song.createdAt,
    };
  } catch (error) {
    console.error("Error creating song:", error);
    throw error;
  }
};

// Get songs with pagination
export const getSongs = async (
  userId: string,
  page = 1,
  pageSize = 10
): Promise<{
  songs: Song[];
  total: number;
}> => {
  try {
    const skip = (page - 1) * pageSize;
    const songs = await SongModel.aggregate([
      {
        $project: {
          id: { $toString: "$_id" },
          title: 1,
          artist: 1,
          album: 1,
          year: 1,
          userId: 1,
          createdAt: 1,
        },
      },
      { $match: { userId: new Types.ObjectId(userId) } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: pageSize },
    ]);

    // Count total matching songs
    const totalResult = await SongModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      { $count: "total" },
    ]);

    return { songs, total: totalResult[0]?.total || 0 };
  } catch (error) {
    console.error("Error fetching songs:", error);
    throw error;
  }
};

// Get a single song by ID
export const getSongById = async (id: string): Promise<Song | null> => {
  try {
    const song = await SongModel.findById(id);
    if (!song) return null;
    return {
      id: song._id.toHexString(),
      title: song.title,
      artist: song.artist,
      album: song.album || undefined,
      year: song.year || undefined,
      userId: song.userId.toString(),
      createdAt: song.createdAt,
    };
  } catch (error) {
    console.error("Error fetching song by ID:", error);
    throw error;
  }
};

// Update a song
export const updateSong = async (
  id: string,
  updates: {
    title?: string;
    artist?: string;
    album?: string;
    year?: number;
  }
): Promise<Song | null> => {
  try {
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    const song = await SongModel.findByIdAndUpdate(id, filteredUpdates, {
      new: true,
    });

    if (!song) return null;

    return {
      id: song._id.toHexString(),
      title: song.title,
      artist: song.artist,
      album: song.album || undefined,
      year: song.year || undefined,
      userId: song.userId.toString(),
      createdAt: song.createdAt,
    };
  } catch (error) {
    console.error("Error updating song:", error);
    throw error;
  }
};

// Delete a song
export const deleteSong = async (id: string): Promise<Song | null> => {
  try {
    const song = await SongModel.findByIdAndDelete(id);
    if (!song) return null;

    return {
      id: song._id.toHexString(),
      title: song.title,
      artist: song.artist,
      album: song.album || undefined,
      year: song.year || undefined,
      userId: song.userId.toString(),
      createdAt: song.createdAt,
    };
  } catch (error) {
    console.error("Error deleting song:", error);
    throw error;
  }
};

// Seed songs if the database is empty
export async function seedSongsIfEmpty(userId: string): Promise<number> {
  const existing = await SongModel.countDocuments({
    userId: new Types.ObjectId(userId),
  });
  if (existing > 0) return 0;

  await SongModel.create(
    seedData.map((song) => ({ ...song, userId }))
  );

  return seedData.length;
}
