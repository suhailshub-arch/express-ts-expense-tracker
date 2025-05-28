import { Schema, model, Document, Types } from "mongoose";

export type Category =
  | "Groceries"
  | "Leisure"
  | "Electronics"
  | "Utilities"
  | "Clothing"
  | "Health"
  | "Others";

export interface IExpense extends Document {
  user: Types.ObjectId;
  amount: number;
  category: Category;
  notes?: string;
  date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const expenseSchema = new Schema<IExpense>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: [
        "Groceries",
        "Leisure",
        "Electronics",
        "Utilities",
        "Clothing",
        "Health",
        "Others",
      ],
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ExpenseModel = model<IExpense>("Expense", expenseSchema);
export default ExpenseModel;
