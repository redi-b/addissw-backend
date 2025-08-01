import { Router } from "express";
import {
  getCurrentUser,
  signIn,
  signOut,
  signUp,
} from "../controllers/authController";
import { authenticate } from "@/middlewares/auth";

const router = Router();

// Sign up route
router.post("/signup", signUp);

// Sign in route
router.post("/signin", signIn);

// Sign out route
router.post("/signout", authenticate, signOut)

// Get current user
router.get("/me", authenticate, getCurrentUser)

export default router;
