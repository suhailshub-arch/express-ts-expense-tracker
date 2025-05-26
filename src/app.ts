import express from 'express';
import authRouter from './routes/auth.routes.js';
import expenseRouter from './routes/expense.routes.js';
import { validateJWT } from './middleware/auth.middleware.js';

const app = express();
app.use(express.json());

app.use('/api/auth', authRouter);

app.use('/api/expenses', validateJWT, expenseRouter);

export default app;