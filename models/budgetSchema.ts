import mongoose, { Schema, Document, Types } from "mongoose";

export interface Budget extends Document {
  user: Types.ObjectId; // Which user owns this budget
  timeframe: "week" | "month";
  startDate: Date;
  categories: {
    category: string;
    amount: number;
  }[];
  createdAt: Date;
}

const budgetSchema = new Schema<Budget>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FinancialUserModel",
    required: true,
  },
  timeframe: {
    type: String,
    enum: ["week", "month"],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  categories: [
    {
      category: { type: String, required: true },
      amount: { type: Number, required: true },
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const BudgetModel = mongoose.models.BudgetModel || mongoose.model<Budget>("BudgetModel", budgetSchema);

export { BudgetModel };
