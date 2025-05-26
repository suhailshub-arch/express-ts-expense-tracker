import { Router } from "express";
import { getAllExpenses, getExpenseById } from "../controllers/expense.controller.js";

const expenseRouter = Router();

expenseRouter.get("/", getAllExpenses);

expenseRouter.post("/", () => {});

expenseRouter.get("/:expenseId", getExpenseById);

expenseRouter.put("/:id", () => {});

expenseRouter.delete("/:id", () => {});

export default expenseRouter;
