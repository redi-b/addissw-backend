import { CreateSongInput } from "../types";
import { seedData } from "../seed/songs";

import { Song } from "@prisma/client";
import prisma from "../lib"

// Create a new song
export const createSong = async (
  data: CreateSongInput & { userId: string }
): Promise<Song> => {
  try {
    const song = await prisma.song.create({
      data: {
        title: data.title,
        artist: data.artist,
        album: data.album,
        year: data.year,
        userId: data.userId,
      },
    });
    return song;
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
    const [songs, total] = await Promise.all([
      prisma.song.findMany({ where: { userId }, skip, take: pageSize }),
      prisma.song.count({ where: { userId } }),
    ]);
    return { songs, total };
  } catch (error) {
    console.error("Error fetching songs:", error);
    throw error;
  }
};

// Get a single song by ID
export const getSongById = async (id: string): Promise<Song | null> => {
  try {
    return await prisma.song.findUnique({ where: { id } });
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
): Promise<Song> => {
  try {
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    const song = await prisma.song.update({
      where: { id },
      data: filteredUpdates,
    });

    return song;
  } catch (error) {
    console.error("Error updating song:", error);
    throw error;
  }
};

// Delete a song
export const deleteSong = async (id: string): Promise<Song | null> => {
  try {
    return await prisma.song.delete({ where: { id } });
  } catch (error) {
    console.error("Error deleting song:", error);
    throw error;
  }
};

// Seed songs if the database is empty
export async function seedSongsIfEmpty(userId: string): Promise<number> {
  const existing = await prisma.song.count();
  if (existing > 0) return 0;

  await prisma.song.createMany({
    data: seedData.map((song) => ({ ...song, userId })),
  });

  return seedData.length;
}
