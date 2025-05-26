import { NextFunction, Request, Response } from "express";
import { createUser, loginUser } from "../services/auth.service.js";
import { AppError } from "../types/error.js";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    console.log("Register route hit with email:", email);

    const createUserResp = await createUser({ email, password });

    res.status(201).json({
      message: "User registered successfully",
      sucess: true,
      user: createUserResp,
    });
    return next();
  } catch (err: unknown) {
    let status = 500;
    let message = 'Internal server error';

    if (err instanceof Error) {
      message = err.message;
      if ((err as AppError).status && typeof (err as AppError).status === 'number') {
        status = (err as AppError).status!;
      }
    }

    res.status(status).json({ success: false, message });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser({ email, password });

    res.status(200).json({
      success: true,
      message: 'User logged in',
      data: { user, token },
    });
  } catch (err: unknown) {
    let status = 500;
    let message = 'Internal server error';

    if (err instanceof Error) {
      message = err.message;
      if ((err as AppError).status && typeof (err as AppError).status === 'number') {
        status = (err as AppError).status!;
      }
    }

    res.status(status).json({ success: false, message });
  }
};
