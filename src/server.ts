import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import songRouter from "./routes/songRoutes";
import authRouter from "./routes/authRoutes";
import { errorHandler } from "./middlewares/errors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);
app.use(express.json());

app.use("/api/songs", songRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler);

app.listen(port, (err: any) => {
  if (err) {
    console.error("Error starting server:", err);
  } else {
    console.log(`Server is running on http://localhost:${port}`);
  }
});
