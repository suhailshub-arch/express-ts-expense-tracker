import jwt from "jsonwebtoken";
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

export const validateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded.user; 
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};
