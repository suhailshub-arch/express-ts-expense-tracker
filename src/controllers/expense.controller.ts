import { NextFunction, Request, Response } from "express";
import { AppError } from "../types/error.js";
import {
  fetchExpenses,
  deleteExpense,
  insertExpense,
  updateExpense,
} from "../services/expense.service.js";
import { Category } from "../models/Expense.model.js";
import { RequestHandler } from "express";
import { ParsedQs } from "qs";

export interface CreateExpenseDTO {
  amount: number;
  category: Category;
  date: string; //ISO UTC timestamp
  notes?: string;
}

interface ListQuery extends ParsedQs {
  start?: string;
  end?: string;
  period?: "past_week" | "last_month" | "last_3_months";
}

function getQueryString(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return undefined;
}

export const getAllExpenses: RequestHandler<{}, {}, {}, ListQuery> = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user!; // request.user is defined by the validateJWT middleware
    const start = getQueryString(req.query.start);
    const end = getQueryString(req.query.end);
    const period = getQueryString(req.query.period) as ListQuery["period"];
    const allExpenses = await fetchExpenses({ userId: id, start, end, period });
    if (!allExpenses) {
      const err = new Error("No expenses found for this user");
      (err as AppError).status = 404;
      throw err;
    }
    res.status(200).json({
      success: true,
      message: "Expenses fetched successfully",
      data: allExpenses,
    });
  } catch (err: unknown) {
    let status = 500;
    let message = "Internal server error";

    if (err instanceof Error) {
      message = err.message;
      if (
        (err as AppError).status &&
        typeof (err as AppError).status === "number"
      ) {
        status = (err as AppError).status!;
      }
    }
    res.status(status).json({ success: false, message });
  }
};

export const getExpenseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user!; // request.user is defined by the validateJWT middleware
    const { expenseId } = req.params;

    const expense = await fetchExpenses({ userId: id, expenseId });
    res.status(200).json({
      success: true,
      message: "Expense fetched successfully",
      data: expense,
    });
  } catch (err: unknown) {
    let status = 500;
    let message = "Internal server error";

    if (err instanceof Error) {
      message = err.message;
      if (
        (err as AppError).status &&
        typeof (err as AppError).status === "number"
      ) {
        status = (err as AppError).status!;
      }
    }
    res.status(status).json({ success: false, message });
  }
};

export const deleteExpenseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user!; // request.user is defined by the validateJWT middleware
    const { expenseId } = req.params;
    const isExpenseDeleted = await deleteExpense({ userId: id, expenseId });
    if (!isExpenseDeleted) {
      const err = new Error("Expense not found");
      (err as AppError).status = 404;
      throw err;
    }
    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (err: unknown) {
    let status = 500;
    let message = "Internal server error";
    if (err instanceof Error) {
      message = err.message;
      if (
        (err as AppError).status &&
        typeof (err as AppError).status === "number"
      ) {
        status = (err as AppError).status!;
      }
    }
    res.status(status).json({
      success: false,
      message,
    });
  }
};

export const createExpense: RequestHandler<{}, {}, CreateExpenseDTO> = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user!; // request.user is defined by the validateJWT middleware
    const { amount, category, date, notes } = req.body;

    const newExpense = await insertExpense({
      user: id,
      amount,
      category,
      date: new Date(date),
      notes,
    });
    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: newExpense,
    });
  } catch (err: unknown) {
    let status = 500;
    let message = "Internal server error";

    if (err instanceof Error) {
      message = err.message;
      if (
        (err as AppError).status &&
        typeof (err as AppError).status === "number"
      ) {
        status = (err as AppError).status!;
      }
    }
    res.status(status).json({ success: false, message });
  }
};

export const updateExpensebyId: RequestHandler<
  {},
  {},
  Partial<CreateExpenseDTO>
> = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user!;
    const { expenseId } = req.params;
    const updated = await updateExpense({
      user: id,
      ...req.body,
      expenseId,
    });
    if (updated === true) {
      res.status(204).json({
        success: true,
      });
    } else {
      const err = new Error("Error updating expense");
      (err as AppError).status = 500;
      throw err;
    }
  } catch (err: unknown) {
    let message = "Internal server error";
    let status = 500;

    if (err instanceof Error) {
      message = err.message;
      if (
        (err as AppError).status &&
        typeof (err as AppError).status === "number"
      ) {
        status = (err as AppError).status!;
      }
    }
    res.status(status).json({
      success: false,
      message,
    });
  }
};
