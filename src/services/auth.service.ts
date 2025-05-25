import { UserModel } from "../models/User.model.js";
import { IUser } from "../models/User.model.js";
import { hash, compare } from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "../config/index.js";

export interface createUserParams {
  email: string;
  password: string;
}

export async function createUser({ email, password }: createUserParams) {
  try {
    const isEmailExists = await UserModel.findOne({ email });
    if (isEmailExists) {
      throw new Error("Email already exists");
    }
    console.log("Creating user with email:", email);
    const passwordHash = await hash(password, Number(BCRYPT_SALT_ROUNDS));
    if (!passwordHash) {
      throw new Error("Password hashing failed");
    }
    const newUser = await UserModel.create({
      email,
      passwordHash,
    });
    if (!newUser) {
      throw new Error("User creation failed");
    }
    console.log("User created successfully:", newUser.email);
    return newUser.email;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("User creation failed");
  }
}
