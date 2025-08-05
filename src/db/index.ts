import mongoose from "mongoose";

export async function connectToDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not defined in environment variables.");
    process.exit(1);
  }

  console.log("Connecting to database...");

  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to database successfully");
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
}
