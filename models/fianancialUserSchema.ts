import mongoose, { Schema, Document, Types } from "mongoose";


// 🔹 User Interface
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  transactions: Types.ObjectId[];
  createdAt: Date;
  budgets:  Types.ObjectId[]; // << Add this line
}

// 🔹 User Schema
const financialUserSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  budgets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BudgetModel", // New Budget model ka reference
    }
  ]
  
});

// 🔹 User Model
const FinancialUserModel =
  mongoose.models.FinancialUserModel || mongoose.model<User>("FinancialUserModel", financialUserSchema);

export { FinancialUserModel };
