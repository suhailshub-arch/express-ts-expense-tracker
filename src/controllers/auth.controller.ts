import { NextFunction, Request, Response } from "express";
import { createUser } from "../services/auth.service.js";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    console.log("Register route hit with email:", email);

    const createUserResp = await createUser({ email, password });
    if (!createUserResp) {
      res.status(400).json({ message: "User creation failed" });
      return next();
    }
    res.status(201).json({
      message: "User registered successfully",
      sucess: true,
      user: createUserResp,
    });
    return next();
  } catch (error) {
    console.error("Error in register route:", error);
    res.status(500).json({ message: "Internal server error" });
    return next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Login route hit");
};
