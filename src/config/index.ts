import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';
export const JWT_SECRET = 'your_jwt_secret_here';
export const JWT_EXPIRATION = '1h'; // JWT expiration time