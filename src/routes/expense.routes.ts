import { Router } from "express";
import {
  getAllExpenses,
  getExpenseById,
  deleteExpenseById,
  createExpense,
  updateExpensebyId,
} from "../controllers/expense.controller.js";

const expenseRouter = Router();

expenseRouter.get("/", getAllExpenses);

expenseRouter.post("/", createExpense);

expenseRouter.get("/:expenseId", getExpenseById);

expenseRouter.put("/:expenseId", updateExpensebyId);

expenseRouter.delete("/:expenseId", deleteExpenseById);

export default expenseRouter;
