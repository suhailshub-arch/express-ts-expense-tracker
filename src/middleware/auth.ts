import { verify } from "jsonwebtoken";
import { JWT_SECRET } from "../config/index.js";
import { NextFunction, Request, Response } from "express";

interface JwtPayload {
  user: {
    id: string;
    email: string;
  };
  iat: number;
  exp: number;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = verify(token, JWT_SECRET) as JwtPayload;
    console.log("Decoded JWT:", decoded);
    req.user = decoded.user; // Assuming you want to attach the user info to the request object
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
