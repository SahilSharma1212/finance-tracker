import mongoose, { Schema, Document, Types } from "mongoose";

// 🔹 User Interface
export interface User extends Document {
  username: string;               // Username of the user
  email: string;                  // Email of the user
  password: string;               // Hashed password
  transactions: Types.ObjectId[]; // Array of Transaction ObjectIds
  createdAt: Date;                // User creation date
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
      ref: "Transaction", // Reference to Transaction model
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🔹 User Model
const FinancialUserModel =
  mongoose.models.FinancialUserModel || mongoose.model<User>("FinancialUserModel", financialUserSchema);

export { FinancialUserModel };
