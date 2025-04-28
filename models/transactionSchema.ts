import mongoose, { Schema, Document, Types } from 'mongoose';

// Transaction Schema
export interface Transaction extends Document {
  amount: number;        // Amount of the transaction
  date: Date;            // Date of the transaction
  description: string;   // Description of the transaction
  category: string;      // Category (Food, Entertainment, etc.)
  user: Types.ObjectId;  // Reference to User document
  createdAt: Date;       // Transaction creation date
  updatedAt: Date;       // Transaction last update date
}

const transactionSchema = new Schema<Transaction>({
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Food', 'Shopping', 'Utilities', 'Other','Travel'],
    default: 'Other',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update `updatedAt` field before updating any document
transactionSchema.pre('updateOne', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Transaction Model
const TransactionModel = mongoose.models.Transaction || mongoose.model<Transaction>('Transaction', transactionSchema);

export { TransactionModel };
