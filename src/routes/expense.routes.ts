import { Router } from "express";
import {
  getAllExpenses,
  getExpenseById,
  deleteExpenseById,
  createExpense,
  updateExpensebyId,
} from "../controllers/expense.controller.js";
import { query } from "express-validator";
import { handleValidationErrors } from "../middleware/expense.validation.middleware.js";

const expenseRouter = Router();

expenseRouter.get(
  "/",
  [
    query("start")
      .optional()
      .isISO8601()
      .withMessage("start must be a valid ISO-8601 date")
      .escape(),
    query("end")
      .optional()
      .isISO8601()
      .withMessage("end must be a valid ISO-8601 date")
      .escape(),
    query("period")
      .optional()
      .isIn(["past_week", "last_month", "last_3_month"])
      .withMessage("period must be one of past_week, last_week, past_3_months")
      .escape(),
    handleValidationErrors,
  ],
  getAllExpenses
);

expenseRouter.post("/", createExpense);

expenseRouter.get("/:expenseId", getExpenseById);

expenseRouter.put("/:expenseId", updateExpensebyId);

expenseRouter.delete("/:expenseId", deleteExpenseById);

export default expenseRouter;
