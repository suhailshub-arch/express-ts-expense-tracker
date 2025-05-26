import { Router } from "express";
import {
  getAllExpenses,
  getExpenseById,
  deleteExpenseById,
} from "../controllers/expense.controller.js";

const expenseRouter = Router();

expenseRouter.get("/", getAllExpenses);

expenseRouter.post("/", () => {});

expenseRouter.get("/:expenseId", getExpenseById);

expenseRouter.put("/:iexpenseIdd", () => {});

expenseRouter.delete("/:expenseId", deleteExpenseById);

export default expenseRouter;
