import { Request, Response } from "express";
import { ZodError } from "zod";

import { UserSchema } from "../validators/userValidator";
import * as UserService from "../services/userService";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { AuthRequest } from "../middlewares/auth";

// Sign up
export const signUp = async (req: Request, res: Response) => {
  try {
    const data = UserSchema.parse(req.body);

    data.password = bcrypt.hashSync(data.password, 10);

    const user = await UserService.createUser(data);
    return res.status(201).json({
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
    });
  } catch (err: any) {
    if (err instanceof ZodError) {
      const errors = err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return res.status(400).json({
        message: "Validation failed.",
        errors,
      });
    }
    if (err.name === "MongoServerError" && err.code === 11000) {
      return res.status(409).json({
        message: "A user with this username already exists.",
      });
    }
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Sign in
export const signIn = async (req: Request, res: Response) => {
  try {
    const { username, password } = UserSchema.parse(req.body);

    const user = await UserService.findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      })
    );

    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return res.status(400).json({
        message: "Validation failed.",
        errors,
      });
    }
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Sign out
export const signOut = (req: Request, res: Response) => {
  try {
    res.setHeader(
      "Set-Cookie",
      serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: new Date(0),
      })
    );

    return res.status(200).json({ message: "Signed out successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get current user
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  try {
    const user = await UserService.findUserByUsername(req.user.username);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
