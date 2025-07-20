import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import songRouter from "./routes/songRoutes";
import { errorHandler } from "./middlewares/errors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CLIENT_URL
}));
app.use(express.json());

app.use("/api/songs", songRouter);

app.use(errorHandler);

app.listen(port, (err: any) => {
  if (err) {
    console.error("Error starting server:", err);
  } else {
    console.log(`Server is running on http://localhost:${port}`);
  }
});
