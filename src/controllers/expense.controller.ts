import { NextFunction, Request, Response } from "express";
import { AppError } from "../types/error.js";
import { fetchExpenses, deleteExpense } from "../services/expense.service.js";

export const getAllExpenses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user!; // request.user is defined by the validateJWT middleware
    const allExpenses = await fetchExpenses({ userId: id });
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
    console.log("getExpenseById route hit");
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
    console.log("deleteExpenseById route hit");
    const { id } = req.user!; // request.user is defined by the validateJWT middleware
    const { expenseId } = req.params;
    console.log("User ID:", id, "Expense ID:", expenseId);
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
