import { Schema, Types, model } from "mongoose";

const songSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
    },
    album: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear(),
    },
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

songSchema.index({ title: 1, artist: 1, userId: 1 }, { unique: true });

export const Song = model("Song", songSchema);
