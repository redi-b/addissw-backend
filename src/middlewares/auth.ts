import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { parse, serialize } from "cookie";

export interface AuthRequest extends Request {
  user?: { id: string; username: string };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) throw new Error("No cookies found");

    const { token } = parse(cookieHeader);
    if (!token) throw new Error("No token");

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      username: string;
    };

    req.user = payload;
    return next();
  } catch (err: any) {
    console.error("Auth failed:", err.message);

    // Clear token cookie
    const clearCookie = serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(0),
    });

    res.setHeader("Set-Cookie", clearCookie);
    return res.status(401).json({ message: "Authentication failed." });
  }
};
