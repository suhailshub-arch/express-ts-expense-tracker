import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';
export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION; // JWT expiration time
export const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);