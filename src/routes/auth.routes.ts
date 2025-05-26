import { Router } from "express";
import { registerUser, login } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerUser);

authRouter.post("/login", login);

export default authRouter;
