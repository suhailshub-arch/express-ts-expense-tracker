import { ExpenseModel, IExpense } from "../models/Expense.model.js";
import { AppError } from "../types/error.js";

export async function fetchExpenses(params: {
  userId: string;
  expenseId?: string;
}): Promise<IExpense[] | IExpense | null> {
  const { userId, expenseId } = params;
  try {
    if (expenseId) {
      const expense = await ExpenseModel.findOne({
        _id: expenseId,
        user: userId,
      }).exec();
      if (!expense) {
        const err = new Error("Expense not found");
        (err as AppError).status = 404;
        throw err;
      }
      return expense;
    } else {
      const expenses = await ExpenseModel.find({ user: userId })
        .sort({
          date: -1,
        })
        .exec();
      if (expenses.length === 0) {
        console.error("No expenses found for this user");
        const err = new Error("No expenses found for this user");
        (err as AppError).status = 404;
        throw err;
      }
      return expenses;
    }
  } catch (error) {
    const err = new Error("Error fetching expense");
    (err as AppError).status = 500;
    throw err;
  }
}

export async function deleteExpense(params: {
  userId: string;
  expenseId: string;
}): Promise<Boolean> {
  console.log("deleteExpense service called with params:", params);
  const { userId, expenseId } = params;
  try {
    const isDeleteed = await ExpenseModel.deleteOne({
      _id: expenseId,
      user: userId,
    });
    if (isDeleteed.deletedCount === 0) {
      const err = new Error("Expense not found or already deleted");
      (err as AppError).status = 404;
      throw err;
    }
    return isDeleteed.acknowledged;
  } catch (error) {
    const err = new Error("Error deleting expense");
    (err as AppError).status = 500;
    throw err;
  }
}
