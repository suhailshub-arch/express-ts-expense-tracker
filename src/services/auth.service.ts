import { UserModel } from "../models/User.model.js";
import { IUser } from "../models/User.model.js";
import { hash, compare } from "bcrypt";
import {
  BCRYPT_SALT_ROUNDS,
  JWT_SECRET,
  JWT_EXPIRATION,
  DUMMY_PASSWORD_HASH,
} from "../config/index.js";
import jwt from "jsonwebtoken";
import { AppError } from "../types/error.js";

export interface createUserParams {
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export async function createUser({ email, password }: createUserParams) {
  try {
    const isEmailExists = await UserModel.findOne({ email });
    if (isEmailExists) {
      const err = new Error("Email already exists");
      (err as AppError).status = 409;
      throw err;
    }

    const passwordHash = await hash(password, Number(BCRYPT_SALT_ROUNDS));
    const newUser = await UserModel.create({
      email,
      passwordHash,
    }); // Create a new user with hashed password

    return newUser.email;
  } catch (error) {
    const err = new Error("");
    (err as AppError).status = 500;
    throw err;
  }
}

export async function loginUser({
  email,
  password,
}: LoginDTO): Promise<{ user: Pick<IUser, "_id" | "email">; token: string }> {

  const user = await UserModel.findOne({ email }).exec();

  // Always perform a compare(), even if user is null
  //    so timing is consistent.
  const hashToCompare = user ? user.passwordHash : DUMMY_PASSWORD_HASH; 

  const passwordValid = await compare(password, hashToCompare);

  // 3) If either user is missing or password mismatch, throw a generic error
  if (!user || !passwordValid) {
    const err = new Error("Invalid email or password");
    (err as AppError).status = 401;
    throw err;
  }

  // 4) Sign JWT
  const payload = { user: { id: user.id.toString(), email: user.email } };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: Number(JWT_EXPIRATION),
  });

  return { user: { _id: user._id, email: user.email }, token };
}
