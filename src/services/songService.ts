import { CreateSongInput } from "@/types/song";
import { PrismaClient, Song } from "../../generated/prisma";

const prisma = new PrismaClient();

// Create a new song
export const createSong = async (data: CreateSongInput): Promise<Song> => {
  try {
    const song = await prisma.song.create({
      data: {
        title: data.title,
        artist: data.artist,
        album: data.album,
        year: data.year,
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
  page = 1,
  pageSize = 10
): Promise<{
  songs: Song[];
  total: number;
}> => {
  try {
    const skip = (page - 1) * pageSize;
    const [songs, total] = await Promise.all([
      prisma.song.findMany({ skip, take: pageSize }),
      prisma.song.count(),
    ]);
    return { songs, total };
  } catch (error) {
    console.error("Error fetching songs:", error);
    throw error;
  }
};

// Get a single song by ID
export const getSongById = async (id: number): Promise<Song | null> => {
  try {
    return await prisma.song.findUnique({ where: { id } });
  } catch (error) {
    console.error("Error fetching song by ID:", error);
    throw error;
  }
};

// Update a song
export const updateSong = async (
  id: number,
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
export const deleteSong = async (id: number): Promise<Song | null> => {
  try {
    return await prisma.song.delete({ where: { id } });
  } catch (error) {
    console.error("Error deleting song:", error);
    throw error;
  }
};
