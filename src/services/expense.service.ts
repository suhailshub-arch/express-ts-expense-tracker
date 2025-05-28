import { Category, ExpenseModel, IExpense } from "../models/Expense.model.js";
import { AppError } from "../types/error.js";

interface InsertExpenseParams {
  user: string;
  amount: number;
  category: Category;
  date: Date;
  notes?: string;
}

interface updateExpenseParams {
  user: string;
  amount?: number;
  category?: Category;
  date?: Date;
  notes?: string;
  expenseId: string;
}

export async function fetchExpenses(params: {
  userId: string;
  expenseId?: string;
  start?: string;
  end?: string;
  period?: "past_week" | "last_month" | "last_3_months";
}): Promise<IExpense[] | IExpense | null> {
  const { userId, expenseId, start, end, period } = params;
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
      const filter: Record<string, any> = { user: userId };
      if (start || end) {
        filter.date = {};
        if (start) {
          filter.date.$gte = new Date(start);
        }
        if (end) {
          filter.date.$lte = new Date(end);
        }
      } else if (period) {
        const now = new Date();
        let startDate: Date;

        switch (period) {
          case "past_week":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;

          case "last_month":
            startDate = new Date(now);
            startDate.setMonth(now.getMonth() - 1);

          case "last_3_months":
            startDate = new Date(now);
            startDate.setMonth(now.getMonth() - 3);
        }
        filter.date = { $gte: startDate, $lte: now };
      }
      const expenses = await ExpenseModel.find(filter)
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

export async function insertExpense(
  params: InsertExpenseParams
): Promise<IExpense> {
  try {
    const inserted = await ExpenseModel.create({
      user: params.user,
      amount: params.amount,
      category: params.category,
      date: params.date,
      notes: params.notes,
    });
    if (!inserted) {
      const err = new Error("Error inserting expense");
      (err as AppError).status = 500;
      throw err;
    }
    return inserted;
  } catch (error) {
    const err = new Error("Error inserting expense");
    (err as AppError).status = 500;
    throw err;
  }
}

export async function updateExpense(
  params: updateExpenseParams
): Promise<boolean> {
  try {
    const upadted = await ExpenseModel.updateOne(
      {
        user: params.user,
        _id: params.expenseId,
      },
      {
        ...(params.amount !== undefined && { amount: params.amount }),
        ...(params.category !== undefined && { category: params.category }),
        ...(params.notes !== undefined && { notes: params.notes }),
        ...(params.date !== undefined && { date: params.date }),
      }
    );
    return upadted.acknowledged;
  } catch (error) {
    const err = new Error("Error updating expense");
    (err as AppError).status = 500;
    throw err;
  }
}
