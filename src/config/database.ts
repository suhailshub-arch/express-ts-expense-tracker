import mongoose from "mongoose";
import { MONGO_URI } from "./index.js";

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to the database successfully");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw error;
    }
}